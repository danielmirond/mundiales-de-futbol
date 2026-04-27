# Manual de Merch · Mundiales de Fútbol

> Cómo lanzar y operar una línea de producto física que monetice el tráfico
> del Mundial 2026 sin desviar foco editorial. Diseñado para España como
> mercado primario y una operación pequeña (1 persona + proveedor POD).

---

## 1. Estrategia · qué clase de merch tiene sentido

**Tres archetipos viables, en orden de prioridad:**

1. **Editorial-coleccionismo** (camisetas, posters, libros, totebags).
   Margen 50-65 %. Encaja con la voz "rigor + memoria viva".
   Genera valor duradero (vendes durante 4 años hasta el siguiente Mundial).

2. **Performance-fan** (gorras, bufandas, banderas, parches).
   Margen 40-55 %. Compra impulso pre-partido.
   Pico de venta junio-julio 2026.

3. **Hogar-fan zone** (tazas, posavasos, manteles, lámparas).
   Margen 35-50 %. Compra para "ver el partido en casa".
   Conecta con la página `/2026/fan-zone` ya publicada.

**Lo que NO funciona en este proyecto:**

- Réplicas de camisetas oficiales: licencia FIFA imposible para una marca pequeña.
- Bufandas con escudo de selección: licencia federativa cara.
- Cromos: territorio Panini blindado.

---

## 2. Catálogo recomendado · primera ola (10-12 SKUs)

### Camisetas (4 SKUs, t-shirt regular fit 180 g algodón orgánico)

| Diseño | Print | Tallas | Precio venta | Coste POD | Margen |
|---|---|---|---|---|---|
| **«MEMORIA VIVA · 1930-2026»** wordmark | DTG verde neón sobre negro | XS-3XL | 24,90 € | 9,80 € | 55 % |
| **«MARACANAZO · 16 jul 1950»** efeméride tipográfica | DTG blanco sobre azul tinta | XS-3XL | 24,90 € | 9,80 € | 55 % |
| **«ESPAÑA · GRUPO H 2026»** con calendario impreso | DTG | XS-3XL | 24,90 € | 9,80 € | 55 % |
| **«EL GOL DEL SIGLO · MARADONA 86»** ilustración trayectoria | DTG | XS-3XL | 27,90 € | 11,20 € | 55 % |

### Posters A2 (4 SKUs, 50×70 cm, 200 g mate)

| Diseño | Print | Precio | Coste | Margen |
|---|---|---|---|---|
| **«23 EDICIONES · 1930-2026»** infografía vertical | Digital offset | 19,90 € | 6,40 € | 60 % |
| **«16 SEDES MUNDIAL 2026»** mapa Norteamérica + estadios | Digital offset | 19,90 € | 6,40 € | 60 % |
| **«TROFEOS · de Jules Rimet a la Copa actual»** | Digital offset | 19,90 € | 6,40 € | 60 % |
| **«FINALES · cada Mundial en una línea»** | Digital offset | 19,90 € | 6,40 € | 60 % |

### Totebag y pequeño formato (4 SKUs)

| Diseño | Producto | Precio | Coste | Margen |
|---|---|---|---|---|
| Wordmark + tipografía Bebas | Totebag 38×42 cm algodón 240 g | 14,90 € | 5,20 € | 60 % |
| Logomark verde | Taza cerámica 330 ml | 11,90 € | 4,10 € | 60 % |
| Pin esmaltado «MUNDIAL 2026» | Pin metálico 25 mm | 7,90 € | 1,80 € | 75 % |
| Set de 4 posavasos «4 estilos de barbacoa USA» | Madera serigrafiada | 19,90 € | 7,40 € | 55 % |

**Total catálogo inicial: 12 SKUs · ticket medio estimado 22 € · margen medio 57 %.**

---

## 3. Diseño · sistema y aplicación de marca

**Tokens (ya en `brand/design-tokens.json`):**

- Negro fondo `#05060A` · Verde césped `#00FF85` · Rojo tarjeta `#FF3B3B` · Amarillo tarjeta `#FFD400`
- Display: **Bebas Neue** (mayúsculas, condensed, atlético)
- Mono: **Geist Mono** (timestamps, datos, kickers)

**Reglas de aplicación al merch:**

1. **Tipografía gigante manda.** Wordmark a tamaño máximo posible. Bebas Neue corta y centrada en el pecho de la camiseta.
2. **Una sola tinta por diseño** salvo posters editoriales (multitinta digital). Más tintas = más coste DTG.
3. **Espacio negativo agresivo.** El producto debe respirar. Inspiración: Pentagram NYC, Copa Magazine.
4. **Datos siempre tabulares.** Si hay cifras (años, marcadores, asistencias) van en mono y se alinean por baseline.
5. **Sin gradientes en print.** El gradient `pitch → sun → flame` solo en pantalla.
6. **Posters con grid 8 columnas.** Las líneas de grid se ven sutilmente (1 % opacidad). Refuerza la identidad editorial.

**Entregables Figma necesarios:**
- Mockups por SKU (camiseta sobre maniquí oscuro, poster en marco roble negro, taza en mesa de madera).
- Versión en negativo y en positivo de cada wordmark.
- Patrón repetitivo (para forros de totebag, etiquetas, packaging).

---

## 4. Producción · POD vs stock

### Print on Demand (POD) — recomendado para empezar

**Proveedor sugerido:** **Printful** (filial Shopify, fabricación Letonia + Barcelona).
- Camiseta DTG 180 g: fulfillment 2-5 días, envío a España 4-7 días, total ~10 días desde compra.
- Sin inversión inicial, sin stock.
- Gestiona devoluciones y atención al cliente de fabricación.

**Alternativas:**
- **Gelato** (más caro, pero presencia local fuerte en España).
- **TPOP** (francés, más sostenible, premium).

**Cuándo dejar POD y pasar a stock:**
- A partir de 100 unidades/mes del mismo SKU el POD pierde rentabilidad.
- Imprenta local Madrid/Barcelona: ~6 €/camiseta a 100 uds (vs 9,80 € POD).
- Inversión inicial 600 €, pero margen sube de 55 % a 75 %.

### Stock pequeño (segunda ola, otoño 2026)

- Imprime 50 uds × 6 SKUs más vendidos.
- Almacenamiento en casa o en mini-trastero (~30 €/mes).
- Envío con Correos paquete azul (4,90 € España, 9,90 € UE).

---

## 5. Plataforma técnica

**Stack mínimo recomendado:**

- **Shopify Lite** (~9 €/mes) o **Shopify Basic** (29 €/mes si quieres web independiente).
- Integración con Printful: nativa, plug-and-play, sin API custom.
- Pago: Stripe + Bizum (España) + PayPal (recobro internacional).

**Integración con `mundiales-de-futbol.com`:**

Opción A · subdominio: `tienda.mundiales-de-futbol.com` apuntando a Shopify.

Opción B · Headless: usar Shopify Storefront API y montar `/tienda` dentro del Next.js actual. Más control de marca, pero +20 h de trabajo.

**Recomendación:** empezar con **opción A** (subdominio), migrar a B si la conversión justifica el desarrollo.

**Páginas a crear en el site editorial (Next.js):**

- `/tienda` — landing comercial con catálogo destacado, link al subdominio Shopify.
- Bloque de producto inline en `/historias/[slug]` cuando aplique (camiseta «MARACANAZO» en la historia 7).
- CTA en footer global.

---

## 6. Pricing · cómo decidir

**Fórmula base:** precio venta = (coste POD + envío medio) ÷ (1 − margen objetivo) × IVA.

Ejemplo camiseta:
- Coste POD: 9,80 €
- Coste envío medio absorbido: 1,20 €
- Coste total: 11,00 €
- Margen objetivo: 50 %
- Subtotal: 22 €
- IVA 21 %: 22 × 1,21 = **26,62 €** → redondear a **24,90 €** (psicológico) absorbiendo 1,72 €.

**Reglas que mantengo siempre:**

- **Envío gratis a España desde 30 €** (incentiva carrito de 2+ unidades).
- **Bundle pack «España Mundial 2026»** (camiseta + póster + pin) a 49,90 € (vs 60,70 € sumados): ancla mental de descuento.
- **Pre-order con descuento 15 %** durante mayo 2026, entrega antes del partido inaugural 11 jun.

---

## 7. Lanzamiento · go-to-market

**Cronograma sugerido (asumiendo lanzamiento mayo 2026):**

| Semana | Hito | Cómo |
|---|---|---|
| -8 | Diseños finalizados | Briefing a freelance ilustrador (300-600 €/diseño). Aprobación interna. |
| -6 | Mockups y fotos hero | Sesión de fotos producto (180 € freelance + props). |
| -4 | Web tienda + integración | Shopify configurado, Printful conectado, 12 SKUs cargados. |
| -3 | Pre-order abierto a lista | Email a suscriptores newsletter + barra anuncio en home. |
| -2 | Lanzamiento público | Post pillar en `/tienda`, anuncio en redes sociales, link bloque countdown. |
| -1 | Push reviews | Pedir 10 reviews iniciales a primeros compradores. |
| 0 | Mundial empieza | Tráfico pico, garantizar stock POD operativo, empujar pre-orders. |

**Canales de captación (sin presupuesto pagado al inicio):**

1. **Email** a la lista del site (Resend ya integrado).
2. **Bloque «Tienda»** en cada página `/2026/sedes/[city]` (camiseta de la ciudad si aplica) y en `/historias/[slug]` (camiseta de la historia).
3. **Schema.org Product** en cada SKU para aparecer en Google Shopping orgánico.
4. **Reels Instagram** (6 piezas inicial: una por SKU destacado + 1 unboxing).
5. **TikTok** con voz off explicando la historia detrás del diseño (formato editorial nativo del site).

**Presupuesto pagado opcional (mes lanzamiento):** 200-400 € en Meta Ads dirigido a fans de selecciones que han comprado camisetas Adidas retro en últimos 90 días.

---

## 8. Logística y atención al cliente

**Política de devoluciones:**
- 14 días naturales por desistimiento (obligatorio UE).
- Producto sin usar y con etiquetas. Cliente paga retorno (excepto defecto).
- Reembolso en 14 días desde recepción.

**Plantillas email mínimas (Resend):**
1. Confirmación pedido.
2. Pedido enviado + tracking.
3. Pedido entregado + petición de review.
4. Recuperación carrito abandonado (-1 día).
5. Newsletter mensual (mantener relación).

**Atención al cliente:**
- Email único: `tienda@mundiales-de-futbol.com`.
- SLA: respuesta en 24 h laborables.
- Stock de plantillas en Notion para incidencias frecuentes (talla, fallo de impresión, retraso fronterizo).

---

## 9. SEO y captación orgánica · cómo encajar la tienda con el site editorial

**Keywords que rinden bien:**
- «camiseta Mundial 2026», «poster Mundial fútbol», «merchandising selección España Mundial 2026», «camiseta retro Maracanazo», «regalo aficionado fútbol».

**Bloques de tienda dentro del editorial:**

```
/historias/maracanazo-1950 → bloque "Camiseta Maracanazo · 24,90 €"
/2026/sedes/atlanta → bloque "Camiseta debut España · 24,90 €"
/2026/fan-zone → bloque "Set posavasos 4 estilos USA · 19,90 €"
/ediciones/1986-mexico → bloque "Camiseta Gol del Siglo · 27,90 €"
```

**JSON-LD Product** en cada ficha del Shopify (precio, disponibilidad, reviews) → entra en Google Shopping orgánico sin pagar.

**Sitemap:** generar `sitemap-tienda.xml` desde Shopify y enlazarlo en `robots.txt`.

---

## 10. Métricas · qué mirar cada semana

| Métrica | Target lanzamiento | Target estable |
|---|---|---|
| Conversión visitante → comprador | 0,8 % | 1,5-2 % |
| Ticket medio | 22 € | 28 € (con bundles) |
| Margen bruto | 55 % | 60 % |
| Repeat rate (90 días) | 8 % | 15 % |
| CAC pagado | < 4 € | < 6 € |
| LTV / CAC | > 3 | > 5 |
| NPS | > 40 | > 60 |

Dashboard semanal en Notion o Plausible Goals con: ventas, conversión, ticket medio, top 3 SKU, devoluciones %.

---

## 11. Pendientes legales · España

- Alta IAE epígrafe **665.9** (comercio menor por correo).
- Modelo 303 trimestral IVA. POD Printful EU emite factura UE-OSS, repercutible.
- Página `/aviso-legal` actualizada con identidad fiscal.
- Política privacidad y cookies (ya existen en el site, ampliar a tratamiento de datos de pedido).
- Términos y condiciones específicos de tienda (devoluciones, garantías, jurisdicción).
- Registro como vendedor a distancia ante AEAT si superas umbral OSS UE (10 000 €/año).

---

## 12. Roadmap a 12 meses

| Mes | Hito | Inversión esperada |
|---|---|---|
| Mes 1 (mayo 26) | Lanzamiento 12 SKUs | 1 200 € (diseño + Shopify setup + sesión fotos) |
| Mes 2 (jun 26) | Pico Mundial · 60-80 % de ventas anuales | 400 € ads · facturación esperada 6 000-12 000 € |
| Mes 3 (jul 26) | Mantener fase final | 200 € ads |
| Mes 4 (ago 26) | Análisis y poda. Dejar 6 SKUs ganadores | 0 € |
| Mes 6 (oct 26) | Segunda ola · stock 50 uds × 6 SKUs | 600 € imprenta local |
| Mes 9 (ene 27) | Bundle navideño · merch retro 1986/2010 | 300 € diseño |
| Mes 12 (abr 27) | Línea femenina (Mundial femenino 2027) | 800 € |

**Punto de equilibrio esperado:** mes 2-3, asumiendo 250 unidades vendidas en pico Mundial.

---

## Apéndice · checklist de lanzamiento

- [ ] 12 diseños en Figma con mockups
- [ ] Shopify configurado (12 SKUs, fotos, descripciones SEO, schema Product)
- [ ] Printful conectado, productos sincronizados
- [ ] Stripe + Bizum + PayPal activos
- [ ] Página `/tienda` en site editorial
- [ ] Bloques de producto en 6+ páginas pilar (sedes, historias)
- [ ] 5 emails Resend configurados
- [ ] Política devoluciones, T&C, privacidad actualizadas
- [ ] Aviso fiscal (alta IAE, modelo 303)
- [ ] Newsletter de pre-launch enviada
- [ ] 6 reels Instagram editados
- [ ] 200 € reservados para ads mes 1
