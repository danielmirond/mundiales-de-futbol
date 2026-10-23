/** Rankings de la NCAA (AP Top 25 y otros) de la API pública de ESPN. */
export type RankRow = { rank: number; previous: number; team: string; logo?: string; record: string; points: number; firstPlace: number };
export type Ranking = { name: string; headline: string; rows: RankRow[] };

export async function fetchRanking(sport: string, league: string, prefer = 'AP Top 25'): Promise<Ranking | null> {
  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/rankings`, { headers: { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' }, next: { revalidate: 3600 } });
    if (!res.ok) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = (data.rankings ?? []).find((x: any) => x.name === prefer) ?? data.rankings?.[0];
    if (!r?.ranks?.length) return null;
    return {
      name: r.name,
      headline: r.headline ?? r.name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rows: r.ranks.map((x: any) => ({
        rank: x.current, previous: x.previous, team: x.team?.location ?? x.team?.name ?? '', logo: x.team?.logos?.[0]?.href ?? x.team?.logo,
        record: x.recordSummary ?? '', points: Math.round(x.points ?? 0), firstPlace: x.firstPlaceVotes ?? 0,
      })),
    };
  } catch {
    return null;
  }
}
