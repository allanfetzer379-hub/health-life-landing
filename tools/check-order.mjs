import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Isolated tests: fetch is an in-memory stub; no requests or customer orders are sent.
const bridge = await readFile(new URL('../order-bridge.js', import.meta.url), 'utf8');
function harness() {
  const name = { value: '', focus() {} };
  const phone = { value: '', focus() {} };
  const label = { textContent: '立即訂購', dataset: {} };
  const button = { textContent: '立即訂購', disabled: false, style: {}, dataset: {}, querySelector: () => label };
  const form = { querySelector: selector => selector.includes('name="name"') ? name : selector.includes('name="phone"') ? phone : button };
  const alerts = [], requests = [];
  let resolveRequest;
  const location = { href: 'https://example.github.io/site/order.html?subid=abc&entry_source=test', search: '?subid=abc&entry_source=test', hostname: 'example.github.io', origin: 'https://example.github.io' };
  const window = { location, LANDING_CONFIG: { orderEndpoint: 'https://orders.example.test/api/order', entryPath: 'site', formType: 'copy-test', formName: 'copy-test', enableTracking: false } };
  const document = { cookie: '', referrer: '', getElementById: () => form, querySelector: () => form, addEventListener() {} };
  vm.runInNewContext(bridge, {
    window, document, URL, URLSearchParams, Date, alert: message => alerts.push(message),
    sessionStorage: { getItem: () => '' },
    fetch: (url, options) => { requests.push({ url, options }); return new Promise(resolve => { resolveRequest = resolve; }); },
  });
  return { name, phone, label, button, window, alerts, requests, respond: (ok, body) => resolveRequest({ ok, text: async () => JSON.stringify(body) }) };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const invalid = harness();
invalid.window.send(1);
assert.equal(invalid.requests.length, 0);
assert.equal(invalid.alerts.length, 1);
invalid.name.value = '測試'; invalid.phone.value = '123'; invalid.window.send(1);
assert.equal(invalid.requests.length, 0);
assert.equal(invalid.alerts.length, 2);

const success = harness();
success.name.value = '測試'; success.phone.value = '0900000000';
success.window.send(1); success.window.send(1);
assert.equal(success.requests.length, 1, 'Duplicate submit is blocked');
assert.equal(success.button.disabled, true);
assert.equal(success.label.textContent, '提交中...');
const payload = JSON.parse(success.requests[0].options.body);
assert.equal(payload.phone, '0900000000');
assert.equal(payload.form_type, 'copy-test');
assert.equal(payload.subid, 'abc');
success.respond(true, { ok: true }); await settle();
assert.equal(success.window.location.href, '/site/thanks.html?subid=abc&entry_source=test');

const failed = harness();
failed.name.value = '測試'; failed.phone.value = '+886900000000'; failed.window.send(1);
failed.respond(false, { ok: false }); await settle();
assert.equal(failed.button.disabled, false);
assert.equal(failed.label.textContent, '立即訂購');
assert.equal(failed.alerts.length, 1);
failed.window.send(1);
assert.equal(failed.requests.length, 2, 'Failure permits retry');

let now = 0, tick;
const hours = {}, minutes = {}, seconds = {}, original = {};
const clock = { querySelector: selector => selector === '.hours' ? hours : selector === '.min' ? minutes : seconds };
vm.runInNewContext(await readFile(new URL('../order.js', import.meta.url), 'utf8'), {
  window: { LANDING_CONFIG: { orderCountdownMinutes: 15 }, addEventListener() {} },
  document: { querySelectorAll: () => [], querySelector: () => original, getElementById: () => clock },
  Date: { now: () => now }, setTimeout: callback => { tick = callback; }, clearTimeout() {},
});
assert.equal(minutes.textContent, '15');
now = 1000; tick(); assert.equal(minutes.textContent, '14'); assert.equal(seconds.textContent, '59');
now = 901000; tick(); assert.equal(minutes.textContent, '00'); assert.equal(seconds.textContent, '00');
console.log('PASS: purchase form validation, duplicate-submit guard, success routing, failure/retry, 15-minute timer boundary. No external orders sent.');
