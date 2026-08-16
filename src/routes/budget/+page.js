import payload from '$lib/payload.json';

export function load() {
  const toUSD = (amount, currency) =>
    currency === 'JPY' ? +(amount / 163.88).toFixed(2) : amount;

  // ── Confirmed flights (4 travelers) ──────────────────────────────────────
  const flights = payload.transport.segments
    .filter(s => s.price?.amount > 0)
    .map(s => ({
      label: `${s.from.code} → ${s.to.code}`,
      carrier: s.carrier,
      date: s.date,
      amount: s.price.amount,
      currency: s.price.currency ?? 'USD',
      status: s.price.status ?? 'confirmed',
      travelers: s.price.travelers ?? 4,
      travelers_names: s.price.travelers_names ?? ['Jessy', 'Jurializ', 'Hilary', 'Yamil'],
    }));


  // ── Booked activities (confirmed, included in total) ──────────────────────
  const activities = [];
  for (const dest of payload.destinations) {
    for (const a of dest.activities) {
      if (a.price?.amount > 0 && a.booking_status === 'booked') {
        activities.push({
          label: a.name,
          city: dest.city,
          date: a.date,
          amount: a.price.amount,
          currency: a.price.currency ?? 'USD',
          approximate: a.price.approximate ?? true,
          status: a.price.status ?? 'confirmed',
          travelers: a.price.travelers ?? 7,
        });
      }
    }
  }

  // ── Booked hotels from checklist ─────────────────────────────────────────
  const hotels = payload.checklist.reserve
    .filter(r => r.category === 'Hotel' && r.booking_status === 'booked' && r.price?.amount > 0)
    .map(r => ({
      label: r.label,
      notes: r.notes ?? '',
      amount: r.price.amount,
      currency: r.price.currency ?? 'USD',
      approximate: r.price?.approximate ?? false,
      status: r.price.status ?? 'confirmed',
      link: r.link ?? null,
      group_color: r.group_color ?? null,
      guests: r.guests?.length ?? 7,
      guestNames: r.guests ?? [],
    }));

  // ── Not-yet-booked reserve items (shown but NOT in total) ─────────────────
  const tbd = payload.checklist.reserve
    .filter(r => r.booking_status !== 'booked')
    .map(r => ({
      label: r.label,
      category: r.category,
      amount: r.price?.amount ?? null,
      currency: r.price?.currency ?? 'USD',
      perPerson: r.price?.per_person ?? false,
      guests: r.guests_count ?? null,
      status: r.price?.status ?? 'tbd',
      link: r.link ?? null,
    }));

  // ── Totals (confirmed only) ───────────────────────────────────────────────
  const flightTotal = flights.reduce((s, f) => s + toUSD(f.amount, f.currency), 0);
  const activityTotal = activities.reduce((s, a) => s + toUSD(a.amount, a.currency), 0);
  const hotelTotal = hotels.reduce((s, h) => s + toUSD(h.amount, h.currency), 0);

  // Per-group hotel costs
  const groups = [
    { label: 'Group 1', members: ['Jessy', 'Jurializ'] },
    { label: 'Group 2', members: ['Hilary', 'Carlos', 'Yamil'] },
    { label: 'Group 3', members: ['James', 'Frances'] },
  ];
  const hotelGroups = groups.map(g => {
    let perPerson = 0;
    for (const h of hotels) {
      const usd = toUSD(h.amount, h.currency);
      const isGuest = h.guestNames.length === 0 || g.members.some(m => h.guestNames.includes(m));
      if (isGuest) perPerson += usd / h.guests;
    }
    return { ...g, perPerson: +perPerson.toFixed(2) };
  });

  return { flights, activities, hotels, tbd, flightTotal, activityTotal, hotelTotal, hotelGroups };
}
