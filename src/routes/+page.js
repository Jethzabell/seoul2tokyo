import payload from '$lib/payload.json';

export function load() {
  const { trip, destinations } = payload;
  const totalActivities = destinations.reduce((s, d) => s + d.activities.length, 0);
  const totalFoodSpots = destinations.reduce((s, d) =>
    s + (d.recommended_food_spots || []).reduce((ss, a) => ss + a.spots.length, 0), 0);

  const msPerDay = 86400000;
  const nights = Math.round(
    (new Date(trip.dates.end) - new Date(trip.dates.start)) / msPerDay
  );

  return {
    trip,
    cities: destinations.map(d => ({ id: d.id, city: d.city })),
    stats: {
      days: nights + 1,
      nights,
      cities: destinations.length,
      activities: totalActivities,
      foodSpots: totalFoodSpots
    }
  };
}
