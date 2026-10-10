import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFile(resolve(root, name), 'utf8');
const html = await read('index.html');
const css = await read('styles.css');
const manifest = JSON.parse(await read('assets-manifest.json'));
for (const item of manifest) {
  assert.equal(item.status, 'downloaded', item.path);
  const bytes = await readFile(resolve(root, item.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, item.path);
}
const allHtml = [html, await read('order.html'), await read('thanks.html')].join('\n');
const allCss = [css, await read('order.css'), await read('thanks.css')].join('\n');
const references = [...allHtml.matchAll(/(?:src|href)="([^"#]+)"/g), ...allCss.matchAll(/url\(["']?([^"')]+)["']?\)/g)];
let localCount = 0;
for (const [, path] of references) {
  if (/^(https?:|data:)/.test(path)) continue;
  assert(!path.startsWith('/'), `Root-relative path fails project Pages: ${path}`);
  await readFile(resolve(root, path.split('?')[0]));
  localCount++;
}
assert(!/fbevents|connect\.facebook|page-tracking/.test(html), 'No production tracking loader');
assert.equal((html.match(/class="comment clearfix"/g) || []).length, 8);

// Regression check: original countdown raised ReferenceError at its zero boundary.
let now = 0;
let scheduled;
const min = {}, sec = {};
const links = [{}];
const close = { addEventListener() {} };
const modal = { querySelector: () => close, addEventListener() {} };
const context = {
  URL, URLSearchParams, Date: { now: () => now },
  location: { href: 'https://example.github.io/my-site/?subid=test', search: '?subid=test' },
  window: { LANDING_CONFIG: { productName: '龍陽丸', countdownMinutes: 48, exitPopup: false, orderUrl: './order.html', passEntryParameters: true }, addEventListener() {} },
  document: {
    baseURI: 'https://example.github.io/my-site/',
    querySelectorAll: selector => selector === 'a[data-next="1"]' ? links : [],
    querySelector: selector => selector === '.min' ? min : sec,
    getElementById: () => modal,
    addEventListener() {},
  },
  setTimeout: fn => { scheduled = fn; return 1; }, clearTimeout() {},
};
vm.runInNewContext(await read('app.js'), context);
assert.equal(min.textContent, '48');
assert.equal(sec.textContent, '00');
now = 1000; scheduled();
assert.equal(min.textContent, '47'); assert.equal(sec.textContent, '59');
now = 2880000; scheduled();
assert.equal(min.textContent, '00'); assert.equal(sec.textContent, '00');
now = 3000000; scheduled();
assert.equal(sec.textContent, '00');
const destination = new URL(links[0].href);
assert.equal(destination.pathname, '/my-site/order.html');
assert.equal(destination.searchParams.get('subid'), 'test');
assert.equal(destination.searchParams.get('entry_source'), 'example.github.io/my-site');
console.log(`PASS: ${manifest.length} original assets match SHA-256; ${localCount} local references resolve; 8 comments; countdown boundaries; project-subpath links and query parameters.`);
