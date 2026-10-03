// Deterministic savings engine. All HKD figures come from here, never from the chat layer.
// Tariff values are illustrative for the pilot and not CLP's published residential tariff.

export const TARIFF = {
  peak: 1.75, // HK$/kWh, 4 PM – 11 PM (pilot time-of-use)
  shoulder: 1.6,
  offPeak: 1.35, // 11 PM – 7 AM
  average: 1.6,
}

export const PEAK_START = 16
export const PEAK_END = 23
export const CO2_KG_PER_KWH = 0.39
export const POINTS_PER_HKD = 10 // 100 EcoPoints = HK$10
export const KG_CO2_PER_TREE_YEAR = 21

export const isPeakHour = (h) => h >= PEAK_START && h < PEAK_END

export const hkd = (n, digits = 0) =>
  'HK$' + Number(n).toLocaleString('en-HK', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export const pointsToHkd = (pts) => pts / POINTS_PER_HKD
export const hkdToPoints = (v) => Math.round(v * POINTS_PER_HKD)

/** Saving from moving `kwh` out of peak into off-peak. */
export const shiftSaving = (kwh) => kwh * (TARIFF.peak - TARIFF.offPeak)

/** Saving from avoiding `kwh` entirely during peak. */
export const avoidSaving = (kwh) => kwh * TARIFF.peak

export const co2 = (kwh) => kwh * CO2_KG_PER_KWH

export const range = (v, spread = 0.2) => [v * (1 - spread), v * (1 + spread)]

export const fmtRange = ([lo, hi], digits = 1) => `${hkd(lo, digits)}–${hkd(hi, digits).replace('HK$', '')}`

/** AC: each +1°C on the set point saves ~6–8% of cooling energy. Humidity adjusts dry-mode benefit. */
export function acSaving({ coolingKwh, fromC, toC, humidity }) {
  const perDegree = humidity > 80 ? 0.06 : 0.08
  const kwh = coolingKwh * perDegree * Math.max(0, toC - fromC)
  return { kwh, hkd: avoidSaving(kwh) }
}

export function evSaving({ sessionKwh }) {
  return { kwh: sessionKwh, hkd: shiftSaving(sessionKwh) }
}

/** Projected bill for the bi-monthly period based on usage so far. */
export function projectBill({ spentSoFar, daysElapsed, daysTotal }) {
  return (spentSoFar / daysElapsed) * daysTotal
}
