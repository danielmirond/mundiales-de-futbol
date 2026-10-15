/**
 * Reacciones del directo: emoji + frase cerrada (sin texto libre → sin
 * moderación). Las de partido solo salen en tarjetas de marcador.
 */
export type ReactionDef = { key: string; emoji: string; label: string };

export const REACTIONS_GENERAL: ReactionDef[] = [
  { key: 'brutal', emoji: '🔥', label: 'Brutal' },
  { key: 'crack', emoji: '👏', label: 'Qué crack' },
  { key: 'increible', emoji: '😮', label: 'No me lo creo' },
  { key: 'risa', emoji: '😂', label: 'Me parto' },
  { key: 'duele', emoji: '💔', label: 'Duele' },
  { key: 'verguenza', emoji: '😡', label: 'Vergüenza' },
];
export const REACTIONS_MATCH: ReactionDef[] = [
  { key: 'partidazo', emoji: '🔥', label: 'Partidazo' },
  { key: 'merecido', emoji: '👏', label: 'Merecido' },
  { key: 'robo', emoji: '🙈', label: 'Robo' },
  { key: 'arbitro', emoji: '🟥', label: 'Vaya árbitro' },
  { key: 'sufrir', emoji: '😰', label: 'Qué sufrimiento' },
  { key: 'aburrido', emoji: '😴', label: 'Un tostón' },
];
export const ALL_REACTIONS = new Map([...REACTIONS_GENERAL, ...REACTIONS_MATCH].map((r) => [r.key, r]));

export type CardReactions = { counts: Record<string, number>; recent: { reaction: string; at: string }[] };
