import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPrintPages, densityForCount } from '../static/itinerary-print.js';

const payload = JSON.parse(
  await readFile(new URL('../static/payload.json', import.meta.url), 'utf8')
);

test('print model produces exactly ten pages', () => {
  assert.equal(buildPrintPages(payload).length, 10);
});

test('every activity appears exactly once in the day pages', () => {
  const expected = payload.destinations.flatMap((city) => city.activities.map((item) => item.id)).sort();
  const actual = buildPrintPages(payload)
    .flatMap((page) => page.days ?? [])
    .flatMap((day) => day.activities)
    .map((item) => item.id)
    .sort();
  assert.deepEqual(actual, expected);
});

test('density preserves the 8.5pt minimum for packed days', () => {
  assert.deepEqual(densityForCount(5), { className: 'density-spacious', bodyPt: 11.5 });
  assert.deepEqual(densityForCount(7), { className: 'density-standard', bodyPt: 10 });
  assert.deepEqual(densityForCount(10), { className: 'density-compact', bodyPt: 8.5 });
});

test('development and production print shells stay identical', async () => {
  const [rootHtml, staticHtml] = await Promise.all([
    readFile(new URL('../itinerary-table.html', import.meta.url), 'utf8'),
    readFile(new URL('../static/itinerary-table.html', import.meta.url), 'utf8')
  ]);
  assert.equal(rootHtml, staticHtml);
  assert.match(staticHtml, /itinerary-print\.css/);
  assert.match(staticHtml, /itinerary-print\.js/);
});
