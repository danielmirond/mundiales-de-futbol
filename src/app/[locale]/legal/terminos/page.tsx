import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/legal/terminos',
    title: 'Términos y Condiciones · Mundiales de Fútbol',
    description:
      'Condiciones de uso del sitio mundiales-de-futbol.com y de la Porra Mundial 2026, incluido el Pase Premium de 2,99€. LSSI, GDPR, derecho de desistimiento.',
    noIndex: false,
  });
}

const LAST_UPDATE = '26 de mayo de 2026';
// TODO: el usuario debe rellenar los datos identificativos abajo (razón social,
// NIF, dirección, email). Mientras tanto se muestran placeholders entre [ ].
const OWNER = {
  legalName: '[TU NOMBRE LEGAL / RAZÓN SOCIAL]',
  nif: '[DNI / CIF]',
  address: '[DIRECCIÓN POSTAL COMPLETA]',
  email: '[EMAIL DE CONTACTO]',
};

export default async function TerminosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Términos y Condiciones</h1>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">Última actualización: {LAST_UPDATE}</p>
      </header>

      <article className="prose prose-invert mt-10 max-w-none text-sm leading-relaxed text-[var(--color-fg-muted)]">
        <h2 className="text-lg font-semibold text-[var(--color-fg)]">1. Información del prestador del servicio (LSSI-CE)</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad
          de la Información y Comercio Electrónico (LSSI-CE):
        </p>
        <ul className="ml-6 list-disc">
          <li><strong>Titular:</strong> {OWNER.legalName}</li>
          <li><strong>NIF/CIF:</strong> {OWNER.nif}</li>
          <li><strong>Domicilio:</strong> {OWNER.address}</li>
          <li><strong>Email de contacto:</strong> {OWNER.email}</li>
          <li><strong>Sitio web:</strong> https://mundiales-de-futbol.com</li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">2. Objeto</h2>
        <p>
          Los presentes Términos y Condiciones (en adelante, los <strong>«Términos»</strong>) regulan el
          acceso y uso del sitio web <em>mundiales-de-futbol.com</em> (el «Sitio») y de los servicios
          digitales asociados, en particular la «Porra Mundial 2026» (el «Servicio»). El uso del Sitio
          y/o el registro en el Servicio implica la aceptación plena de estos Términos.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">3. Naturaleza del Servicio: no es juego regulado</h2>
        <p>
          La Porra Mundial 2026 es un <strong>servicio digital de entretenimiento</strong> consistente en
          un sistema de predicciones deportivas con ranking público. <strong>NO existe premio
          económicamente evaluable</strong> que el prestador entregue al ganador del ranking. El único
          resultado del juego es el reconocimiento público de la posición en el leaderboard. Por tanto,
          el Servicio NO constituye juego regulado en los términos de la Ley 13/2011, de regulación del
          juego, y NO requiere licencia de la Dirección General de Ordenación del Juego (DGOJ).
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">4. Edad mínima</h2>
        <p>
          Para registrarte y participar es necesario tener <strong>al menos 16 años</strong>. Los menores
          de 16 años necesitan el consentimiento expreso de sus padres o tutores legales para crear
          una cuenta y, en su caso, contratar el Pase Premium.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">5. Registro y cuenta de usuario</h2>
        <ul className="ml-6 list-disc">
          <li>El registro se realiza mediante un enlace mágico enviado al email del usuario. No se almacenan contraseñas.</li>
          <li>El usuario es responsable de la veracidad de los datos proporcionados.</li>
          <li>La cuenta es personal e intransferible.</li>
          <li>El prestador podrá suspender o cancelar cuentas que incumplan estos Términos, contengan datos falsos o realicen usos fraudulentos.</li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">6. Pase Premium «Pase Mundial 2026»</h2>
        <h3 className="mt-4 text-base font-semibold text-[var(--color-fg)]">6.1 Precio y contenido</h3>
        <p>
          El Pase Premium «Pase Mundial 2026» tiene un precio de <strong>2,99€ (IVA incluido)</strong>,
          de pago único y sin renovación automática. Da acceso a las siguientes funcionalidades durante
          todo el Mundial 2026 (del 11 de junio al 19 de julio de 2026):
        </p>
        <ul className="ml-6 list-disc">
          <li>Predicciones por partido para los 104 partidos del torneo.</li>
          <li>Creación y gestión de ligas privadas ilimitadas.</li>
          <li>Estadísticas avanzadas (acierto por fase, comparativa con la media, etc.).</li>
          <li>Bracket personalizado de eliminatorias.</li>
        </ul>

        <h3 className="mt-4 text-base font-semibold text-[var(--color-fg)]">6.2 Procesamiento del pago</h3>
        <p>
          El pago se procesa a través de <strong>Stripe Payments Europe, Ltd.</strong> (sociedad
          irlandesa registrada). El prestador no almacena ningún dato de la tarjeta del usuario. Stripe
          aplica los estándares PCI-DSS y la normativa SCA (Secure Customer Authentication) de PSD2.
        </p>

        <h3 className="mt-4 text-base font-semibold text-[var(--color-fg)]">6.3 Inicio inmediato del servicio y derecho de desistimiento</h3>
        <p>
          Al confirmar la compra, el usuario solicita expresamente el <strong>inicio inmediato</strong>
          de la prestación del servicio digital. De conformidad con el artículo 103.m del Texto
          Refundido de la Ley General para la Defensa de los Consumidores y Usuarios (TR-LGDCU), el
          usuario <strong>renuncia al derecho de desistimiento de 14 días</strong> al haberse iniciado
          la ejecución del servicio con su consentimiento expreso. Esta renuncia se captura
          explícitamente durante el checkout.
        </p>

        <h3 className="mt-4 text-base font-semibold text-[var(--color-fg)]">6.4 Reembolsos</h3>
        <p>
          Aunque no aplica el derecho de desistimiento, el prestador podrá conceder reembolsos
          discrecionalmente en caso de:
        </p>
        <ul className="ml-6 list-disc">
          <li>Indisponibilidad técnica grave del Servicio durante más de 72h continuadas.</li>
          <li>Doble cobro o error técnico imputable al prestador.</li>
          <li>Otros supuestos a valorar caso por caso. Solicítalo a {OWNER.email} indicando el ID de sesión Stripe.</li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">7. Uso permitido</h2>
        <p>El usuario se compromete a:</p>
        <ul className="ml-6 list-disc">
          <li>No utilizar el Servicio para fines ilícitos, fraudulentos o lesivos para terceros.</li>
          <li>No suplantar la identidad de otros usuarios.</li>
          <li>No usar bots, scripts o medios automatizados para hacer predicciones.</li>
          <li>No manipular el sistema de puntuación.</li>
          <li>Respetar los derechos de propiedad intelectual del contenido del Sitio.</li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">8. Propiedad intelectual e industrial</h2>
        <p>
          Todos los contenidos del Sitio (textos, gráficos, diseño, código, marcas, logos, datos
          editoriales) son titularidad del prestador o de sus licenciantes. Se prohíbe la reproducción,
          distribución, comunicación pública o transformación sin autorización expresa. Las imágenes
          publicadas bajo licencias libres (Wikimedia Commons, CC, etc.) mantienen su licencia original
          y se utilizan con la atribución correspondiente.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">9. Protección de datos</h2>
        <p>
          El tratamiento de los datos personales del usuario se rige por la{' '}
          <Link href={`/${locale}/privacidad`} className="underline">Política de Privacidad</Link>, que
          forma parte integrante de estos Términos. El usuario consiente expresamente el tratamiento
          al registrarse y/o realizar la compra del Pase.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">10. Cookies</h2>
        <p>
          El uso de cookies se regula por la{' '}
          <Link href={`/${locale}/cookies`} className="underline">Política de Cookies</Link>.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">11. Exclusión de garantías y limitación de responsabilidad</h2>
        <p>
          El prestador hace sus mejores esfuerzos por mantener el Sitio y el Servicio operativos, pero
          no garantiza la disponibilidad ininterrumpida ni la ausencia total de errores. El prestador
          no será responsable de:
        </p>
        <ul className="ml-6 list-disc">
          <li>Interrupciones puntuales del Servicio por mantenimiento o causas técnicas.</li>
          <li>Datos editoriales sobre el Mundial que puedan resultar afectados por cambios de FIFA, federaciones o calendario.</li>
          <li>Daños indirectos, lucro cesante o pérdida de oportunidad derivados del uso del Servicio.</li>
        </ul>
        <p>
          La responsabilidad máxima del prestador frente al usuario quedará limitada al importe pagado
          por el Pase Premium (2,99€).
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">12. Modificaciones</h2>
        <p>
          El prestador podrá modificar estos Términos en cualquier momento por motivos legales,
          regulatorios o de mejora del Servicio. La nueva versión se publicará en esta misma URL con
          la fecha actualizada. Para cambios sustanciales se notificará al usuario por email.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">13. Ley aplicable y jurisdicción</h2>
        <p>
          Estos Términos se rigen por la legislación española. Para cualquier controversia se aplicarán
          los Juzgados y Tribunales del domicilio del consumidor cuando éste sea persona física.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">14. Resolución alternativa de conflictos (ODR)</h2>
        <p>
          De conformidad con el Reglamento (UE) 524/2013, los consumidores tienen a su disposición la
          plataforma de Resolución de Litigios en Línea (ODR) de la Comisión Europea:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          . Email de contacto del prestador para reclamaciones: {OWNER.email}.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-[var(--color-fg)]">15. Contacto</h2>
        <p>
          Para cualquier consulta sobre estos Términos, escribe a <strong>{OWNER.email}</strong>.
        </p>
      </article>

      <p className="mt-12 text-xs text-[var(--color-fg-muted)]">
        <Link href={`/${locale}/privacidad`} className="underline">Política de Privacidad</Link> ·{' '}
        <Link href={`/${locale}/cookies`} className="underline">Política de Cookies</Link>
      </p>
    </main>
  );
}
