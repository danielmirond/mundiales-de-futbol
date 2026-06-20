/**
 * Informe de Search Console (Search Analytics) para potenciar URLs.
 *
 * Autentica con una CUENTA DE SERVICIO (lectura) y vuelca:
 *   - Top páginas y top consultas (por clics).
 *   - "A tiro" (pos 5-20, +impresiones): a un empujón de la página 1.
 *   - "Fugas de CTR" (muchas impresiones, CTR bajo): reescribir title/meta.
 *
 * La clave NUNCA va al repo. Se lee del entorno:
 *   GSC_SA_JSON   → contenido JSON de la cuenta de servicio (en GitHub Secrets)
 *   GSC_SA_PATH   → ruta a un fichero .json (uso local)
 *
 * Uso:
 *   GSC_SA_PATH=~/Desktop/mundiales-500017-xxx.json npx tsx scripts/gsc/report.ts --dry
 *   GSC_SA_JSON="$(cat key.json)" npx tsx scripts/gsc/report.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createSign } from 'node:crypto';

const SITE = process.env.GSC_SITE ?? 'https://mundiales-de-futbol.com/';
const DRY = process.argv.includes('--dry');

type SA = { client_email: string; private_key: string; token_uri: string };

function loadSA(): SA {
  if (process.env.GSC_SA_JSON) return JSON.parse(process.env.GSC_SA_JSON);
  const p = process.env.GSC_SA_PATH;
  if (p) return JSON.parse(readFileSync(p.replace(/^~/, process.env.HOME ?? ''), 'utf8'));
  throw new Error('Falta GSC_SA_JSON o GSC_SA_PATH');
}

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');

async function getToken(sa: SA): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const unsigned =
    b64({ alg: 'RS256', typ: 'JWT' }) +
    '.' +
    b64({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    });
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const jwt = unsigned + '.' + signer.sign(sa.private_key).toString('base64url');
  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('No se pudo obtener token: ' + JSON.stringify(data));
  return data.access_token;
}

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

const dayStr = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

async function query(
  token: string,
  body: Record<string, unknown>,
): Promise<Row[]> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  const data = (await res.json()) as { rows?: Row[] };
  return data.rows ?? [];
}

async function main() {
  const sa = loadSA();
  const token = await getToken(sa);
  const range = { startDate: dayStr(90), endDate: dayStr(2) };

  const pages = await query(token, { ...range, dimensions: ['page'], rowLimit: 25 });
  const queries = await query(token, { ...range, dimensions: ['query'], rowLimit: 25 });
  const allQ = await query(token, { ...range, dimensions: ['query'], rowLimit: 5000 });
  const allP = await query(token, { ...range, dimensions: ['page'], rowLimit: 5000 });

  const path = (u: string) => u.replace(SITE.replace(/\/$/, ''), '').replace(/^https?:\/\/[^/]+/, '');
  const strike = allQ
    .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 100)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25);
  const ctrLeaks = allP
    .filter((r) => r.impressions >= 1500 && r.ctr < 0.02 && r.position <= 12)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);

  const md = [
    `# Search Console · ${range.startDate} → ${range.endDate}`,
    ``,
    `## Top páginas (clics)`,
    ...pages.map(
      (r) =>
        `- **${Math.round(r.clicks)}** clics · ${r.impressions} impr · ${(r.ctr * 100).toFixed(1)}% · pos ${r.position.toFixed(1)} · \`${path(r.keys[0])}\``,
    ),
    ``,
    `## Top consultas (clics)`,
    ...queries.map(
      (r) => `- **${Math.round(r.clicks)}** · ${r.impressions} impr · pos ${r.position.toFixed(1)} · ${r.keys[0]}`,
    ),
    ``,
    `## A tiro (pos 5-20, +impresiones) → empujar a página 1`,
    ...strike.map(
      (r) => `- ${r.impressions} impr · pos ${r.position.toFixed(1)} · ${Math.round(r.clicks)} clics · ${r.keys[0]}`,
    ),
    ``,
    `## Fugas de CTR (muchas impresiones, CTR bajo) → reescribir title/meta`,
    ...ctrLeaks.map(
      (r) => `- ${r.impressions} impr · ${(r.ctr * 100).toFixed(1)}% · pos ${r.position.toFixed(1)} · \`${path(r.keys[0])}\``,
    ),
    ``,
  ].join('\n');

  if (DRY) {
    console.log(md);
    return;
  }
  const dir = join(process.cwd(), 'gsc');
  mkdirSync(dir, { recursive: true });
  const stamp = range.endDate;
  writeFileSync(join(dir, `${stamp}.md`), md);
  writeFileSync(
    join(dir, `${stamp}.json`),
    JSON.stringify({ range, pages, queries, strike, ctrLeaks }, null, 2),
  );
  console.log(`[gsc] Informe escrito en gsc/${stamp}.md`);
}

main();
