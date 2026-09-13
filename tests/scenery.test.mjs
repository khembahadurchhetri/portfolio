import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

test('scenery follows scrolling and updates navigation even with decorative motion disabled', async () => {
  const source = await readFile('assets/scenery.js', 'utf8');
  const events = {}, frames = [], values = {};
  let top = 100;
  const section = { id: 'about', getBoundingClientRect: () => ({ top, bottom: top + 400, height: 400 }), style: { setProperty: (key, value) => values[key] = value } };
  const link = { hash: '#about', setAttribute: (key, value) => values[key] = value, removeAttribute: key => delete values[key] };
  const preference = { matches: false, addEventListener: (_, fn) => events.motion = [fn] };
  const listen = (name, fn) => (events[name] ||= []).push(fn);
  const context = {
    window: { innerHeight: 800, scrollY: 0, matchMedia: () => preference, addEventListener: listen },
    document: {
      documentElement: { scrollHeight: 3000 }, addEventListener: listen,
      getElementById: id => id === 'hero' ? { offsetHeight: 800, getBoundingClientRect: () => ({ top: 0 }) } : section,
      querySelector: () => ({ getBoundingClientRect: () => ({ bottom: 60 }) }),
      querySelectorAll: query => query === '[data-depth]' ? [] : query.startsWith('.nav-links') ? [link] : [section],
    },
    requestAnimationFrame: fn => frames.push(fn),
  };
  vm.runInNewContext(source, context);
  const initial = values['--flow-y'];
  assert.ok(initial);
  assert.equal(values['aria-current'], 'location');
  top = -100;
  events.scroll.forEach(fn => fn());
  while (frames.length) frames.shift()();
  assert.notEqual(values['--flow-y'], initial);
  preference.matches = true;
  events.motion.forEach(fn => fn());
  while (frames.length) frames.shift()();
  assert.equal(values['--flow-y'], '275px');
  top = 100;
  events.scroll.forEach(fn => fn());
  while (frames.length) frames.shift()();
  assert.equal(values['--flow-y'], initial);
});
