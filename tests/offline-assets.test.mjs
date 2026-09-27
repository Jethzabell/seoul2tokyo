import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('manifest defines an installable standalone app', async () => {
  const manifest = JSON.parse(await read('../static/manifest.webmanifest'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/');
  assert.ok(manifest.icons.some((icon) => icon.sizes === 'any' && icon.purpose.includes('maskable')));
});

test('service worker precaches every first-party route', async () => {
  const source = await read('../src/service-worker.js');
  for (const route of ['/', '/departure', '/return', '/quick-info', '/checklist', '/budget', '/admin', '/itinerary-table.html', '/payload.json', '/city/city_tokyo_shibuya', '/city/city_kyoto', '/city/city_osaka', '/city/city_tokyo_shinjuku']) {
    assert.ok(source.includes(`'${route}'`), `missing ${route}`);
  }
  assert.match(source, /offline\.html/);
});

test('app shell links the manifest', async () => {
  assert.match(await read('../src/app.html'), /manifest\.webmanifest/);
});

test('offline status warns about external links and appears in the layout', async () => {
  const [status, layout] = await Promise.all([
    read('../src/lib/OfflineStatus.svelte'),
    read('../src/routes/+layout.svelte')
  ]);
  assert.match(status, /navigator\.onLine/);
  assert.match(status, /Internet is required/);
  assert.match(layout, /OfflineStatus/);
});

test('Quick Info explains how to install and test offline access', async () => {
  const source = await read('../src/routes/quick-info/+page.svelte');
  assert.match(source, /Save the trip for offline use/);
  assert.match(source, /Add to Home Screen|Install/);
  assert.match(source, /airplane mode/);
});
