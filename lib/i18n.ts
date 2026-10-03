// ─────────────────────────────────────────────────────────────────────────────
// Cool Shift · UI strings (English / 繁體中文)
// Page copy uses the inline `t(en, zh)` helper from `useT()`; data fixtures
// carry a `zh` override block resolved with `localize()`.
// ─────────────────────────────────────────────────────────────────────────────

export type Lang = "en" | "zh";

export type Translate = (en: string, zh: string) => string;

export function translator(lang: Lang): Translate {
  return (en, zh) => (lang === "zh" ? zh : en);
}

// Merge an item's `zh` overrides on top of its English fields
export function localize<T extends { zh?: Partial<Omit<T, "zh">> }>(
  item: T,
  lang: Lang
): T {
  return lang === "zh" && item.zh ? { ...item, ...item.zh } : item;
}

export interface HomeStrings {
  greeting: (name: string) => string;
  tagline: string;
  humidity: (n: number) => string;
  quick: { cooling: string; ev: string; budget: string; impact: string };
  heroTitle: string;
  heroSubtitle: string;
  tipsTitle: string;
  tipsHint: string;
  seeAll: string;
  budgetTitle: string;
  manage: string;
  budgetOf: (spent: number, budget: number) => string;
  budgetOver: (projected: number, delta: number) => string;
  budgetOnTrack: (projected: number) => string;
  blockTitle: string;
  seeImpact: string;
  blockLine1: string;
  blockLine2: string;
  footnote: string;
}

export const homeStrings: Record<Lang, HomeStrings> = {
  en: {
    greeting: (name) => `Hi ${name}`,
    tagline: "Let’s make today feel better.",
    humidity: (n) => `Humidity ${n}%`,
    quick: { cooling: "Cooling", ev: "EV", budget: "Budget", impact: "Impact" },
    heroTitle: "Comfort, with less energy",
    heroSubtitle: "Your suggested setting · start 7:30 PM",
    tipsTitle: "Your next moves",
    tipsHint: "Tap me for another",
    seeAll: "See all",
    budgetTitle: "July budget",
    manage: "Manage",
    budgetOf: (spent, budget) => `HK$${spent} of HK$${budget}`,
    budgetOver: (projected, delta) =>
      `Projected HK$${projected} — ~HK$${delta} over, let’s fix that`,
    budgetOnTrack: (projected) => `On track — projected HK$${projected}`,
    blockTitle: "Your block",
    seeImpact: "See impact",
    blockLine1: "Block 7 has shifted 412 kWh this month",
    blockLine2: "You’re #2 of 86 households — 18.2 kWh and counting",
    footnote:
      "Concept demo · illustrative smart-meter, tariff and partner data",
  },
  zh: {
    greeting: (name) => `你好，${name}`,
    tagline: "今日都要涼得舒服、慳得輕鬆。",
    humidity: (n) => `濕度 ${n}%`,
    quick: { cooling: "冷氣", ev: "電動車", budget: "預算", impact: "社區" },
    heroTitle: "一樣涼快，用電更少",
    heroSubtitle: "建議設定 · 晚上 7:30 開始",
    tipsTitle: "下一步做咩好",
    tipsHint: "撳我睇下一個",
    seeAll: "查看全部",
    budgetTitle: "七月預算",
    manage: "管理",
    budgetOf: (spent, budget) => `已用 HK$${spent}／預算 HK$${budget}`,
    budgetOver: (projected, delta) =>
      `預計 HK$${projected}，超支約 HK$${delta}，一齊調整吓`,
    budgetOnTrack: (projected) => `進度理想，預計 HK$${projected}`,
    blockTitle: "你的大廈",
    seeImpact: "查看成果",
    blockLine1: "第 7 座本月已轉移 412 度電",
    blockLine2: "你在 86 戶中排第 2 — 已轉移 18.2 度電",
    footnote: "概念示範 · 智能電錶、電價及合作商戶數據僅作說明用途",
  },
};

export const navStrings: Record<
  Lang,
  { home: string; insights: string; ask: string; rewards: string }
> = {
  en: { home: "Home", insights: "Insights", ask: "Ask", rewards: "Rewards" },
  zh: { home: "主頁", insights: "用電分析", ask: "問一問", rewards: "獎賞" },
};

export const topBarStrings: Record<
  Lang,
  { langButton: string; langTitle: string; simpleTitle: string }
> = {
  en: {
    langButton: "中",
    langTitle: "切換至繁體中文",
    simpleTitle: "Simple mode — larger text (inclusive journeys)",
  },
  zh: {
    langButton: "EN",
    langTitle: "Switch to English",
    simpleTitle: "簡易模式 — 放大字體（共融設計）",
  },
};
