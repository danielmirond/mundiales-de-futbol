import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Sparkles, ShoppingBag, AlertTriangle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { AmazonProductGrid } from '@/components/affiliate/amazon-card';
import { AMAZON_PRODUCTS } from '@/lib/amazon-products';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/panini-mundial-2026/figurinhas-copa-2026',
    title: 'Figurinhas Copa 2026: álbum Panini, preços no Brasil e Endrick rookie',
    description:
      'Guia completo das figurinhas da Copa do Mundo 2026: álbum Panini com 980 figurinhas, 48 seleções, preços no Brasil (capa mole, capa dura), onde comprar, as figurinhas mais caras e o cromo rookie do Endrick.',
    keywords: [
      'figurinhas copa 2026',
      'álbum copa do mundo 2026',
      'panini copa do mundo 2026',
      'figurinhas panini brasil',
      'preço álbum copa 2026 brasil',
      'figurinha endrick rookie',
      'figurinha vinicius jr 2026',
      'onde comprar figurinhas copa 2026',
      'pacote figurinhas copa 2026',
      'álbum capa dura copa 2026',
    ],
    type: 'article',
    // Contenido editorial nativo en portugués-brasileño (targeting Brasil).
    // Solo /pt/coleccionismo/... debería indexarse; el resto de locales
    // se sirven con fallback ES (= contenido editorial pt) y van noindex.
    availableLocales: ['pt'],
  });
}

// Datos verificados (Panini Brasil, Globo Esporte, Panini.es, Infobae · abr/may 2026).

const FACTS = [
  { label: 'Total de figurinhas', value: '980' },
  { label: 'Seleções no álbum', value: '48' },
  { label: 'Páginas', value: '112' },
  { label: 'Figurinhas especiais', value: '68' },
];

const PRECOS_BR = [
  {
    item: 'Álbum capa mole',
    preco: 'R$ 10–12',
    onde: 'Bancas de jornal, livrarias e Panini.com.br',
    obs: 'Versão padrão para começar a colecionar. Inclui 6 figurinhas.',
  },
  {
    item: 'Álbum capa dura',
    preco: 'R$ 35–40',
    onde: 'Livrarias (Saraiva, Cultura), Panini.com.br',
    obs: 'Versão premium colecionável. Maior durabilidade e valor de revenda no longo prazo.',
  },
  {
    item: 'Pacote (5 figurinhas)',
    preco: 'R$ 5',
    onde: 'Bancas, supermercados, livrarias',
    obs: 'Mesmo formato da Copa de 2022. Cinco figurinhas aleatórias por pacote.',
  },
  {
    item: 'Caixa fechada (50 pacotes)',
    preco: 'R$ 250',
    onde: 'Panini.com.br, distribuidores oficiais',
    obs: 'Caixa lacrada com álbum capa mole de brinde em algumas edições. Melhor rendimento por figurinha.',
  },
];

const FIGURINHAS_TOP = [
  {
    nome: 'Endrick · rookie',
    selecao: 'Brasil',
    porque:
      'Estreia em Copa do Mundo do garoto formado no Palmeiras e contratado pelo Real Madrid. A figurinha rookie é, historicamente, a que mais se valoriza no longo prazo — paralelo direto com o cromo de Mbappé na Copa 2018, hoje a R$ 300+ no mercado secundário.',
    valor: 'R$ 80–200 (mercado secundário)',
  },
  {
    nome: 'Vinícius Jr · foil capitão',
    selecao: 'Brasil',
    porque:
      'Como capitão da Seleção, Vinícius Jr aparece em material foil (acabamento metalizado), uma das categorias raras do álbum. Inserção aproximada: 1 a cada 30 pacotes.',
    valor: 'R$ 60–120',
  },
  {
    nome: 'Lionel Messi · despedida',
    selecao: 'Argentina',
    porque:
      'Provável última Copa do Mundo do astro argentino, atual campeão. Forte demanda no mercado brasileiro e platino. Cromo de encerramento de carreira com peso simbólico enorme.',
    valor: 'R$ 70–180',
  },
  {
    nome: 'Lamine Yamal · rookie',
    selecao: 'Espanha',
    porque:
      'Joia europeia em sua primeira Copa. Projeção de mercado o coloca como rookie mais valorizado do torneio, junto com Endrick. Procurado por colecionadores espanhóis e latino-americanos.',
    valor: 'R$ 100–250',
  },
  {
    nome: 'Logo FIFA Trofeu (holograma)',
    selecao: 'Especial',
    porque:
      'Holograma do Trofeu da Copa, tradição em todos os álbuns Panini desde 2002. Em 2022 chegou a R$ 200 no mercado secundário no fim do torneio.',
    valor: 'R$ 150–300',
  },
  {
    nome: 'Extra Stickers (4 cores)',
    selecao: 'Limitada',
    porque:
      '20 figurinhas exclusivas em 4 variantes de cor (80 no total). Inserção 1 a cada 100 pacotes. As mais raras do álbum inteiro — caçada das caçadas para colecionadores.',
    valor: 'R$ 200–800 por unidade rara',
  },
];

const ONDE_COMPRAR = [
  {
    canal: 'Panini.com.br',
    detalhes:
      'Loja oficial. Frete para todo o Brasil. Caixas fechadas, álbuns capa dura e packs especiais aqui costumam ter preço melhor do que em distribuidores físicos.',
    cta: 'Site oficial',
    url: 'https://www.panini.com.br/',
  },
  {
    canal: 'Bancas de jornal e livrarias',
    detalhes:
      'Distribuição capilarizada em todo o Brasil. Pacotes individuais, álbum capa mole. Em capitais (SP, RJ, BH, POA) há filas em datas de lançamento — chegue cedo.',
    cta: null,
    url: null,
  },
  {
    canal: 'Saraiva, Cultura, Leitura',
    detalhes:
      'Livrarias grandes recebem álbum capa dura premium e edições especiais. Estoque limitado: vão rápido na pré-venda.',
    cta: null,
    url: null,
  },
  {
    canal: 'Mercado Livre, OLX, Enjoei',
    detalhes:
      'Mercado secundário para figurinhas avulsas (legais), troca, lotes prontos e álbuns completos. Cuidado com falsificações: Panini Brasil tem selo holográfico.',
    cta: null,
    url: null,
  },
];

const FAQ = [
  {
    q: 'Quando o álbum Panini Copa 2026 chega no Brasil?',
    a: 'A Panini Brasil costuma lançar o álbum oficial entre 30 e 60 dias antes da Copa começar. Para a Copa 2026 (começa 11 jun), o lançamento brasileiro está previsto para meados de maio de 2026 (data exata será anunciada pela Panini). Em 2022 saiu em agosto com a Copa começando em novembro — janela equivalente para 2026 seria meados de maio.',
  },
  {
    q: 'Quanto custa o álbum da Copa do Mundo 2026 no Brasil?',
    a: 'Preço de referência: álbum capa mole entre R$ 10 e R$ 12, capa dura premium entre R$ 35 e R$ 40, pacote com 5 figurinhas R$ 5, e caixa fechada com 50 pacotes em torno de R$ 250. Preços oficiais Panini Brasil podem variar por região.',
  },
  {
    q: 'Quantas figurinhas tem o álbum da Copa 2026?',
    a: 'O álbum tem 980 figurinhas no total: 23 por seleção × 48 seleções (1.104) com ajustes editoriais e 68 figurinhas especiais (foil de capitães, holograma do Trofeu, Extra Stickers, FIFA Legends e o pôster fim-de-álbum).',
  },
  {
    q: 'Qual é a figurinha mais cara da Copa 2026?',
    a: 'No mercado secundário, as Extra Stickers em variantes de cor especial (1 a cada 100 pacotes) chegam de R$ 200 a R$ 800 por unidade. O holograma do Trofeu FIFA fica entre R$ 150 e R$ 300. As rookie de Endrick e Lamine Yamal são as figurinhas mais procuradas para investimento de longo prazo.',
  },
  {
    q: 'Quantos brasileiros aparecem no álbum?',
    a: 'A Seleção Brasileira tem 23 figurinhas (a convocação oficial de Dorival Júnior, anunciada antes da Copa) mais figurinhas especiais (capitão em foil, possíveis cards FIFA Legends de Pelé/Ronaldo). Endrick é a figurinha rookie aguardada pelos colecionadores.',
  },
  {
    q: 'Onde trocar figurinhas repetidas?',
    a: 'Grupos de WhatsApp e Telegram regionais (procure "Figurinhas Copa 2026 [sua cidade]"), encontros oficiais Panini em shoppings e bibliotecas, e na Panini.com.br há um sistema oficial de "compra de faltantes" depois de 60-90 dias do lançamento (apenas para assinantes do clube Panini).',
  },
];

export default async function FigurinhasCopa2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const relatedPanini = AMAZON_PRODUCTS.filter(
    (p) => /panini|cromos|figurinha|sticker|álbum mundial/i.test(p.title),
  ).slice(0, 6);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Figurinhas Copa 2026: o álbum Panini do Mundial 2026 explicado',
    description:
      'Guia completo das figurinhas da Copa 2026: álbum Panini, preços no Brasil, onde comprar, figurinhas mais caras e a rookie do Endrick.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-03',
    mainEntityOfPage: localeUrl(
      locale,
      '/coleccionismo/panini-mundial-2026/figurinhas-copa-2026',
    ),
    inLanguage: 'pt-BR',
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
            {
              name: 'Figurinhas Copa 2026',
              path: '/coleccionismo/panini-mundial-2026/figurinhas-copa-2026',
            },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Sparkles className="inline h-3 w-3 mr-2" />
          Brasil · Panini · Copa do Mundo 2026
        </div>
        <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9]">
          Figurinhas
          <br />
          Copa 2026
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          O álbum oficial Panini da Copa do Mundo 2026 chega ao Brasil com 980 figurinhas
          das 48 seleções, 112 páginas e 68 cromos especiais. Aqui está tudo que o
          colecionador brasileiro precisa saber: preços de referência (capa mole, capa
          dura, pacote, caixa fechada), onde comprar, as figurinhas mais caras do mercado
          secundário e o cromo rookie do Endrick — provavelmente a figurinha brasileira
          mais valorizada da década.
        </p>

        <ul className="mt-10 grid gap-3 md:grid-cols-4">
          {FACTS.map((f) => (
            <li
              key={f.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {f.label}
              </div>
              <div className="mt-2 font-display text-3xl tab-num text-[var(--color-pitch)]">
                {f.value}
              </div>
            </li>
          ))}
        </ul>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preços Brasil
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">
          Quanto custa o álbum no Brasil
        </h2>
        <p className="mt-4 text-[var(--color-fg-muted)]">
          Valores de referência publicados pela Panini Brasil em maio de 2026. Bancas e
          supermercados podem aplicar variação de até 15% para mais ou para menos.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg-2)]">
              <tr>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Item
                </th>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Preço médio
                </th>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Onde comprar
                </th>
                <th className="px-5 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Observação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {PRECOS_BR.map((p) => (
                <tr key={p.item}>
                  <td className="px-5 py-4 font-medium">{p.item}</td>
                  <td className="px-5 py-4 font-mono tab-num text-[var(--color-pitch)]">
                    {p.preco}
                  </td>
                  <td className="px-5 py-4 text-[var(--color-fg-muted)]">{p.onde}</td>
                  <td className="px-5 py-4 text-sm text-[var(--color-fg-muted)]">
                    {p.obs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          As mais caras
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">
          Figurinhas mais valorizadas
        </h2>
        <p className="mt-4 max-w-3xl text-[var(--color-fg-muted)]">
          Cotações de referência no mercado secundário brasileiro (Mercado Livre, grupos
          de Telegram, Enjoei) em maio de 2026. Valores tendem a subir conforme a Copa se
          aproxima e podem dobrar nos primeiros 60 dias após o lançamento.
        </p>

        <div className="mt-8 grid gap-4">
          {FIGURINHAS_TOP.map((f, i) => (
            <article
              key={f.nome}
              className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:grid-cols-[3rem_1fr_8rem] md:items-start"
            >
              <div className="font-display text-3xl tab-num text-[var(--color-fg-muted)]">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-display text-xl">{f.nome}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    · {f.selecao}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {f.porque}
                </p>
              </div>
              <div className="font-mono text-xs tab-num text-[var(--color-pitch)] md:text-right">
                {f.valor}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShoppingBag className="inline h-3 w-3 mr-2" />
          Onde comprar
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">
          Onde comprar no Brasil
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ONDE_COMPRAR.map((o) => (
            <div
              key={o.canal}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6"
            >
              <h3 className="font-display text-xl">{o.canal}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {o.detalhes}
              </p>
              {o.cta && o.url && (
                <a
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                >
                  {o.cta} <ArrowRight className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-amber-500/40 bg-amber-500/5 p-7">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-400" />
            <div>
              <h3 className="font-display text-lg uppercase">Cuidado com falsificações</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                Em todo lançamento Panini circulam figurinhas falsas no Brasil — tipicamente
                vendidas em camelôs de centros comerciais e em lotes baratos do Mercado Livre.
                Como identificar a oficial: papel emborrachado mais grosso, selo holográfico
                Panini Brasil no verso, cor saturada e impressão sem rebarba. Se o preço de um
                lote estiver muito abaixo de R$ 1 por figurinha, desconfie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedPanini.length > 0 && (
        <AmazonProductGrid
          products={relatedPanini}
          title="Comprar online (Brasil/Internacional)"
          subtitle="Pacotes, álbuns, caixas e box expositoras Panini Mundial 2026 disponíveis com afiliação Amazon."
        />
      )}

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">FAQ</h2>
        <dl className="mt-8 space-y-6">
          {FAQ.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6"
            >
              <dt className="font-display text-lg">{q}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-20 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Mais sobre Panini Copa 2026</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              { title: 'Quando sai o álbum', href: '/coleccionismo/panini-mundial-2026/cuando-sale' },
              { title: 'Onde comprar (todos países)', href: '/coleccionismo/panini-mundial-2026/donde-comprar' },
              { title: 'Preços oficiais por país', href: '/coleccionismo/panini-mundial-2026/precio' },
              { title: 'Cromos mais caros (geral)', href: '/coleccionismo/panini-mundial-2026/cromos-mas-caros' },
              { title: 'Versão capa dura premium', href: '/coleccionismo/panini-mundial-2026/tapa-dura' },
              { title: 'Versão digital', href: '/coleccionismo/panini-mundial-2026/digital' },
              { title: 'Promoção Coca-Cola', href: '/coleccionismo/panini-mundial-2026/coca-cola' },
              { title: 'Topps × Panini', href: '/coleccionismo/panini-mundial-2026/topps-vs-panini' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={withLocale(locale as Locale, l.href)}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-5 py-4 transition-colors hover:border-[var(--color-pitch)]"
                >
                  <span>{l.title}</span>
                  <ArrowRight className="h-4 w-4 text-[var(--color-fg-muted)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
