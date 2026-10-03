// ─────────────────────────────────────────────────────────────────────────────
// Cool Shift · mascot raising game ("Watt-son" 節能仔)
//
// Companion-token loop: every loyalty point the household earns also mints one
// "Frosty" (涼涼果) snack token. Frosties are spent feeding the mascot, which
// converts engagement with energy-saving actions into a pet that grows with
// the user — the emotional hook that keeps the points economy spinning.
// ─────────────────────────────────────────────────────────────────────────────

export const XP_PER_FEED = 10;
export const XP_PER_PAT = 1;
export const PAT_COOLDOWN_MS = 4000;
export const STARTING_SNACKS = 12;

// ── Levels ───────────────────────────────────────────────────────────────────
// XP needed to go from `level` → `level + 1` grows linearly (30, 60, 90 …),
// so early levels come fast (demo-friendly) and later ones feel earned.
export function xpNeededFor(level: number): number {
  return 30 * level;
}

export function levelFromXp(xp: number): {
  level: number;
  into: number; // xp earned inside the current level
  needed: number; // xp required to clear the current level
} {
  let level = 1;
  let remaining = Math.max(0, xp);
  while (remaining >= xpNeededFor(level)) {
    remaining -= xpNeededFor(level);
    level += 1;
  }
  return { level, into: remaining, needed: xpNeededFor(level) };
}

// ── Evolution stages ─────────────────────────────────────────────────────────
export interface PetStage {
  minLevel: number;
  name: string;
  nameZh: string;
  accessory: string; // emoji worn by the mascot ("" = none)
  aura: boolean; // glowing aura ring behind the mascot
  outfitId?: string; // real outfit image auto-unlocked at this stage
  tagline: string;
  taglineZh: string;
}

export const petStages: PetStage[] = [
  {
    minLevel: 1,
    name: "Frosty Baby",
    nameZh: "雪米寶寶",
    accessory: "",
    aura: false,
    tagline: "Just hatched from a snowflake.",
    taglineZh: "啱啱由雪花孵出嚟。",
  },
  {
    minLevel: 3,
    name: "Breeze Buddy",
    nameZh: "涼風伙伴",
    accessory: "🎀",
    aura: false,
    tagline: "Loves a well-set air-con.",
    taglineZh: "最鍾意啱啱好嘅冷氣設定。",
  },
  {
    minLevel: 5,
    name: "Frost Knight",
    nameZh: "冰雪騎士",
    accessory: "❄️",
    aura: true,
    tagline: "Defends your home from peak tariffs.",
    taglineZh: "守護你屋企，抵擋高峰電價。",
  },
  {
    minLevel: 8,
    name: "Eco Master",
    nameZh: "節能大師",
    accessory: "",
    aura: true,
    outfitId: "eco",
    tagline: "Every kWh shifted makes it stronger.",
    taglineZh: "每轉移一度電，佢都會變強。",
  },
  {
    minLevel: 12,
    name: "Aurora Guardian",
    nameZh: "極光守護神",
    accessory: "",
    aura: true,
    outfitId: "aurora",
    tagline: "Legend says it cools the whole estate.",
    taglineZh: "傳說佢可以令全邨都涼快。",
  },
];

// ── Wardrobe ─────────────────────────────────────────────────────────────────
// Outfits are full-character renders (transparent PNG, bottom-anchored on a
// 512-tall canvas) so swapping them never shifts Watt-son's pose or size.
export interface PetOutfit {
  id: string;
  name: string;
  nameZh: string;
  src: string | null; // null = base mascot art
  ratio: number; // image width / height
  unlock:
    | { type: "default" }
    | { type: "stage"; minLevel: number }
    | { type: "shop"; cost: number }; // cost in Frosties
  blurb: string;
  blurbZh: string;
}

export const petOutfits: PetOutfit[] = [
  {
    id: "base",
    name: "Classic Watt-son",
    nameZh: "經典節能仔",
    src: null,
    ratio: 375 / 512,
    unlock: { type: "default" },
    blurb: "The one and only.",
    blurbZh: "原汁原味，最經典。",
  },
  {
    id: "scarf",
    name: "Cozy Scarf",
    nameZh: "冬日頸巾",
    src: "/pet/outfit-scarf.png",
    ratio: 470 / 512,
    unlock: { type: "shop", cost: 80 },
    blurb: "Knitted with love for chilly nights.",
    blurbZh: "冷氣房必備，暖笠笠。",
  },
  {
    id: "eco",
    name: "Eco Master",
    nameZh: "節能大師",
    src: "/pet/outfit-eco.png",
    ratio: 436 / 512,
    unlock: { type: "stage", minLevel: 8 },
    blurb: "A leaf haori for true energy savers.",
    blurbZh: "專屬慳電達人嘅綠葉羽織。",
  },
  {
    id: "aurora",
    name: "Aurora Guardian",
    nameZh: "極光守護神",
    src: "/pet/outfit-aurora.png",
    ratio: 432 / 512,
    unlock: { type: "stage", minLevel: 12 },
    blurb: "Crowned in northern light.",
    blurbZh: "頭戴金冠，身披極光。",
  },
];

export function outfitById(id: string): PetOutfit {
  return petOutfits.find((o) => o.id === id) ?? petOutfits[0];
}

export function isOutfitUnlocked(
  outfit: PetOutfit,
  level: number,
  owned: string[]
): boolean {
  if (outfit.unlock.type === "default") return true;
  if (outfit.unlock.type === "stage") return level >= outfit.unlock.minLevel;
  return owned.includes(outfit.id);
}

export function stageForLevel(level: number): PetStage {
  let current = petStages[0];
  for (const s of petStages) if (level >= s.minLevel) current = s;
  return current;
}

export function nextStage(level: number): PetStage | null {
  return petStages.find((s) => s.minLevel > level) ?? null;
}

// ── Mood (time since last meal) ──────────────────────────────────────────────
export type PetMoodKey = "happy" | "okay" | "hungry";

export interface PetMood {
  key: PetMoodKey;
  emoji: string;
  line: string;
  lineZh: string;
}

const moods: Record<PetMoodKey, PetMood> = {
  happy: {
    key: "happy",
    emoji: "😊",
    line: "So full of clean energy! Let’s save more today.",
    lineZh: "食飽咗潔淨能源！今日繼續慳多啲。",
  },
  okay: {
    key: "okay",
    emoji: "🙂",
    line: "A little peckish… a Frosty would be nice.",
    lineZh: "有啲肚餓…想食粒涼涼果。",
  },
  hungry: {
    key: "hungry",
    emoji: "🥺",
    line: "Feed me! Earn points and I’ll grow strong.",
    lineZh: "餵我吖！賺積分我就可以快高長大。",
  },
};

export function moodFor(lastFedAt: number | null, now = Date.now()): PetMood {
  if (!lastFedAt) return moods.happy;
  const hours = (now - lastFedAt) / 3.6e6;
  if (hours < 8) return moods.happy;
  if (hours < 24) return moods.okay;
  return moods.hungry;
}
