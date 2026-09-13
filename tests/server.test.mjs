import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createApp } from '../server.mjs';

test('owner authentication, CSRF, persistent CRUD and private media isolation', async () => {
  const dataDir=await mkdtemp(path.resolve('.test-data-'));
  let app=await createApp({dataDir,origin:'http://localhost:3000'});
  let base;
  async function start(){await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${app.server.address().port}`;}
  await start();
  let cookie='',csrf='';
  const request=(route,method='GET',data,authorized=true,extra={})=>fetch(base+route,{method,headers:{Origin:'http://localhost:3000',...(authorized?{Cookie:cookie,'X-CSRF-Token':csrf}:{}),...extra},body:data===undefined?undefined:Buffer.isBuffer(data)?data:JSON.stringify(data)});
  try {
    assert.equal((await request('/api/admin/posts','GET',undefined,false)).status,401);
    assert.equal((await request('/api/admin/posts','POST',{},false)).status,401);
    for(const route of ['/data/journal.sqlite','/server.mjs','/.git/config','/package.json'])assert.equal((await request(route)).status,404);
    await app.setOwner('owner@example.com','test-only-long-password');
    assert.equal((await request('/api/login','POST',{email:'owner@example.com',password:'wrong'},false)).status,401);
    let response=await request('/api/login','POST',{email:'owner@example.com',password:'test-only-long-password'},false);
    assert.equal(response.status,200);assert.match(response.headers.get('set-cookie'),/HttpOnly/);assert.match(response.headers.get('set-cookie'),/SameSite=Strict/);
    cookie=response.headers.get('set-cookie').split(';')[0];csrf=(await response.json()).csrf;
    assert.equal((await request('/api/admin/posts','POST',{},true,{'X-CSRF-Token':'wrong'})).status,403);
    assert.equal((await request('/api/admin/posts','POST',{},true,{Origin:'https://evil.example'})).status,403);
    assert.equal((await request('/api/admin/media','POST',Buffer.from('<svg onload="alert(1)"></svg>'))).status,415);
    const image=await readFile('assets/journal-ai-lake.png');
    response=await request('/api/admin/media','POST',image);assert.equal(response.status,201);const media=(await response.json()).url;
    assert.equal((await request(media,'GET',undefined,false)).status,404);
    const draft={title:'Private test title',category:'Notes',text:'SECRET BODY',visibility:'private',image:media};
    response=await request('/api/admin/posts','POST',draft);assert.equal(response.status,201);let post=await response.json();
    assert.ok(!(await (await request('/api/posts','GET',undefined,false)).text()).includes('SECRET BODY'));
    assert.equal((await request(media)).status,200);
    response=await request('/api/admin/posts/'+post.id,'PUT',{...post,visibility:'public'});assert.equal(response.status,200);
    assert.ok((await (await request('/api/posts','GET',undefined,false)).text()).includes('SECRET BODY'));
    assert.equal((await request(media,'GET',undefined,false)).status,200);
    response=await request(media,'GET',undefined,false,{Range:'bytes=0-7'});assert.equal(response.status,206);assert.equal((await response.arrayBuffer()).byteLength,8);
    await request('/api/admin/posts/'+post.id,'PUT',{...post,visibility:'draft'});
    assert.equal((await request(media,'GET',undefined,false)).status,404);
    await app.close();app=await createApp({dataDir,origin:'http://localhost:3000'});await start();
    assert.ok((await (await request('/api/admin/posts')).json()).some(p=>p.id===post.id&&p.visibility==='draft'));
    assert.equal((await request('/api/admin/posts/'+post.id,'DELETE')).status,200);
    assert.equal((await request(media)).status,404);
    assert.equal((await request('/api/logout','POST')).status,200);
    assert.equal((await request('/api/admin/posts')).status,401);
    assert.equal((await request('/api/admin/posts/'+post.id,'DELETE')).status,401);
    for(let i=0;i<8;i++)assert.equal((await request('/api/login','POST',{email:'owner@example.com',password:'incorrect'},false)).status,401);
    assert.equal((await request('/api/login','POST',{email:'owner@example.com',password:'incorrect'},false)).status,429);
  } finally {await app.close();assert.ok(dataDir.startsWith(path.resolve('.test-data-')));await rm(dataDir,{recursive:true,force:true});}
});
