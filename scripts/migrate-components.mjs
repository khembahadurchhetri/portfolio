// One-time migration utility; do not rerun after editing the React components.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import parse from 'html-react-parser';
const source=await readFile('index.html','utf8');
if(!source.includes('<section id="hero">'))throw new Error('Migration already completed. Edit components directly.');
await mkdir('data/refactor-backup',{recursive:true});
await writeFile('data/refactor-backup/index.html',source);
for(const dir of ['app','app/admin','app/entry','components/portfolio','components/admin','styles'])await mkdir(dir,{recursive:true});
const styles=[...source.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]);
await writeFile('styles/portfolio.css',styles.join('\n'));
const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim());
await writeFile('assets/portfolio.js',`(() => {\n${scripts.at(-1)}\n})();\n`);
function jsx(node){
 if(node===null||node===undefined||typeof node==='boolean')return '';
 if(Array.isArray(node))return node.map(jsx).join('');
 if(typeof node==='string'||typeof node==='number')return `{${JSON.stringify(node)}}`;
 const tag=node.type;
 const props=Object.entries(node.props).filter(([k])=>k!=='children').map(([key,value])=>` ${key}={${JSON.stringify(value)}}`).join('');
 const content=jsx(node.props.children);
 return content?`<${tag}${props}>${content}</${tag}>`:`<${tag}${props} />`;
}
async function component(name,html,dir='portfolio'){
 html=html.replaceAll('src="assets/','src="/assets/').replaceAll('href="assets/','href="/assets/');
 await writeFile(`components/${dir}/${name}.jsx`,`export default function ${name}() {\n  return <>${jsx(parse(html))}</>;\n}\n`);
}
const body=source.match(/<body>([\s\S]*?)<\/body>/)[1];
const sections=[...body.matchAll(/<section\b[\s\S]*?<\/section>/g)];
await component('Navigation',body.slice(0,sections[0].index));
const names=[];
for(const section of sections){const id=section[0].match(/id="([^"]+)"/)[1];const name=id[0].toUpperCase()+id.slice(1);names.push(name);await component(name,section[0]);}
await component('Ticker',body.slice(sections[0].index+sections[0][0].length,sections[1].index));
await component('Footer',body.match(/<footer>[\s\S]*?<\/footer>/)[0]);
const all=['Navigation','Hero','Ticker',...names.slice(1),'Footer'];
await writeFile('app/page.jsx',all.map(name=>`import ${name} from '../components/portfolio/${name}';`).join('\n')+`\nimport PageScripts from '../components/PageScripts';\nimport SubmissionForm from '../components/SubmissionForm';\nimport '../styles/portfolio.css';\nimport '../assets/scenery.css';\nexport default function Home() { return <>${all.map(name=>`<${name} />${name==='Journal'?'<SubmissionForm />':''}`).join('')}<PageScripts kind="home" /></>; }\n`);
const admin=await readFile('admin/index.html','utf8');
await component('Studio',admin.match(/<body>([\s\S]*?)<\/body>/)[1],'admin');
await writeFile('app/admin/page.jsx',`import Studio from '../../components/admin/Studio';\nimport PageScripts from '../../components/PageScripts';\nimport '../../admin/studio.css';\nexport const metadata={title:'Journal Studio · Khem',robots:{index:false,follow:false}};\nexport default function Admin(){return <><Studio/><PageScripts kind="admin"/></>;}\n`);
const entry=await readFile('entry.html','utf8');
await component('Entry',entry.match(/<body>([\s\S]*?)<\/body>/)[1],'portfolio');
await writeFile('app/entry/page.jsx',`import Entry from '../../components/portfolio/Entry';\nimport PageScripts from '../../components/PageScripts';\nimport '../../admin/studio.css';\nexport const metadata={title:'Journal · Khem'};\nexport default function JournalEntry(){return <><Entry/><PageScripts kind="entry"/></>;}\n`);
console.log('Extracted page sections into React JSX components and CSS. Original backed up privately.');
