import payload from '$lib/payload.json';

export function load() {
  const hotels = payload.destinations.map(d => ({
    city: d.city,
    name: d.stay?.hotel_name,
    link: d.stay?.hotel_link,
    arrival: d.dates.arrival,
    departure: d.dates.departure,
    checkin: d.stay?.checkin_time,
    checkout: d.stay?.checkout_time,
  }));

  const flightSegments = payload.transport.segments.filter(s => s.mode === 'flight');
  const flightParty = payload.trip.flight_party ?? null;

  const tripStats = (() => {
    let totalActs = 0, booked = 0, spend = 0;
    for (const d of payload.destinations) {
      for (const a of d.activities) {
        totalActs++;
        if (a.booking_status === 'booked') booked++;
        if (a.price?.status === 'confirmed' && a.price.amount > 0) spend += a.price.amount;
      }
    }
    for (const s of payload.transport.segments) {
      if (s.price?.status === 'confirmed' && s.price.amount > 0) spend += s.price.amount;
    }
    return { totalActs, booked, spend };
  })();

  const travelerCount = payload.travelers?.length ?? 7;

  return {
    trip: payload.trip,
    travelerCount,
    flightSegments,
    flightParty,
    airport_cards: payload.quick_info_cards.airport_cards,
    rail_cards: payload.quick_info_cards.rail_cards,
    qr_placeholders: payload.quick_info_cards.qr_placeholders,
    hotels,
    tripStats,
  };
}
