/**
 * Vídeos recientes de un canal de YouTube vía su feed RSS público
 * (`feeds/videos.xml?channel_id=`): sin API key ni cuota. Caché 1 h.
 */
export type YtVideo = { id: string; title: string; published: string; views?: number };

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export async function fetchChannelVideos(channelId: string | undefined, limit = 8): Promise<YtVideo[]> {
  if (!channelId || !/^UC[\w-]{22}$/.test(channelId)) return [];
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
