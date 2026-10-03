// ─────────────────────────────────────────────────────────────────────────────
// Cool Shift · mock data layer
// All figures are illustrative but internally consistent, so every number the
// app shows can be traced back to (fake) smart-meter data and a published
// time-of-use tariff — mirroring how the real product would work on CLP data.
// ─────────────────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  estate: string;
  block: string;
  flatType: string;
  residents: number;
  hasEV: boolean;
  hasEBike: boolean;
  acUnits: number;
  hasWaterHeater: boolean;
  hasDryer: boolean;
  hasWasher: boolean;
  homeHour: number; // typical time household gets home (24h)
  monthlyBudget: number; // HKD
  zh?: Partial<Omit<Profile, "zh">>;
}

export const profile: Profile = {
  name: "Alex",
  estate: "City One Shatin",
  block: "Block 7",
  flatType: "2-bedroom flat · 46 m²",
  residents: 3,
  hasEV: true,
  hasEBike: true,
  acUnits: 2,
  hasWaterHeater: true,
  hasDryer: true,
  hasWasher: true,
  homeHour: 18,
  monthlyBudget: 700,
  zh: { estate: "沙田第一城", block: "第 7 座", flatType: "兩房單位 · 46 平方米" },
};

// ── Weather ──────────────────────────────────────────────────────────────────
export const weather = {
  tempC: 29,
  feelsLikeC: 33,
  humidity: 82,
  condition: "Hot & humid",
  conditionZh: "炎熱潮濕",
  veryHotWarning: false, // when true, the app never suggests reducing cooling
  tonightLowC: 27,
};

// ── Illustrative time-of-use tariff (HKD / kWh) ─────────────────────────────
export interface TariffBand {
  label: string;
  start: number; // hour
  end: number; // hour
  rate: number; // HKD per kWh
  labelZh: string;
}
export const tariffBands: TariffBand[] = [
  { label: "Off-peak", labelZh: "非繁忙時段", start: 23, end: 7, rate: 1.06 },
  { label: "Day", labelZh: "日間", start: 7, end: 16, rate: 1.44 },
  { label: "Evening peak", labelZh: "黃昏繁忙時段", start: 16, end: 21, rate: 1.87 },
  { label: "Evening", labelZh: "夜間", start: 21, end: 23, rate: 1.44 },
];

export function tariffAt(hour: number): TariffBand {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  for (const band of tariffBands) {
    if (band.start < band.end) {
      if (h >= band.start && h < band.end) return band;
    } else if (h >= band.start || h < band.end) {
      return band;
    }
  }
  return tariffBands[0];
}

// ── Smart-meter data (illustrative) ──────────────────────────────────────────
// Yesterday, hourly kWh — sums to 12.8. Evening peak (18–23) dominates.
export const hourlyUsageYesterday: number[] = [
  0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.5, 0.7, 0.6, 0.4, 0.4, 0.5, 0.6, 0.5, 0.4,
  0.4, 0.5, 0.6, 0.9, 1.1, 1.2, 1.0, 0.8, 0.4,
];
export const yesterdayKwh = 12.8;

export const usageBreakdown = [
  { label: "Cooling", labelZh: "冷氣", pct: 58, kwh: 7.4 },
  { label: "Appliances", labelZh: "家電", pct: 24, kwh: 3.1 },
  { label: "Water heating", labelZh: "熱水爐", pct: 11, kwh: 1.4 },
  { label: "Lighting & other", labelZh: "照明及其他", pct: 7, kwh: 0.9 },
];

// ── Bill (illustrative) ──────────────────────────────────────────────────────
export const bill = {
  month: "June",
  monthZh: "六月",
  thisMonth: 642,
  lastMonth: 518,
  kwhThisMonth: 428,
  kwhLastMonth: 356,
  // Every dollar of the increase is explained:
  drivers: [
    {
      label: "Cooling",
      amount: 86,
      why: "5 more very-hot days than May — your AC ran ~38 kWh more, mostly 6–11 PM.",
      labelZh: "冷氣",
      whyZh: "酷熱日子比五月多 5 日 — 冷氣多用了約 38 度電，大多在晚上 6 至 11 時。",
    },
    {
      label: "EV charging at peak",
      amount: 18,
      why: "Two charges started before 9 PM, during the HK$1.87/kWh peak band.",
      labelZh: "繁忙時段充電",
      whyZh: "有兩次在晚上 9 時前開始充電，正值每度 HK$1.87 的繁忙時段。",
    },
    {
      label: "Water heater",
      amount: 12,
      why: "Longer heating window in the morning peak of your routine.",
      labelZh: "熱水爐",
      whyZh: "早上用熱水的時段較長，加熱時間隨之增加。",
    },
    {
      label: "Everything else",
      amount: 8,
      why: "Small changes across appliances and lighting.",
      labelZh: "其他",
      whyZh: "家電及照明用電的輕微變化。",
    },
  ],
};

// Month-to-date spend for the budget feature
export const monthToDate = {
  month: "July",
  monthZh: "七月",
  dayOfMonth: 18,
  daysInMonth: 31,
  spentHkd: 412,
};

// ── Missions (gamified energy saving) ────────────────────────────────────────
export interface Mission {
  id: string;
  title: string;
  desc: string;
  points: number;
  goal: number;
  startProgress: number;
  unit: string;
  action: string; // label of the check-in button
  zh?: Partial<Omit<Mission, "zh">>;
}
export const missions: Mission[] = [
  {
    id: "shift-evening",
    title: "Shift your evening energy",
    desc: "Move one big load out of 6–11 PM, three times this week.",
    points: 60,
    goal: 3,
    startProgress: 2,
    unit: "shifts",
    action: "Log tonight’s shift",
    zh: {
      title: "轉移黃昏用電",
      desc: "本星期有三晚把一項大型用電移離晚上 6 至 11 時。",
      unit: "次",
      action: "記錄今晚的轉移",
    },
  },
  {
    id: "cool-week",
    title: "The 25.5° week",
    desc: "Run your AC at 25.5°C with a fan for 7 evenings.",
    points: 100,
    goal: 7,
    startProgress: 3,
    unit: "evenings",
    action: "Log tonight’s cooling",
    zh: {
      title: "25.5° 冷氣週",
      desc: "連續 7 晚把冷氣設定在 25.5°C，再配合風扇。",
      unit: "晚",
      action: "記錄今晚的冷氣",
    },
  },
  {
    id: "charge-offpeak",
    title: "Charge after 11 PM",
    desc: "Charge your EV or e-bike fully off-peak, 5 times.",
    points: 80,
    goal: 5,
    startProgress: 4,
    unit: "charges",
    action: "Log an off-peak charge",
    zh: {
      title: "晚上 11 時後充電",
      desc: "在非繁忙時段為電動車或電動單車充滿電 5 次。",
      unit: "次",
      action: "記錄一次非繁忙時段充電",
    },
  },
];

// ── Partner offers (partner platform) ────────────────────────────────────────
export type OfferCategory =
  | "Food & Coffee"
  | "Charging"
  | "Home Services"
  | "Experiences";

export interface PartnerOffer {
  id: string;
  partner: string;
  title: string;
  category: OfferCategory;
  points: number;
  distanceM: number;
  pin: { x: number; y: number }; // position on the illustrative map (%)
  blurb: string;
  zh?: Partial<Pick<PartnerOffer, "partner" | "title" | "blurb">>;
}

export const categoryLabelsZh: Record<OfferCategory, string> = {
  "Food & Coffee": "餐飲咖啡",
  Charging: "充電",
  "Home Services": "家居服務",
  Experiences: "文化體驗",
};

export const partnerOffers: PartnerOffer[] = [
  {
    id: "cafe-voucher",
    partner: "Neighbourhood Café",
    title: "HK$20 coffee voucher",
    category: "Food & Coffee",
    points: 120,
    distanceM: 350,
    pin: { x: 52, y: 38 },
    blurb: "Redeem for any hand-drip or espresso drink. Partner-funded offer.",
    zh: { partner: "街坊咖啡店", title: "HK$20 咖啡券", blurb: "可換購任何手沖或意式咖啡。優惠由合作商戶提供。" },
  },
  {
    id: "charging-credit",
    partner: "ChargeHK",
    title: "HK$30 charging credit",
    category: "Charging",
    points: 200,
    distanceM: 500,
    pin: { x: 76, y: 30 },
    blurb: "Off-peak charging credit at any ChargeHK station in Sha Tin.",
    zh: { partner: "ChargeHK", title: "HK$30 充電額", blurb: "可於沙田任何 ChargeHK 充電站在非繁忙時段使用。" },
  },
  {
    id: "ac-service",
    partner: "CoolCare Services",
    title: "AC deep-clean, HK$150 off",
    category: "Home Services",
    points: 450,
    distanceM: 900,
    pin: { x: 30, y: 66 },
    blurb:
      "Triggered because your unit’s estimated efficiency dropped ~8%. A clean unit uses up to 15% less energy.",
    zh: { partner: "CoolCare 冷氣服務", title: "冷氣深層清洗減 HK$150", blurb: "因為你的冷氣機估計效能下降約 8%。清潔過的冷氣機最多可慳 15% 電。" },
  },
  {
    id: "ebike-swap",
    partner: " Volt Bikes",
    title: "Free e-bike battery swap ×2",
    category: "Charging",
    points: 150,
    distanceM: 650,
    pin: { x: 20, y: 42 },
    blurb: "Swap and go at the kiosk near Sha Tin Station.",
    zh: { partner: "Volt Bikes", title: "免費電動單車換電 ×2", blurb: "到沙田站附近的換電站，即換即走。" },
  },
  {
    id: "bakery",
    partner: "Block 7 Bakery",
    title: "HK$15 bakery voucher",
    category: "Food & Coffee",
    points: 90,
    distanceM: 120,
    pin: { x: 62, y: 58 },
    blurb: "Fresh pineapple buns, two blocks from home.",
    zh: { partner: "第 7 座餅店", title: "HK$15 餅店券", blurb: "新鮮出爐菠蘿包，離家只隔兩座。" },
  },
  {
    id: "gallery",
    partner: "Sha Tin Cultural Hub",
    title: "Weekend gallery pass ×2",
    category: "Experiences",
    points: 180,
    distanceM: 1100,
    pin: { x: 44, y: 78 },
    blurb: "Community event tickets — part of CLP’s neighbourhood programme.",
    zh: { partner: "沙田文化館", title: "週末展覽門票 ×2", blurb: "社區活動門票 — 中電社區計劃的一部分。" },
  },
  {
    id: "handyman",
    partner: "Estate Property Management",
    title: "Home energy check-up",
    category: "Home Services",
    points: 300,
    distanceM: 0,
    pin: { x: 68, y: 76 },
    blurb:
      "A 30-minute visit from your estate team: seals, filters and water-heater timer setup.",
    zh: { partner: "屋苑物業管理處", title: "家居節能檢查", blurb: "屋苑團隊上門 30 分鐘：檢查門窗密封、隔塵網及設定熱水爐定時器。" },
  },
];

// ── Clean-energy point investing (illustrative) ──────────────────────────────
export interface GreenFund {
  id: string;
  name: string;
  focus: string;
  ytdPct: number; // illustrative year-to-date return
  tone: string;
  zh?: Partial<Pick<GreenFund, "name" | "focus" | "tone">>;
}
export const greenFunds: GreenFund[] = [
  {
    id: "hk-solar",
    name: "HK Solar & Storage Basket",
    focus: "Rooftop solar, batteries and smart-grid firms in Hong Kong.",
    ytdPct: 6.2,
    tone: "Steady",
    zh: { name: "香港太陽能及儲能組合", focus: "香港的天台太陽能、電池及智能電網企業。", tone: "穩健" },
  },
  {
    id: "asia-wind",
    name: "Asia Offshore Wind Index",
    focus: "Offshore wind developers across Guangdong and the region.",
    ytdPct: 4.1,
    tone: "Moderate",
    zh: { name: "亞洲離岸風電指數", focus: "廣東及區內的離岸風電發展商。", tone: "中等" },
  },
  {
    id: "grid-future",
    name: "Future Grid Innovators",
    focus: "EV charging, demand response and energy-AI companies.",
    ytdPct: 8.9,
    tone: "Growth",
    zh: { name: "未來電網創新企業", focus: "電動車充電、需求響應及能源 AI 公司。", tone: "增長" },
  },
];
export const POINTS_TO_HKD = 0.1; // 10 points ≈ HK$1 (illustrative)

// ── Building community (social harmony) ──────────────────────────────────────
export const building = {
  name: "Block 7 · City One Shatin",
  nameZh: "沙田第一城 · 第 7 座",
  householdsJoined: 86,
  householdsTotal: 144,
  kwhShiftedThisMonth: 412,
  goalKwh: 500,
  rank: 3,
  blocksCompeting: 12,
  co2AvoidedKg: 318,
  treesEquivalent: 13,
  leaderboard: [
    { flat: "Flat 7A", flatZh: "7A 室", kwh: 26.4 },
    { flat: "You (Flat 7C)", flatZh: "你（7C 室）", kwh: 18.2, you: true },
    { flat: "Flat 7F", flatZh: "7F 室", kwh: 15.9 },
    { flat: "Flat 7B", flatZh: "7B 室", kwh: 12.6 },
    { flat: "Flat 7H", flatZh: "7H 室", kwh: 11.3 },
  ] as { flat: string; flatZh: string; kwh: number; you?: boolean }[],
  groupReward: "If Block 7 reaches 500 kWh shifted, every participating household earns 120 points.",
  groupRewardZh: "如果第 7 座合共轉移 500 度電，每戶參與家庭都可獲 120 積分。",
};

// ── Comparison with similar homes ────────────────────────────────────────────
export const comparison = {
  youKwhPerDay: 12.8,
  similarHomesKwhPerDay: 14.6,
  similarLabel: "3-person flats in City One Shatin",
  similarLabelZh: "沙田第一城三人家庭",
};
