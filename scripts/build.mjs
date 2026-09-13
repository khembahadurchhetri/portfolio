import { mkdir, copyFile, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
// Explicitly publish only website files; never database, SQL or server sources.
const output = path.resolve('public-dist');
if (path.dirname(output) !== process.cwd() || path.basename(output) !== 'public-dist') throw new Error('Unexpected build output path.');
await rm(output, { recursive:true, force:true });
await mkdir(output, { recursive:true });
for (const file of ['index.html','entry.html']) await copyFile(file, path.join(output,file));
async function copyPublic(directory) {
  await mkdir(path.join(output,directory),{recursive:true});
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    if (entry.name.startsWith('.')) continue;
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())await copyPublic(file);
    else if(/\.(html|css|js|json|png|jpe?g|webp|svg|pdf|mp3|ico|woff2?)$/i.test(entry.name))await copyFile(file,path.join(output,file));
  }
}
for (const directory of ['assets','admin'])await copyPublic(directory);
if(await stat('project3').then(info=>info.isDirectory()).catch(()=>false))await copyPublic('project3');
console.log('Static portfolio built in public-dist. Database and server files excluded.');
