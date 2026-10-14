/**
 * Vídeos recientes del canal oficial de un club. Dos vías, caché 1 h:
 *  1. YouTube Data API v3 con `YOUTUBE_API_KEY` (lista de subidas, 1 unidad
 *     de cuota por llamada; 10.000/día gratis).
 *  2. Feed RSS público (`feeds/videos.xml`): sin clave, pero YouTube lo
 *     bloquea desde IPs de centros de datos (Vercel devuelve 404/500).
 * Si ninguna responde, la ficha cae a la lista de reproducción embebida.
 */
export type YtVideo = { id: string; title: string; published: string; views?: number };

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** Lista de subidas del canal: mismo id con prefijo UU en lugar de UC. */
export const uploadsPlaylist = (channelId: string) => `UU${channelId.slice(2)}`;

async function viaApi(channelId: string, limit: number): Promise<YtVideo[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${Math.min(limit + 4, 20)}&playlistId=${uploadsPlaylist(channelId)}&key=${key}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const j = await res.json();
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    return (j.items ?? []).map((i: any): YtVideo => ({ id: i.snippet?.resourceId?.videoId ?? '', title: i.snippet?.title ?? '', published: i.snippet?.publishedAt ?? '' }))
      .filter((v: YtVideo) => v.id && !/^(private|deleted) video$/i.test(v.title) && !/#shorts/i.test(v.title)).slice(0, limit);
  } catch {
    return [];
  }
}

export async function fetchChannelVideos(channelId: string | undefined, limit = 8): Promise<YtVideo[]> {
  if (!channelId || !/^UC[\w-]{22}$/.test(channelId)) return [];
  const api = await viaApi(channelId, limit);
  if (api.length) return api;
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
      id: e.match(/<yt:videoId>([^<]+)/)?.[1] ?? '',
      title: decode(e.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''),
      published: e.match(/<published>([^<]+)/)?.[1] ?? '',
      views: Number(e.match(/<media:statistics views="(\d+)"/)?.[1]) || undefined,
    }))
      // Fuera los Shorts (vertical, sin miniatura útil en carrusel) cuando se marcan así.
      .filter((v) => v.id && !/#shorts/i.test(v.title))
      .slice(0, limit);
  } catch {
    return [];
  }
}
