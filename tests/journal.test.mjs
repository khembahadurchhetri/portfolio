import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

test('journal mobile pagination, filters, desktop resize and empty content', async () => {
  class Element {
    constructor(){this.children=[];this.handlers={};this.attrs={};this.textContent='';}
    append(...items){this.children.push(...items);}
    replaceChildren(){this.children=[];}
    setAttribute(k,v){this.attrs[k]=v;}
    addEventListener(k,fn){this.handlers[k]=fn;}
    querySelectorAll(){return this.children;}
    click(){if(!this.disabled)this.handlers.click();}
  }
  const selectors=['.journal-filters','.journal-grid','#journal-prev','#journal-next','#journal-page','#journal-mode'];
  const elements=Object.fromEntries(selectors.map(s=>[s,new Element()]));
  const media={matches:true,addEventListener(_,fn){this.change=fn;}};
  const entries=Array.from({length:6},(_,i)=>({id:String(i),title:'Entry '+i,category:i%2?'Books':'Notes',text:'Example',sample:true}));
  const code=await readFile('assets/journal.js','utf8');
  vm.runInNewContext(code,{window:{},document:{querySelector:s=>elements[s],createElement:()=>new Element()},matchMedia:()=>media,fetch:async()=>({ok:true,headers:{get:()=> 'application/json'},json:async()=>entries})});
  await new Promise(resolve=>setImmediate(resolve));
  const grid=elements['.journal-grid'];
  assert.equal(grid.children.length,1);assert.equal(elements['#journal-page'].textContent,'1 / 6');
  assert.equal(grid.children[0].children[3].textContent,'Open entry \u2192');
  assert.equal(elements['#journal-prev'].disabled,true);
  elements['#journal-next'].click();assert.equal(elements['#journal-page'].textContent,'2 / 6');
  assert.equal(grid.children[0].children[1].textContent,'Entry 1');
  elements['.journal-filters'].children.find(b=>b.textContent==='Books').click();
  assert.equal(elements['#journal-page'].textContent,'1 / 3');assert.equal(grid.children[0].children[0].textContent,'Books · Sample');
  media.matches=false;media.change();assert.equal(grid.children.length,3);assert.equal(elements['#journal-next'].disabled,true);
  entries.splice(0);media.change();assert.equal(grid.textContent,'No entries here yet.');assert.equal(elements['#journal-page'].textContent,'1 / 1');
});
