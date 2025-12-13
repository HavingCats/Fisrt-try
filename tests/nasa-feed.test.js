import { test, expect } from 'vitest';
import axios from 'axios';
import addDays from 'date-fns/addDays';

function getDate(d = new Date()) {
  return d.toJSON().split('T')[0];
}

// tests the structure of the json is the way we expect
test('NASA API returns expected data structure', async () => {
  const { data } = await axios.get(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${getDate()}&api_key=DEMO_KEY`
  );

  const day = getDate(addDays(new Date(), 1));

  // this will also throw if we can't access the value
  let dayData = null;
  try {
    dayData = data.near_earth_objects[day];
  } catch (e) {
    throw new Error(
      'Unexpected data structure, was looking for :root.near_earth_objects[array]'
    );
  }

  if (!dayData) {
    throw new Error('Missing any day for tomorrow');
  }

  const first = dayData[0];
  expect(first.is_potentially_hazardous_asteroid).toBeDefined();
});
