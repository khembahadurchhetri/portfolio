import {test} from 'node:test';
import assert from 'node:assert/strict';
import {POST} from '../app/api/journal/submit/route.js';
test('visitor submissions validate consent and send only pending content to the RPC',async()=>{
 const original=globalThis.fetch;const calls=[];
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return new Response(null,{status:204});};
 const send=data=>POST(new Request('http://localhost:3000/api/journal/submit',{method:'POST',headers:{'Content-Type':'application/json','x-forwarded-for':'192.0.2.10'},body:JSON.stringify(data)}));
 try{
  assert.equal((await send({name:'Reader',title:'Story',text:'My journal entry.'})).status,400);
  assert.equal(calls.length,0);
  assert.equal((await send({name:'Reader',title:'Story',text:'short',consent:'on'})).status,400);
  assert.equal((await send({website:'spam',consent:'on'})).status,200);assert.equal(calls.length,0);
  const response=await send({name:'Reader',title:'Story',text:'My journal entry.',consent:'on',visibility:'public',status:'approved'});
  assert.equal(response.status,200);assert.equal(calls.length,1);
  assert.match(calls[0].url,/rpc\/portfolio_submit_journal_v2$/);
  const input=JSON.parse(calls[0].options.body);
  assert.equal(input.p_category,'Community');assert.equal(input.p_image,'');assert.equal(input.p_name,'Reader');assert.equal(input.p_text,'My journal entry.');assert.equal(input.visibility,undefined);assert.equal(input.status,undefined);assert.equal(input.p_visitor.length,64);
  const count=calls.length;
  assert.equal((await send({name:'Reader',title:'Photo',text:'A photo journal.',consent:'on',category:'Unknown'})).status,400);
  assert.equal((await send({name:'Reader',title:'Photo',text:'A photo journal.',consent:'on',category:'Photos & videos',photo:'data:image/png;base64,PHNjcmlwdD4='})).status,400);
  assert.equal(calls.length,count);
  const photo='data:image/png;base64,'+Buffer.from([137,80,78,71,13,10,26,10]).toString('base64');
  assert.equal((await send({name:'Reader',title:'Photo',text:'A photo journal.',consent:'on',category:'Photos & videos',photo})).status,200);
  assert.match(calls.at(-2).url,/storage\/v1\/object\/portfolio-guest-media\/guest\//);
  const photoInput=JSON.parse(calls.at(-1).options.body);assert.equal(photoInput.p_category,'Photos & videos');assert.match(photoInput.p_image,/^guest\/.+\.png$/);
 }finally{globalThis.fetch=original;}
});
