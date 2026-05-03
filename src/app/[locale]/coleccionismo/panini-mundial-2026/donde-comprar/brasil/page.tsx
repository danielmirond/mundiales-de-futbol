import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/donde-comprar/brasil',
    title: 'Onde comprar o álbum da Copa do Mundo 2026 no Brasil: Panini, livrarias e bancas',
    description:
      'Guia completo para comprar o álbum Panini Copa do Mundo 2026 no Brasil: Panini.com.br, Saraiva, Cultura, Livraria Leitura, bancas, supermercados e Mercado Livre. Preços atualizados das figurinhas, álbum capa mole e capa dura.',
    keywords: [
      'onde comprar album copa do mundo 2026 brasil',
      'album da copa 2026 capa dura',
      'panini copa do mundo 2026 brasil',
      'album figurinhas copa 2026 brasil',
      'preço album copa do mundo 2026 brasil',
      'comprar figurinhas copa 2026',
    ],
    type: 'article',
  });
}

const RETAILERS = [
  {
    nome: 'Panini.com.br (oficial)',
    formato: 'Todos os formatos · edições especiais',
    preco: 'R$ 12 capa mole · R$ 35 capa dura · R$ 5 pacote · R$ 250 caixa',
    notas:
      'Loja oficial Panini Brasil. Frete para todo o país. Caixa fechada (50 pacotes), brick (10 caixas) e álbum em todas as variantes. As edições limitadas (capa dura premium, ouro, lujo) ficam só aqui.',
    pros: ['Estoque garantido', 'Edições limitadas', 'Pré-venda'],
    cons: ['Custo de frete', 'Entrega 5-10 dias'],
  },
  {
    nome: 'Saraiva',
    formato: 'Álbum capa mole, capa dura, pacotes',
    preco: 'R$ 12-40 dependendo do formato',
    notas:
      'Tradicional rede de livrarias com forte distribuição em capitais e shoppings de cidades médias. Preços costumam estar 5-10 % acima da Panini direta, mas têm a vantagem da retirada presencial.',
    pros: ['Retirada na hora', 'Capilaridade urbana'],
    cons: ['Preço ligeiramente maior'],
  },
  {
    nome: 'Livraria Cultura',
    formato: 'Álbum capa dura premium · pacotes · alguns kits especiais',
    preco: 'R$ 35-50 capa dura',
    notas:
      'Distribuição mais limitada, principalmente São Paulo e Rio de Janeiro. Costuma ter primeiro a versão capa dura premium do que outras redes.',
    pros: ['Capa dura premium em estoque'],
    cons: ['Cobertura geográfica limitada'],
  },
  {
    nome: 'Livraria Leitura',
    formato: 'Capa mole, pacotes',
    preco: 'R$ 10-12 capa mole · R$ 5 pacote',
    notas:
      'Forte distribuição em shoppings de capitais e regiões metropolitanas. Reposição semanal de pacotes durante o lançamento.',
    pros: ['Reposição frequente', 'Cobertura nacional'],
    cons: ['Pouca variedade de formatos'],
  },
  {
    nome: 'Bancas de jornal',
    formato: 'Pacotes · capa mole',
    preco: 'R$ 5 pacote · R$ 12 álbum capa mole',
    notas:
      'Distribuição capilarizada em todas as cidades brasileiras. Em capitais (SP, RJ, BH, POA, BSB) há filas no dia do lançamento. Não vendem caixa completa nem capa dura premium.',
    pros: ['Disponibilidade imediata em qualquer bairro'],
    cons: ['Sem caixa completa', 'Sem capa dura'],
  },
  {
    nome: 'Walmart Brasil / Carrefour',
    formato: 'Álbum capa mole, pacotes, caixas em algumas lojas',
    preco: 'R$ 10-12 capa mole · R$ 250 caixa (quando disponível)',
    notas:
      'Disponibilidade variável por loja. Algumas lojas grandes (Carrefour Hipermercado, Walmart) recebem caixas completas e álbuns capa dura.',
    pros: ['Sem custo de frete (compra presencial)'],
    cons: ['Estoque irregular'],
  },
  {
    nome: 'Mercado Livre / OLX / Enjoei',
    formato: 'Mercado secundário · figurinhas avulsas, lotes, álbuns prontos',
    preco: 'Variável (R$ 1-5 por figurinha rara, lotes a R$ 200-400)',
    notas:
      'Para figurinhas específicas que faltam, lotes de troca e álbuns completos preenchidos. Cuidado com falsificações: a Panini Brasil tem selo holográfico no verso. Se o preço estiver muito abaixo, desconfie.',
    pros: ['Figurinhas raras avulsas', 'Álbuns completos'],
    cons: ['Risco de falsificação', 'Preços inflados perto do final'],
  },
];

const FAQ = [
  {
    q: 'Onde sai mais barato o álbum da Copa 2026 no Brasil?',
    a: 'Panini.com.br tem o preço oficial mais baixo: R$ 12 álbum capa mole, R$ 35 capa dura, R$ 5 pacote, R$ 250 caixa fechada. Nas livrarias e supermercados o preço sobe 5-10 %. As bancas de jornal cobram o mesmo da Panini para sobre suelto e álbum capa mole, mas não vendem caixa completa.',
  },
  {
    q: 'Onde encontrar o álbum capa dura da Copa 2026?',
    a: 'A versão capa dura premium (R$ 35-40) está disponível principalmente em Panini.com.br, Saraiva e Livraria Cultura. Em algumas Carrefour Hipermercado e Walmart também aparece. Bancas de jornal não vendem capa dura.',
  },
  {
    q: 'Quanto custa um pacote de figurinhas no Brasil?',
    a: 'R$ 5 por pacote com 5 figurinhas (R$ 1 por figurinha em média). Preço uniforme em Panini.com.br, bancas e livrarias. Eventuais variações em supermercados que aplicam margem extra.',
  },
  {
    q: 'A Panini Brasil vende o álbum online?',
    a: 'Sim. Panini.com.br é a loja oficial brasileira e vende todos os formatos: álbum capa mole, capa dura, oro, caixa fechada e brick. As edições limitadas são exclusividade do site.',
  },
  {
    q: 'Quando começou a venda do álbum da Copa 2026 no Brasil?',
    a: 'A Panini Brasil lançou o álbum oficial entre 2 e 4 de maio de 2026 em todos os canais. As edições especiais (capa dura premium, oro coleção) começaram a chegar a partir de 9 de maio.',
  },
  {
    q: 'Vale a pena comprar caixa fechada no Brasil?',
    a: 'Sim, se o objetivo é colecionar a sério. A caixa de 50 pacotes sai a R$ 250 (R$ 1 por figurinha) contra R$ 1 por figurinha no pacote suelto. Mesmo preço, mas com caixa você economiza tempo e em algumas edições inclui álbum capa mole de brinde. Para juntar 1-3 figurinhas que faltam, vá ao mercado secundário.',
  },
];

export default async function DondeComprarBrasil({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Onde comprar o álbum da Copa do Mundo 2026 no Brasil: 7 canais comparados',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-03',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/donde-comprar/brasil'),
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
            { name: 'Dónde comprar', path: '/coleccionismo/panini-mundial-2026/donde-comprar' },
            {
              name: 'Brasil',
              path: '/coleccionismo/panini-mundial-2026/donde-comprar/brasil',
            },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Dónde comprar
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShoppingBag className="h-4 w-4" />
          <span>Brasil · 7 canais comparados</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Álbum Copa 2026<br />no Brasil
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Onde comprar o álbum oficial Panini Copa do Mundo 2026 no Brasil com o melhor preço:{' '}
          <strong className="text-[var(--color-fg)]">Panini.com.br</strong> tem o preço oficial mais baixo (R$ 12 capa mole · R$ 35 capa dura · R$ 250 caixa), <strong className="text-[var(--color-fg)]">Saraiva</strong> e <strong className="text-[var(--color-fg)]">Cultura</strong> são as opções para retirada presencial com capa dura, e as bancas de jornal continuam sendo o caminho mais ágil para pacotes soltos.
        </p>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10 space-y-4">
        {RETAILERS.map((r) => (
          <article
            key={r.nome}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl uppercase">{r.nome}</h2>
              <span className="font-mono tab-num text-[var(--color-pitch)]">{r.preco}</span>
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              {r.formato}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {r.notas}
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
                  Vantagens
                </div>
                <ul className="mt-2 space-y-1 text-sm text-[var(--color-fg-muted)]">
                  {r.pros.map((p) => (
                    <li key={p}>· {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
                  Desvantagens
                </div>
                <ul className="mt-2 space-y-1 text-sm text-[var(--color-fg-muted)]">
                  {r.cons.map((c) => (
                    <li key={c}>· {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Perguntas frequentes
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">FAQ</h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <AmazonProductGrid
        products={AMAZON_PRODUCTS.filter((p) =>
          /panini|cromos|álbum mundial|sobres|figurinha/i.test(p.title),
        ).slice(0, 4)}
        title="Comprar online (Amazon)"
        subtitle="Caixa, pacotes e álbuns Panini Mundial 2026. Amazon Espanha envia ao Brasil com taxa internacional. Afiliação nuus-21."
      />

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Mais sobre Panini Copa 2026</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/figurinhas-copa-2026')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Figurinhas Copa 2026
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Onde comprar (geral)
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/tapa-dura')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Capa dura premium
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
