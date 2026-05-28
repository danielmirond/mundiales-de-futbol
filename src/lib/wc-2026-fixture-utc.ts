/**
 * Convierte un Fixture26 (fecha + hora local de venue) a ISO UTC.
 * Usa Intl.DateTimeFormat para resolver el offset según la TZ del estadio.
 *
 * Mapping venue slug → IANA timezone:
 */
import type { Fixture26 } from './wc-2026';

const VENUE_TIMEZONES: Record<string, string> = {
  'estadio-azteca': 'America/Mexico_City',
  'estadio-akron': 'America/Mexico_City',
  'estadio-bbva': 'America/Monterrey',
  'bc-place': 'America/Vancouver',
  'bmo-field': 'America/Toronto',
  'metlife-stadium': 'America/New_York',
  'sofi-stadium': 'America/Los_Angeles',
  'att-stadium': 'America/Chicago',
  'mercedes-benz-stadium': 'America/New_York',
  'hard-rock-stadium': 'America/New_York',
  'nrg-stadium': 'America/Chicago',
  'arrowhead-stadium': 'America/Chicago',
  'gillette-stadium': 'America/New_York',
  'lincoln-financial-field': 'America/New_York',
  'levis-stadium': 'America/Los_Angeles',
  'lumen-field': 'America/Los_Angeles',
};

export function getVenueTimezone(venueSlug: string): string {
  return VENUE_TIMEZONES[venueSlug] ?? 'America/New_York';
}

/**
 * Convierte fecha local de venue → ISO UTC.
 * Hack: usa Intl.DateTimeFormat para calcular offset entre local-as-utc y venue-TZ.
 */
export function fixtureToUTC(fixture: Fixture26): string {
  const tz = getVenueTimezone(fixture.venue);
  const wallClock = `${fixture.date}T${fixture.time}:00`;
  const localDate = new Date(wallClock);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = formatter.formatToParts(localDate);
  const partMap = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const venueAsLocal = new Date(
    `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}:${partMap.second}`,
  );
  const offsetMs = venueAsLocal.getTime() - localDate.getTime();
  const utcDate = new Date(localDate.getTime() - offsetMs);
  return utcDate.toISOString();
}
