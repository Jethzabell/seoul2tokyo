export const PAGE_PLAN = [
  { kind: 'overview' },
  { cityId: 'city_tokyo_shibuya', days: [1, 2] },
  { cityId: 'city_tokyo_shibuya', days: [3, 4] },
  { cityId: 'city_tokyo_shibuya', days: [5, 6] },
  { cityId: 'city_kyoto', days: [1, 2] },
  { cityId: 'city_kyoto', days: [3, 4] },
  { cityId: 'city_osaka', days: [1, 2] },
  { cityId: 'city_osaka', days: [3] },
  { cityId: 'city_tokyo_shinjuku', days: [1, 2] },
  { cityId: 'city_tokyo_shinjuku', days: [3, 4] }
];

export function densityForCount(count) {
  if (count <= 5) return { className: 'density-spacious', bodyPt: 11.5 };
  if (count <= 7) return { className: 'density-standard', bodyPt: 10 };
  return { className: 'density-compact', bodyPt: 8.5 };
}

function timeValue(value = '') {
  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return hour * 60 + Number(match[2]);
}

function dayModel(city, dayNumber) {
  const activities = city.activities
    .filter((item) => item.day === dayNumber)
    .sort((a, b) => timeValue(a.start_time) - timeValue(b.start_time));
  const summary = city.day_summaries?.[String(dayNumber)] ?? {};
  return {
    cityId: city.id,
    cityName: city.name,
    dayNumber,
    date: activities[0]?.date ?? '',
    leaveHotelBy: summary.leave_hotel_by ?? '',
    leaveHotelFor: summary.leave_hotel_for ?? '',
    density: densityForCount(activities.length),
    activities
  };
}

export function buildPrintPages(payload) {
  return PAGE_PLAN.map((plan, index) => {
    if (plan.kind === 'overview') {
      return {
        number: index + 1,
        kind: 'overview',
        trip: payload.trip,
        transport: payload.transport?.segments ?? []
      };
    }
    const city = payload.destinations.find((item) => item.id === plan.cityId);
    if (!city) throw new Error(`Missing destination: ${plan.cityId}`);
    return {
      number: index + 1,
      kind: 'days',
      cityId: city.id,
      cityName: city.name,
      stay: city.stay,
      days: plan.days.map((day) => dayModel(city, day))
    };
  });
}

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });
}

export function formatTransfer(transfer) {
  if (!transfer || transfer.duration_minutes == null) return '';
  return `${transfer.duration_minutes} min ${transfer.mode ?? 'transfer'}`;
}

function activityClass(activity) {
  const joined = [activity.id, activity.name, activity.type].filter(Boolean).join(' ').toLowerCase();
  return [
    activity.booking_status === 'booked' ? 'reserved' : '',
    /hotel.*(drop|rest|break|stop)/.test(joined) ? 'rest' : '',
    /open evening|flexible|dinner tbd|lunch tbd/.test(joined) ? 'flexible' : '',
    /sunset/.test(joined) ? 'sunset' : '',
    activity.sub_stop ? 'sub-stop' : ''
  ].filter(Boolean).join(' ');
}

function detailLines(activity) {
  const lines = [];
  if (activity.area) lines.push(activity.area);
  if (activity.location) lines.push(activity.location);
  if (activity.transport_from_previous) lines.push(formatTransfer(activity.transport_from_previous));
  if (activity.booking_status) lines.push(`Status: ${activity.booking_status.replaceAll('_', ' ')}`);
  if (activity.reservation_code) lines.push(`Reservation: ${activity.reservation_code}`);
  if (activity.confirmation_code) lines.push(`Confirmation: ${activity.confirmation_code}`);
  if (activity.operator) lines.push(`Operator: ${activity.operator}`);
  if (activity.cancel_by) lines.push(`Cancel by: ${activity.cancel_by}`);
  if (activity.details?.length) lines.push(...activity.details);
  if (activity.exclusions?.length) lines.push(`Not included: ${activity.exclusions.join(' · ')}`);
  return lines.filter(Boolean);
}

function renderActivity(activity) {
  const lines = detailLines(activity);
  const links = Object.entries(activity.links ?? {})
    .filter(([, href]) => href)
    .map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
    .join(' · ');
  return `<article class="activity ${activityClass(activity)}" data-activity-id="${escapeHtml(activity.id)}">
    <div class="activity-time">${escapeHtml(activity.start_time || 'Open')}${activity.end_time ? `<br>– ${escapeHtml(activity.end_time)}` : ''}</div>
    <div>
      <div class="activity-name">${activity.sub_stop ? '↳ ' : ''}${escapeHtml(activity.name)}</div>
      ${activity.description ? `<div class="activity-notes">${escapeHtml(activity.description)}</div>` : ''}
      ${activity.notes ? `<div class="activity-notes">${escapeHtml(activity.notes)}</div>` : ''}
      ${lines.length ? `<div class="activity-meta">${lines.map(escapeHtml).join(' · ')}</div>` : ''}
      ${links ? `<div class="activity-links">${links}</div>` : ''}
    </div>
  </article>`;
}

function renderDay(day) {
  const leave = day.leaveHotelBy
    ? `<div class="leave-line">Leave hotel by ${escapeHtml(day.leaveHotelBy)}${day.leaveHotelFor ? ` · for ${escapeHtml(day.leaveHotelFor)}` : ''}</div>`
    : '';
  return `<section class="day-column ${day.density.className}" style="--body-pt:${day.density.bodyPt}pt">
    <header class="day-heading"><strong>${escapeHtml(formatDate(day.date))}</strong>${leave}</header>
    <div>${day.activities.map(renderActivity).join('')}</div>
  </section>`;
}

function renderTransport(segment) {
  const number = segment.number ?? segment.flight_number ?? '';
  const passengers = segment.passengers ?? segment.travelers_names ?? [];
  const legs = (segment.legs ?? []).map((leg) => leg.layover
    ? `${leg.airport} layover · ${leg.duration}`
    : `${leg.from} → ${leg.to} · ${leg.flight} · ${leg.depart}–${leg.arrive}`
  );
  return `<article class="transport-card">
    <div class="transport-route">${escapeHtml(segment.from?.code)} → ${escapeHtml(segment.to?.code)}</div>
    <div><strong>${escapeHtml(segment.carrier)} ${escapeHtml(number)}</strong> · ${escapeHtml(segment.date)} · ${escapeHtml(segment.time_depart)}–${escapeHtml(segment.time_arrive)}</div>
    ${passengers.length ? `<div>${escapeHtml(passengers.join(', '))}</div>` : ''}
    ${legs.length ? `<div>${legs.map(escapeHtml).join(' · ')}</div>` : ''}
    ${segment.notes ? `<div>${escapeHtml(segment.notes)}</div>` : ''}
  </article>`;
}

function renderPage(page) {
  if (page.kind === 'overview') {
    return `<section class="print-page overview-page">
      <header class="page-title"><div><small>JAPAN 2026</small><h1>${escapeHtml(page.trip.title)}</h1></div><span>${escapeHtml(page.trip.dates.display)}</span></header>
      <div class="overview-grid">${page.transport.map(renderTransport).join('')}</div>
      <footer class="page-footer">${page.number} / 10</footer>
    </section>`;
  }
  return `<section class="print-page">
    <header class="page-title"><div><small>JAPAN 2026</small><h1>${escapeHtml(page.cityName)}</h1></div><span>${escapeHtml(page.stay?.hotel_name ?? '')}</span></header>
    <div class="days-grid ${page.days.length === 1 ? 'single-day' : ''}">${page.days.map(renderDay).join('')}</div>
    <footer class="page-footer">${page.number} / 10</footer>
  </section>`;
}

export function renderPrintDocument(pages, root) {
  root.innerHTML = pages.map(renderPage).join('');
  const count = document.getElementById('page-count');
  if (count) count.textContent = `${pages.length} A4 landscape pages`;
}

if (typeof document !== 'undefined') {
  document.getElementById('print-button')?.addEventListener('click', () => window.print());
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || navigator.onLine) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin) return;
    event.preventDefault();
    const warning = document.getElementById('external-warning');
    warning.hidden = false;
    window.setTimeout(() => (warning.hidden = true), 4000);
  });
  fetch('/payload.json')
    .then((response) => {
      if (!response.ok) throw new Error(`Payload request failed: ${response.status}`);
      return response.json();
    })
    .then((payload) => renderPrintDocument(buildPrintPages(payload), document.getElementById('print-root')))
    .catch(() => {
      const root = document.getElementById('print-root');
      root.replaceChildren(document.getElementById('error-template').content.cloneNode(true));
    });
}
