import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

test('journal exposes every entry for scrolling and resets scrolling when filtering', async () => {
  class Element {
    constructor(){this.children=[];this.handlers={};this.attrs={};this.textContent='';}
    append(...items){for(const item of items)this.children.push(...(item.fragment?item.children:[item]));}
    replaceChildren(){this.children=[];}
    setAttribute(k,v){this.attrs[k]=v;}
    addEventListener(k,fn){this.handlers[k]=fn;}
    querySelectorAll(){return this.children;}
    click(){if(!this.disabled)this.handlers.click();}
    focus(){}
    setPointerCapture(){}
  }
  const selectors=['.journal-filters','.journal-grid','.journal-pagination','#journal-mode'];
  const elements=Object.fromEntries(selectors.map(s=>[s,new Element()]));
  const media={matches:true,addEventListener(_,fn){this.change=fn;}};
  const entries=Array.from({length:6},(_,i)=>({id:String(i),title:'Entry '+i,category:i%2?'Books':'Notes',text:'Example',sample:true}));
  const code=await readFile('assets/journal.js','utf8');
  vm.runInNewContext(code,{window:{},document:{querySelector:s=>elements[s],createElement:()=>new Element(),createDocumentFragment:()=>Object.assign(new Element(),{fragment:true})},matchMedia:()=>media,fetch:async()=>({ok:true,headers:{get:()=> 'application/json'},json:async()=>entries})});
  await new Promise(resolve=>setImmediate(resolve));
  const grid=elements['.journal-grid'];
  const filters=elements['.journal-filters'];
  let horizontal=0, prevented=false;
  Object.defineProperty(filters,'scrollLeft',{get:()=>horizontal,set:value=>{horizontal=Math.max(0,Math.min(300,value));}});
  filters.handlers.wheel({deltaX:0,deltaY:100,deltaMode:0,preventDefault(){prevented=true;}});
  assert.equal(horizontal,100);
  assert.equal(prevented,true);
  horizontal=300;prevented=false;
  filters.handlers.wheel({deltaX:0,deltaY:100,deltaMode:0,preventDefault(){prevented=true;}});
  assert.equal(prevented,false,'page scrolling continues at the end of the filter strip');
  assert.equal(grid.children.length,6);
  assert.equal(grid.children[0].children[3].textContent,'open \u2192');
  grid.scrollTop=200;
  elements['.journal-filters'].children.find(b=>b.textContent==='Books').click();
  assert.equal(grid.children.length,3);
  assert.equal(grid.scrollTop,0);
  assert.ok(grid.children.every(card=>card.children[0].textContent.startsWith('Books')));
  elements['.journal-filters'].children.find(b=>b.textContent==='Movies').click();
  assert.equal(grid.children.length,0);
  assert.equal(grid.textContent,'No entries here yet.');
  const selected = () => filters.children.find(button => button.attrs['aria-pressed'] === 'true').textContent;
  const gesture = (dx, dy = 0, pointerType = "touch") => {
    grid.handlers.pointerdown({pointerType,button:0,clientX:100,clientY:100,target:grid.children[0]?.children[2]});
    grid.handlers.pointermove({clientX:100+dx,clientY:100+dy,pointerId:1,preventDefault(){}});
    grid.handlers.pointerup({clientX:100+dx,clientY:100+dy});
  };
  gesture(80);
  assert.equal(selected(),'Books');
  gesture(80);
  assert.equal(selected(),'All');
  gesture(80);
  assert.equal(selected(),'All','swiping at the first category stays there');
  gesture(-80);
  assert.equal(selected(),'Books');
  gesture(5,100);
  assert.equal(selected(),'Books','vertical scrolling does not change category');
  const wheel = timeStamp => grid.handlers.wheel({deltaX:80,deltaY:0,deltaMode:0,timeStamp,preventDefault(){}});
  wheel(1000);
  assert.equal(selected(),'Movies');
  wheel(1030);
  assert.equal(selected(),'Movies','trackpad momentum selects only one category');
  wheel(1400);
  assert.equal(selected(),'Notes');
  gesture(80, 0, 'mouse');
  assert.equal(selected(),'Movies','mouse drags starting over entry text change categories');
  let blocked = false;
  grid.handlers.click({preventDefault(){blocked=true;},stopImmediatePropagation(){}});
  assert.equal(blocked,true,'a swipe does not activate an entry link');
  gesture(0, 0, 'mouse');
  blocked = false;
  grid.handlers.click({preventDefault(){blocked=true;},stopImmediatePropagation(){}});
  assert.equal(blocked,false,'ordinary clicks still open entries');
});
