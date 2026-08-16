import payload from '$lib/payload.json';

export function load() {
  const toUSD = (amount, currency) =>
    currency === 'JPY' ? +(amount / 163.88).toFixed(2) : amount;

  const sumHistory = (history) => +(history ?? []).reduce((s, e) => s + e.amount, 0).toFixed(2);

  // ── Flight payments ───────────────────────────────────────────────────────
  const flightEntry = payload.checklist.reserve.find(r => r.id === 'res_flights');
  const flightTotal = flightEntry?.price?.amount ?? 0;
  const flightTravelers = flightEntry?.price?.travelers ?? 4;
  const flightPerPerson = +(flightTotal / flightTravelers).toFixed(2);

  const flightPayments = (flightEntry?.payments ?? []).map(p => {
    const paid = p.organizer ? flightPerPerson : sumHistory(p.payment_history);
    const owes = p.organizer ? 0 : +(Math.max(0, flightPerPerson - paid)).toFixed(2);
    return {
      name: p.name,
      organizer: p.organizer ?? false,
      paid,
      owes,
      share: flightPerPerson,
      history: p.payment_history ?? [],
    };
  });

  const flightCollected = flightPayments.reduce((s, p) => s + p.paid, 0);
  const flightOutstanding = flightPayments.reduce((s, p) => s + p.owes, 0);

  // ── Activity payments ─────────────────────────────────────────────────────
  const bookedActivities = [];
  for (const dest of payload.destinations) {
    for (const a of dest.activities) {
      if (a.price?.amount > 0 && a.booking_status === 'booked') {
        bookedActivities.push({
          label: a.name,
          city: dest.city,
          date: a.date,
          amount: toUSD(a.price.amount, a.price.currency ?? 'USD'),
          approximate: a.price.approximate ?? false,
          status: a.price.status ?? 'confirmed',
        });
      }
    }
  }
  const activityTotal = bookedActivities.reduce((s, a) => s + a.amount, 0);

  const hotels = payload.checklist.reserve
    .filter(r => r.category === 'Hotel' && r.booking_status === 'booked' && r.price?.amount > 0)
    .map(r => ({
      label: r.label,
      notes: r.notes ?? '',
      amount: toUSD(r.price.amount, r.price.currency ?? 'USD'),
      approximate: r.price?.approximate ?? false,
      status: r.price?.status ?? 'confirmed',
      cancel_by: r.cancel_by ?? null,
      group_color: r.group_color ?? null,
    }));

  const hotelTotal = hotels.reduce((s, h) => s + h.amount, 0);

  const travelers = 7;

  // ── Hotel payment tracker — per-person based on actual room assignments ───
  // Build individual share from guests array on each hotel entry
  const hotelShareByPerson = {};
  payload.checklist.reserve
    .filter(r => r.category === 'Hotel' && r.booking_status === 'booked' && r.price?.amount > 0 && r.guests?.length)
    .forEach(r => {
      const share = +(r.price.amount / r.guests.length).toFixed(2);
      r.guests.forEach(g => { hotelShareByPerson[g] = +((hotelShareByPerson[g] ?? 0) + share).toFixed(2); });
    });

  const hotelPayments = (payload.checklist.hotel_payments ?? []).map(p => {
    const share = hotelShareByPerson[p.name] ?? +(hotelTotal / travelers).toFixed(2);
    const paid  = p.organizer ? share : sumHistory(p.payment_history);
    const owes  = p.organizer ? 0 : +(Math.max(0, share - paid)).toFixed(2);
    return { name: p.name, organizer: p.organizer ?? false, paid, owes, share, history: p.payment_history ?? [] };
  });

  // For the header label use the average as a range indicator
  const hotelPerPerson = +(hotelTotal / travelers).toFixed(2);
  const hotelCollected = hotelPayments.reduce((s, p) => s + p.paid, 0);
  const hotelOutstanding = hotelPayments.reduce((s, p) => s + p.owes, 0);

  // ── Activity payment tracker (activities only, no hotels) ─────────────────
  const activityPerPerson = +(activityTotal / travelers).toFixed(2);
  const activityPayments = (payload.checklist.activity_payments ?? []).map(p => {
    const paid = p.organizer ? activityPerPerson : sumHistory(p.payment_history);
    const owes = p.organizer ? 0 : +(Math.max(0, activityPerPerson - paid)).toFixed(2);
    return { name: p.name, organizer: p.organizer ?? false, paid, owes, share: activityPerPerson, history: p.payment_history ?? [] };
  });
  const activityCollected = activityPayments.reduce((s, p) => s + p.paid, 0);
  const activityOutstanding = activityPayments.reduce((s, p) => s + p.owes, 0);

  return {
    flightPayments, flightTotal, flightPerPerson, flightCollected, flightOutstanding,
    hotels, hotelTotal: +hotelTotal.toFixed(2), hotelPerPerson, hotelPayments, hotelCollected, hotelOutstanding,
    bookedActivities, activityPayments, activityTotal: +activityTotal.toFixed(2), activityPerPerson, activityCollected, activityOutstanding,
  };
}
