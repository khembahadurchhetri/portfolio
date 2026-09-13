import {mkdir,copyFile,readdir} from 'node:fs/promises';
for(const dir of ['assets','admin']){
 await mkdir('public/'+dir,{recursive:true});
 for(const entry of await readdir(dir,{withFileTypes:true})){
  if(entry.isFile() && /\.(js|css|png|jpe?g|svg|webp|pdf|mp3|json)$/.test(entry.name))await copyFile(dir+'/'+entry.name,'public/'+dir+'/'+entry.name);
 }
}
console.log('Prepared public website assets; no local database or SQL files copied.');
