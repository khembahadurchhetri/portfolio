import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

test('ribbon curve responds to scrolling and stops for reduced motion while navigation still updates', async () => {
  const source = await readFile('assets/scenery.js', 'utf8');
  const events = {}, frames = [], values = {};
  let top = 100;
  let ribbonTop = 900;
  const ribbonStyle = { setProperty: (key, value) => values[key] = value };
  const ribbon = { style: ribbonStyle, parentElement: { getBoundingClientRect: () => ({ top: ribbonTop, bottom: 2500 }) } };
  const section = { id: 'about', getBoundingClientRect: () => ({ top, bottom: top + 400, height: 400 }), style: { setProperty: (key, value) => values[key] = value }, setAttribute: (key, value) => values[key] = value };
  const link = { hash: '#about', setAttribute: (key, value) => values[key] = value, removeAttribute: key => delete values[key] };
  const preference = { matches: false, addEventListener: (_, fn) => events.motion = [fn] };
  const listen = (name, fn) => (events[name] ||= []).push(fn);
  const context = {
    window: { innerHeight: 800, scrollY: 0, matchMedia: query => query.includes("reduced-motion") ? preference : { matches: false }, addEventListener: listen },
    document: {
      documentElement: { scrollHeight: 3000 }, addEventListener: listen,
      getElementById: id => id === 'scrollRibbon' ? ribbon : id === 'hero' ? { offsetHeight: 800, getBoundingClientRect: () => ({ top: 0 }) } : section,
      querySelector: () => ({ getBoundingClientRect: () => ({ bottom: 60 }) }),
      querySelectorAll: query => query === '[data-depth]' ? [] : query.startsWith('.nav-links') ? [link] : [section],
    },
    requestAnimationFrame: fn => frames.push(fn),
  };
  vm.runInNewContext(source, context);
  const initial = values.d;
  assert.ok(initial);
  assert.equal(ribbonStyle.visibility, 'hidden');
  ribbonTop = 200;
  assert.equal(values['aria-current'], 'location');
  top = -100;
  context.window.scrollY = 200;
  events.scroll.forEach(fn => fn());
  while (frames.length) frames.shift()();
  assert.notEqual(values.d, initial);
  assert.equal(ribbonStyle.visibility, 'visible');
  assert.equal(values['--ribbon-clip-top'], '136px');
  assert.ok(values.d.startsWith('M')); 
  preference.matches = true;
  events.motion.forEach(fn => fn());
  while (frames.length) frames.shift()();
  assert.equal(values['stroke-dashoffset'], '0');
  top = 300;
  events.scroll.forEach(fn => fn());
  while (frames.length) frames.shift()();
  assert.equal(values.d, initial);
  assert.equal(values['aria-current'], undefined);
  preference.matches = false;
  context.window.scrollY = 50000;
  events.scroll.forEach(fn => fn());
  while (frames.length) frames.shift()();
  assert.ok(values.d.startsWith('M')); 
});
