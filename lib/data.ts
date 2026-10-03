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
};

// ── Weather ──────────────────────────────────────────────────────────────────
export const weather = {
  tempC: 29,
  feelsLikeC: 33,
  humidity: 82,
  condition: "Hot & humid",
  veryHotWarning: false, // when true, the app never suggests reducing cooling
  tonightLowC: 27,
};

// ── Illustrative time-of-use tariff (HKD / kWh) ─────────────────────────────
export interface TariffBand {
  label: string;
  start: number; // hour
  end: number; // hour
  rate: number; // HKD per kWh
}
export const tariffBands: TariffBand[] = [
  { label: "Off-peak", start: 23, end: 7, rate: 1.06 },
  { label: "Day", start: 7, end: 16, rate: 1.44 },
  { label: "Evening peak", start: 16, end: 21, rate: 1.87 },
  { label: "Evening", start: 21, end: 23, rate: 1.44 },
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
  { label: "Cooling", pct: 58, kwh: 7.4 },
  { label: "Appliances", pct: 24, kwh: 3.1 },
  { label: "Water heating", pct: 11, kwh: 1.4 },
  { label: "Lighting & other", pct: 7, kwh: 0.9 },
];

// ── Bill (illustrative) ──────────────────────────────────────────────────────
export const bill = {
  month: "June",
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
    },
    {
      label: "EV charging at peak",
      amount: 18,
      why: "Two charges started before 9 PM, during the HK$1.87/kWh peak band.",
    },
    {
      label: "Water heater",
      amount: 12,
      why: "Longer heating window in the morning peak of your routine.",
    },
    {
      label: "Everything else",
      amount: 8,
      why: "Small changes across appliances and lighting.",
    },
  ],
};

// Month-to-date spend for the budget feature
export const monthToDate = {
  month: "July",
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
}

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
  },
];

// ── Clean-energy point investing (illustrative) ──────────────────────────────
export interface GreenFund {
  id: string;
  name: string;
  focus: string;
  ytdPct: number; // illustrative year-to-date return
  tone: string;
}
export const greenFunds: GreenFund[] = [
  {
    id: "hk-solar",
    name: "HK Solar & Storage Basket",
    focus: "Rooftop solar, batteries and smart-grid firms in Hong Kong.",
    ytdPct: 6.2,
    tone: "Steady",
  },
  {
    id: "asia-wind",
    name: "Asia Offshore Wind Index",
    focus: "Offshore wind developers across Guangdong and the region.",
    ytdPct: 4.1,
    tone: "Moderate",
  },
  {
    id: "grid-future",
    name: "Future Grid Innovators",
    focus: "EV charging, demand response and energy-AI companies.",
    ytdPct: 8.9,
    tone: "Growth",
  },
];
export const POINTS_TO_HKD = 0.1; // 10 points ≈ HK$1 (illustrative)

// ── Building community (social harmony) ──────────────────────────────────────
export const building = {
  name: "Block 7 · City One Shatin",
  householdsJoined: 86,
  householdsTotal: 144,
  kwhShiftedThisMonth: 412,
  goalKwh: 500,
  rank: 3,
  blocksCompeting: 12,
  co2AvoidedKg: 318,
  treesEquivalent: 13,
  leaderboard: [
    { flat: "Flat 7A", kwh: 26.4 },
    { flat: "You (Flat 7C)", kwh: 18.2, you: true },
    { flat: "Flat 7F", kwh: 15.9 },
    { flat: "Flat 7B", kwh: 12.6 },
    { flat: "Flat 7H", kwh: 11.3 },
  ] as { flat: string; kwh: number; you?: boolean }[],
  groupReward: "If Block 7 reaches 500 kWh shifted, every participating household earns 120 points.",
};

// ── Comparison with similar homes ────────────────────────────────────────────
export const comparison = {
  youKwhPerDay: 12.8,
  similarHomesKwhPerDay: 14.6,
  similarLabel: "3-person flats in City One Shatin",
};
