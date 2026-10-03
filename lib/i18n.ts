// ─────────────────────────────────────────────────────────────────────────────
// Cool Shift · UI strings (English / 繁體中文)
// Currently wired into the front page, TopBar and BottomNav.
// ─────────────────────────────────────────────────────────────────────────────

export type Lang = "en" | "zh";

export interface HomeStrings {
  greeting: (name: string) => string;
  tagline: string;
  humidity: (n: number) => string;
  quick: { cooling: string; ev: string; budget: string; impact: string };
  heroTitle: string;
  heroSubtitle: string;
  tipsTitle: string;
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
    tagline: "讓今天過得更舒適、更慳電。",
    humidity: (n) => `濕度 ${n}%`,
    quick: { cooling: "冷氣", ev: "充電", budget: "預算", impact: "社區" },
    heroTitle: "舒適享受，用更少能源",
    heroSubtitle: "你的建議設定 · 晚上 7:30 開始",
    tipsTitle: "你的下一步",
    seeAll: "查看全部",
    budgetTitle: "七月預算",
    manage: "管理",
    budgetOf: (spent, budget) => `已用 HK$${spent}，預算 HK$${budget}`,
    budgetOver: (projected, delta) =>
      `預計 HK$${projected} — 超支約 HK$${delta}，立即調整`,
    budgetOnTrack: (projected) => `進度良好 — 預計 HK$${projected}`,
    blockTitle: "你的樓宇",
    seeImpact: "查看影響",
    blockLine1: "第 7 座本月已轉移 412 度電",
    blockLine2: "你在 86 戶中排名第 2 — 已節省 18.2 度電",
    footnote: "概念示範 · 智能電錶、電價及合作夥伴數據僅供參考",
  },
};

// Tip text overrides keyed by tip id (numbers stay identical to the engine).
export const tipStrings: Record<
  Lang,
  Record<string, { title: string; kwh: string }>
> = {
  en: {},
  zh: {
    cooling: { title: "晚上 7:30 為客廳開冷氣", kwh: "≈ 19 度電移離高峰時段" },
    charging: {
      title: "晚上 11 時後為電動車充電",
      kwh: "≈ 每年 176 度電改用離峰電價",
    },
    habit: { title: "晚上 9 時後才開乾衣機", kwh: "≈ 每年轉移 33 度電" },
  },
};

// Translate the suffix of an engine-generated savings string, e.g.
// "HK$27–34 / month" → "HK$27–34/月"
export function zhSavings(s: string): string {
  return s.replace(" / month", "/月").replace(" per charge", " · 每次充電");
}

export const navStrings: Record<
  Lang,
  { home: string; insights: string; ask: string; rewards: string }
> = {
  en: { home: "Home", insights: "Insights", ask: "Ask", rewards: "Rewards" },
  zh: { home: "主頁", insights: "分析", ask: "問答", rewards: "獎賞" },
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
