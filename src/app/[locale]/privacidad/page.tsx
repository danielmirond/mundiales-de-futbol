import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

type Content = { title: string; updated: string; sections: Array<{ h: string; p: string[] }>; backToSite: string };

const CONTENT: Record<string, Content> = {
  es: {
    title: 'Política de Privacidad',
    updated: 'Última actualización · abril 2026',
    sections: [
      {
        h: '1. Quién es el responsable',
        p: [
          'Mundiales de Fútbol es un proyecto editorial y de datos sobre las 22 Copas del Mundo masculinas (1930–2026). La gestión del sitio corre a cargo de un titular privado que podrás identificar escribiendo al correo de contacto publicado al final del documento.',
        ],
      },
      {
        h: '2. Qué datos recogemos',
        p: [
          'No requerimos registro ni formularios. La mayoría del contenido se sirve sin saber nada de ti.',
          'Lo único que podemos recoger automáticamente son: dirección IP (solo en los registros técnicos del proveedor de hosting, durante un máximo de 30 días), tipo de navegador y página visitada (para detectar errores y prevenir abuso).',
          'Si aceptas las cookies analíticas, activamos Vercel Analytics: un servicio first-party que no usa cookies ni identificadores persistentes. Mide páginas vistas, dispositivo, país agregado y referencia de entrada. Los datos son anónimos y agregados; no es posible identificarte individualmente.',
        ],
      },
      {
        h: '3. Para qué usamos los datos',
        p: [
          'Prestar el servicio (mostrarte las páginas solicitadas en el idioma correcto).',
          'Prevenir abusos, ataques y errores.',
          'Si hay consentimiento: mejorar el producto analizando qué contenido funciona.',
          'No usamos los datos para publicidad ni los vendemos. No hacemos perfiles publicitarios.',
        ],
      },
      {
        h: '4. Base legal',
        p: [
          'Ejecución del servicio (contrato implícito al visitar la web) e interés legítimo para seguridad/prevención de fraude.',
          'Consentimiento explícito para cookies analíticas (lo das o rechazas en el aviso que ves al entrar).',
        ],
      },
      {
        h: '5. Destinatarios y transferencias internacionales',
        p: [
          'Los datos técnicos y de analítica se procesan por los siguientes subencargados:',
          '· Vercel Inc. (hosting + Vercel Analytics), servidores en la UE y Estados Unidos. Transferencia amparada por las Cláusulas Contractuales Tipo (SCC) aprobadas por la Comisión Europea.',
          '· Supabase Inc. (base de datos PostgreSQL), región seleccionada en la UE.',
          '· Wikimedia Commons, servidor de imágenes CC/dominio público; su carga se realiza directamente desde el navegador del usuario.',
          'No compartimos datos con redes publicitarias ni con terceros con fines comerciales. No existe venta de datos.',
        ],
      },
      {
        h: '6. Conservación',
        p: [
          'Logs técnicos: 30 días máximo.',
          'Cookies analíticas: hasta 12 meses desde tu consentimiento. Puedes revocar el consentimiento cuando quieras.',
        ],
      },
      {
        h: '7. Tus derechos',
        p: [
          'Tienes los derechos que reconocen el RGPD y la LOPDGDD: acceso, rectificación, supresión, limitación, portabilidad y oposición. También puedes retirar tu consentimiento para analíticas en cualquier momento desde el pie de la web (enlace "Cookies") o borrando las cookies en tu navegador.',
          'Para ejercer cualquier derecho, escribe al correo publicado al final de este documento.',
          'Si consideras que hemos vulnerado tus derechos, puedes reclamar ante la Agencia Española de Protección de Datos (AEPD, www.aepd.es).',
        ],
      },
      {
        h: '8. Menores',
        p: [
          'El servicio no está dirigido específicamente a menores de 14 años. Si detectamos datos de un menor, los eliminamos.',
        ],
      },
      {
        h: '9. Cambios',
        p: [
          'Si modificamos esta política te lo indicaremos en el banner de la home y actualizaremos la fecha. Los cambios sustanciales requerirán nuevo consentimiento para cookies.',
        ],
      },
      {
        h: '10. Contacto',
        p: [
          'Para preguntas sobre privacidad escribe a: privacidad@mundiales-de-futbol.com',
        ],
      },
    ],
    backToSite: 'Volver al sitio',
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated · April 2026',
    sections: [
      {
        h: '1. Who is the controller',
        p: [
          'Mundiales de Fútbol is an editorial and data project about the 22 FIFA Men\'s World Cups (1930–2026), operated by a private individual you can contact at the address at the bottom of this document.',
        ],
      },
      {
        h: '2. What data we collect',
        p: [
          'No registration or forms required. Most of the content is served without knowing anything about you.',
          'The only data we collect automatically: IP address (kept for up to 30 days in the hosting provider logs), browser type and page visited (for error detection and abuse prevention).',
          'If you accept analytics cookies, Vercel Analytics is enabled: a first-party service that does not use cookies or persistent identifiers. It measures page views, device, aggregated country and entry referrer. Data is anonymous and aggregated; you cannot be individually identified.',
        ],
      },
      {
        h: '3. How we use the data',
        p: [
          'Provide the service (showing the right pages in the right language).',
          'Prevent abuse, attacks and errors.',
          'With consent: improve the product by analysing what content works.',
          'We do not use data for advertising, nor do we sell it. No ad profiles.',
        ],
      },
      {
        h: '4. Legal basis',
        p: [
          'Performance of the service (implicit contract when visiting) and legitimate interest for security and fraud prevention.',
          'Explicit consent for analytics cookies (given or rejected in the banner on first visit).',
        ],
      },
      {
        h: '5. Recipients and international transfers',
        p: [
          'Technical and analytics data are processed by the following sub-processors:',
          '· Vercel Inc. (hosting + Vercel Analytics), servers in the EU and United States. International transfer is covered by the Standard Contractual Clauses (SCC) approved by the European Commission.',
          '· Supabase Inc. (PostgreSQL database), EU region selected.',
          '· Wikimedia Commons, image CDN for CC / public-domain assets; loaded directly by the user\'s browser.',
          'We do not share data with ad networks or third parties for commercial purposes. We do not sell data.',
        ],
      },
      {
        h: '6. Retention',
        p: [
          'Technical logs: 30 days max.',
          'Analytics cookies: up to 12 months from your consent. You may withdraw consent at any time.',
        ],
      },
      {
        h: '7. Your rights',
        p: [
          'You have the rights granted by the GDPR: access, rectification, erasure, restriction, portability and objection. You may also withdraw analytics consent at any time via the "Cookies" link in the footer or by deleting cookies in your browser.',
          'To exercise any right, write to the email at the bottom.',
          'If you believe we have violated your rights, you may complain to your local data protection authority (in Spain: AEPD, www.aepd.es).',
        ],
      },
      {
        h: '8. Minors',
        p: [
          'The service is not specifically aimed at minors under 14. If we become aware of data belonging to a minor we will delete it.',
        ],
      },
      {
        h: '9. Changes',
        p: [
          'If we update this policy we will flag it in the homepage banner and update the date. Material changes will re-trigger the analytics-cookies consent.',
        ],
      },
      {
        h: '10. Contact',
        p: [
          'For privacy questions: privacidad@mundiales-de-futbol.com',
        ],
      },
    ],
    backToSite: 'Back to the site',
  },
};

function getContent(locale: string): Content {
  return CONTENT[locale] ?? CONTENT.es;
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-32 md:px-10 md:py-40">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        {c.updated}
      </div>
      <h1 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">{c.title}</h1>

      <div className="mt-16 space-y-10 text-base leading-relaxed text-[var(--color-fg-muted)]">
        {c.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-2xl uppercase text-[var(--color-fg)]">{s.h}</h2>
            <div className="mt-4 space-y-4">
              {s.p.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 flex items-center gap-4">
        <Link
          href={withLocale(locale as Locale, '/')}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          ← {c.backToSite}
        </Link>
        <Link
          href={withLocale(locale as Locale, '/cookies')}
          className="text-sm text-[var(--color-fg-muted)] underline hover:text-[var(--color-fg)]"
        >
          Cookies
        </Link>
      </div>
    </article>
  );
}
