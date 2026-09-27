import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourcePath = new URL('../src/lib/payload.json', import.meta.url);
const publicPath = new URL('../static/payload.json', import.meta.url);

async function readJson(url) {
  return JSON.parse(await readFile(url, 'utf8'));
}

test('source and public payloads stay identical', async () => {
  const [source, publicPayload] = await Promise.all([readJson(sourcePath), readJson(publicPath)]);
  assert.deepEqual(publicPayload, source);
});

test('Onitsuka follows Hard Off and precedes the hotel rest stop', async () => {
  const payload = await readJson(sourcePath);
  const city = payload.destinations.find((item) => item.id === 'city_tokyo_shinjuku');
  const day = city.activities
    .filter((activity) => activity.day === 3)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  const ids = day.map((activity) => activity.id);

  assert.ok(ids.indexOf('tokyo_n_hardoff_shinjuku') < ids.indexOf('tokyo_n_onitsuka_shinjuku'));
  assert.ok(ids.indexOf('tokyo_n_onitsuka_shinjuku') < ids.indexOf('tokyo_n_hotel_dropoff_rest_day3'));

  const onitsuka = day.find((activity) => activity.id === 'tokyo_n_onitsuka_shinjuku');
  const hotel = day.find((activity) => activity.id === 'tokyo_n_hotel_dropoff_rest_day3');
  assert.equal(onitsuka.start_time, '5:25 PM');
  assert.equal(onitsuka.end_time, '6:00 PM');
  assert.equal(hotel.start_time, '6:15 PM');
  assert.equal(hotel.end_time, '6:45 PM');
});
