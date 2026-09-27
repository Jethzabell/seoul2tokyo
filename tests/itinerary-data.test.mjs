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

test('Arashiyama follows teamLab and precedes the TBD dinner block', async () => {
  const payload = await readJson(sourcePath);
  const activities = payload.destinations.find((city) => city.id === 'city_kyoto').activities;
  const arashiyama = activities.find((activity) => activity.id === 'kyoto_arashiyama_forest');
  const teamlab = activities.find((activity) => activity.id === 'kyoto_teamlab');
  const dinner = activities.find((activity) => activity.id === 'kyoto_teamlab_evening_open');

  assert.equal(teamlab.date, '2026-10-25');
  assert.equal(arashiyama.date, '2026-10-25');
  assert.equal(arashiyama.day, 3);
  assert.equal(teamlab.end_time, '7:15 PM');
  assert.equal(teamlab.duration_minutes, 105);
  assert.equal(arashiyama.start_time, '7:45 PM');
  assert.equal(arashiyama.end_time, '9:00 PM');
  assert.equal(arashiyama.duration_minutes, 75);
  assert.equal(arashiyama.transport_from_previous.from, 'teamLab Biovortex Kyoto');
  assert.equal(dinner.name, 'Dinner (TBD)');
  assert.equal(dinner.start_time, 'TBD');
  assert.equal(dinner.transport_from_previous.from, 'Arashiyama Bamboo Forest');
});

test('Fushimi has flexible lunch and free afternoon before the hotel break', async () => {
  const payload = await readJson(sourcePath);
  const activities = payload.destinations.find((city) => city.id === 'city_kyoto').activities;
  const fushimi = activities.find((activity) => activity.id === 'kyoto_fushimi');
  const lunch = activities.find((activity) => activity.id === 'kyoto_day3_lunch_after_fushimi');
  const afternoon = activities.find((activity) => activity.id === 'kyoto_day3_free_afternoon');
  const hotelBreak = activities.find((activity) => activity.id === 'kyoto_hotel_dropoff_rest_day3');

  assert.equal(fushimi.end_time, '10:30 AM');
  assert.equal(lunch.start_time, '11:00 AM');
  assert.equal(lunch.transport_from_previous.from, 'Fushimi Inari Shrine');
  assert.equal(afternoon.start_time, '12:00 PM');
  assert.equal(afternoon.end_time, '3:00 PM');
  assert.equal(hotelBreak.start_time, '3:00 PM');
});
