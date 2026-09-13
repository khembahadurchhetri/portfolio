import { DatabaseSync, backup } from 'node:sqlite';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Export stays inside ignored data/: it may contain private journal content.
const source=path.resolve(process.env.DATA_DIR || 'data','journal.sqlite');
const directory=path.resolve('data','migration');
await mkdir(directory,{recursive:true});
const db=new DatabaseSync(source,{readOnly:true});
const quote=value=>"'"+String(value).replaceAll("'","''")+"'";
const stableId=id=>{
  const hex=createHash('sha256').update('portfolio-local-journal:'+id).digest('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-5${hex.slice(13,16)}-a${hex.slice(17,20)}-${hex.slice(20,32)}`;
};
try {
  const rows=db.prepare('SELECT * FROM posts ORDER BY id').all();
  const media=db.prepare('SELECT count(*) AS count FROM media').get().count;
  const stamp=new Date().toISOString().replaceAll(':','-');
  await backup(db,path.join(directory,`journal-backup-${stamp}.sqlite`));
  const statements=[];
  const counts={public:0,private:0,draft:0};
  for(const row of rows){
    const entry=JSON.parse(row.content);
    if(!Object.hasOwn(counts,row.visibility))throw new Error('Unexpected visibility; export stopped.');
    const image=entry.image||'';
    if(image && image!=='/assets/journal-ai-lake.png')throw new Error('An entry has an uploaded attachment. It needs a media migration before SQL export. Backup is safe; no database was changed.');
    for(const [key,max] of [['title',140],['category',60],['text',20000],['url',2000]]){
      const value=entry[key]||'';
      if(typeof value!=='string'||value.length>max||(['title','category'].includes(key)&&!value.trim()))throw new Error(`Entry has invalid ${key}; export stopped.`);
    }
    if(entry.url&&!/^https?:\/\//.test(entry.url))throw new Error('Entry has an unsupported link; export stopped.');
    if(!Number.isFinite(Date.parse(row.updated)))throw new Error('Invalid saved timestamp; export stopped.');
    counts[row.visibility]++;
    const values=[stableId(row.id),entry.title,entry.category,entry.text||'',entry.url||'',image,row.visibility].map(quote);
    values.push(entry.sample===true?'true':'false',quote(row.updated));
    statements.push(`insert into public.portfolio_journal_posts (id,title,category,text,url,image,visibility,sample,updated) values (${values.join(',')}) on conflict (id) do nothing;`);
  }
  const sql=[
    '-- PRIVATE MIGRATION FILE: do not commit or publish. Run only in the selected 1t1g Supabase SQL editor.',
    '-- Stable IDs make reruns safe: existing rows are never overwritten. No Auth credentials are exported.',
    'begin;',...statements,'commit;',
    `select visibility, count(*) as imported_entries from public.portfolio_journal_posts where id in (${rows.length?rows.map(row=>quote(stableId(row.id))).join(','):'null'}) group by visibility;`,''
  ].join('\n');
  const output=path.join(directory,'import-local-journal.sql');
  await writeFile(output,sql,{encoding:'utf8',mode:0o600});
  console.log(JSON.stringify({sourceEntries:rows.length,visibility:counts,storedUploads:media,exportedEntries:statements.length,output,backupCreated:true}));
} finally {db.close();}
