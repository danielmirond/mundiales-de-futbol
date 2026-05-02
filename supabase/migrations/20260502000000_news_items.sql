-- ===================================================================
-- News items: noticias diarias del Mundial 2026 curadas editorialmente.
-- Cada fila enlaza a un medio externo. Solo guardamos título, resumen
-- propio y URL del medio (no reproducimos contenido por copyright).
-- ===================================================================

create table if not exists news_items (
  id              uuid primary key default gen_random_uuid(),
  -- Título original publicado por el medio (≤ 200 chars).
  title           text not null check (char_length(title) between 8 and 240),
  -- Resumen editorial propio en español. NUNCA copiamos el lead del medio.
  summary         text not null check (char_length(summary) between 20 and 320),
  -- Categoría editorial para filtrado (panini, convocatorias, sedes,
  -- entradas, jugadores, mascotas, ceremonia, polemica, etc.).
  category        text not null default 'general',
  -- Idioma del medio fuente (no de nuestro resumen, que siempre es ES).
  source_lang     text not null default 'es',
  -- Datos del medio.
  source_name     text not null,
  source_url      text not null,
  -- Logo del medio (opcional). Patrón sugerido: `/img/logos/<slug>.svg`.
  source_logo     text,
  -- Fecha de publicación original del artículo en el medio.
  published_at    timestamptz not null,
  -- Auditoría interna.
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists news_items_pub_idx on news_items(published_at desc);
create index if not exists news_items_category_idx on news_items(category);

-- Trigger para mantener updated_at.
create or replace function touch_news_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists news_items_updated_at on news_items;
create trigger news_items_updated_at
  before update on news_items
  for each row execute function touch_news_items_updated_at();

-- RLS: lectura pública, escritura solo service role.
alter table news_items enable row level security;

drop policy if exists "news_items: public read" on news_items;
create policy "news_items: public read"
  on news_items for select
  using (true);

grant select on news_items to anon, authenticated;
