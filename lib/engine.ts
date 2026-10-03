// ─────────────────────────────────────────────────────────────────────────────
// Cool Shift · rules engine
// Purposeful AI principle: savings are computed DETERMINISTICALLY from meter
// data and the published tariff. In production an LLM would only turn these
// numbers into friendly language — it never invents a figure.
// ─────────────────────────────────────────────────────────────────────────────

import {
  bill,
  building,
  comparison,
  hourlyUsageYesterday,
  monthToDate,
  partnerOffers,
  profile,
  tariffAt,
  weather,
} from "./data";

export interface Tip {
  id: string;
  icon: "snowflake" | "battery" | "flame";
  title: string;
  detail: string;
  savings: string; // e.g. "HK$26–34 / month"
  kwh: string; // e.g. "≈ 16 kWh shifted"
  href: string;
}

const hkd = (n: number) => `HK$${Math.round(n)}`;

// ── Cooling tip: delay start + raise setpoint, quantified ────────────────────
export function coolingTip(): Tip {
  // AC ~1.0 kW input. Tonight: start 19:30 at 25.5°C instead of 18:00 at 24°C.
  const kwhSavedPerNight = 0.85; // compressor duty-cycle model (illustrative)
  const rate = tariffAt(19).rate;
  const perNight = kwhSavedPerNight * rate;
  const monthLo = perNight * 22 * 0.8;
  const monthHi = perNight * 22;
  return {
    id: "cooling",
    icon: "snowflake",
    title: "Cool the living room at 7:30 PM",
    detail: `Humidity is ${weather.humidity}%. Pre-cool briefly, then hold 25.5°C with a fan — comfort stays, compressor rests.`,
    savings: `${hkd(monthLo)}–${hkd(monthHi)} / month`,
    kwh: "≈ 19 kWh shifted out of peak",
    href: "/cooling",
  };
}

// ── EV charging tip: move the session off-peak ───────────────────────────────
export function chargingSavingPerSession() {
  const kwhNeeded = 22; // 42% → 80% on a 58 kWh pack
  const peak = tariffAt(19).rate; // 1.87
  const offpeak = tariffAt(23).rate; // 1.06
  const saving = kwhNeeded * (peak - offpeak);
  return { kwhNeeded, peak, offpeak, lo: saving * 0.9, hi: saving };
}

export function chargingTip(): Tip {
  const s = chargingSavingPerSession();
  return {
    id: "charging",
    icon: "battery",
    title: "Charge the EV after 11 PM",
    detail: `Same ${s.kwhNeeded} kWh, ready by 7:00 AM — but at the HK$${s.offpeak.toFixed(
      2
    )}/kWh off-peak rate instead of HK$${s.peak.toFixed(2)}.`,
    savings: `${hkd(s.lo)}–${hkd(s.hi)} per charge`,
    kwh: "≈ 176 kWh / year off-peak",
    href: "/charging",
  };
}

// ── Appliance habit tip ──────────────────────────────────────────────────────
export function habitTip(): Tip {
  // Dryer: 2.5 kWh per load, 3 loads a week, moved out of the peak band.
  const kwhPerLoad = 2.5;
  const delta = tariffAt(20).rate - tariffAt(23).rate;
  const monthLo = kwhPerLoad * delta * 13 * 0.8;
  const monthHi = kwhPerLoad * delta * 13;
  return {
    id: "habit",
    icon: "flame",
    title: "Run the dryer after 9 PM",
    detail:
      "Same dry clothes, cheaper electrons. Set the delay timer before dinner and it runs itself.",
    savings: `${hkd(monthLo)}–${hkd(monthHi)} / month`,
    kwh: "≈ 33 kWh / year shifted",
    href: "/insights",
  };
}

export function dailyTips(): Tip[] {
  return [coolingTip(), chargingTip(), habitTip()];
}

// ── Bill explanation (answers "Why did my bill go up?") ──────────────────────
export function billExplanation() {
  const delta = bill.thisMonth - bill.lastMonth;
  return {
    ...bill,
    delta,
    headline: `Your ${bill.month} bill is ${hkd(delta)} higher than last month.`,
    plainSummary: `${hkd(bill.drivers[0].amount)} of the ${hkd(
      delta
    )} increase is cooling — ${bill.drivers[0].why.toLowerCase()}`,
  };
}

// ── Budget projection ────────────────────────────────────────────────────────
export function budgetStatus(budget: number) {
  const { dayOfMonth, daysInMonth, spentHkd } = monthToDate;
  const projected = Math.round((spentHkd / dayOfMonth) * daysInMonth);
  const pacePct = Math.round((spentHkd / budget) * 100);
  const expectedPct = Math.round((dayOfMonth / daysInMonth) * 100);
  const over = projected > budget;
  return {
    ...monthToDate,
    budget,
    projected,
    pacePct,
    expectedPct,
    over,
    delta: Math.abs(projected - budget),
    dailyAllowance: Math.max(
      0,
      Math.round(((budget - spentHkd) / (daysInMonth - dayOfMonth)) * 10) / 10
    ),
  };
}

// ── Tonight's plan (used by Ask + Cooling + Charging) ────────────────────────
export function tonightPlan() {
  const cool = coolingTip();
  const charge = chargingSavingPerSession();
  return {
    steps: [
      {
        label: "Cooling",
        value: `${profile.homeHour + 1}:30 PM · 25.5°C`.replace("PM", "PM"),
        time: "7:30 PM",
        setting: "25.5°C",
      },
      { label: "EV charging", time: "11:00 PM", setting: "80% target" },
    ],
    calc: [
      `Humidity tonight: ${weather.humidity}% (feels like ${weather.feelsLikeC}°C)`,
      `Peak tariff HK$${tariffAt(18).rate.toFixed(2)}/kWh applies 4–9 PM`,
      `Your living-room AC draws ~1.0 kW; starting at 7:30 PM with a 25.5°C setpoint saves ≈0.85 kWh tonight`,
      `EV needs ${charge.kwhNeeded} kWh; at 11 PM the rate drops to HK$${charge.offpeak.toFixed(
        2
      )}/kWh — ${hkd(charge.lo)}–${hkd(charge.hi)} saved this charge`,
      `Very Hot Weather Warning is off, so a later start is safe. If it were on, we'd never suggest delaying cooling.`,
    ],
  };
}

// ── Chat (rule-based "dialogue" layer) ───────────────────────────────────────
export interface ChatAnswer {
  text: string;
  card?: "bill" | "plan" | "tips" | "offers" | "missions";
}

// Live context passed from the app store so the agent can check real state
// (mission progress, points balance, budget) instead of static fixtures.
export interface ChatContext {
  points: number;
  budget: number;
  missions: {
    id: string;
    title: string;
    progress: number;
    goal: number;
    points: number;
    done: boolean;
    unit: string;
  }[];
}

export function chatReply(raw: string, ctx?: ChatContext): ChatAnswer {
  const q = raw.toLowerCase();

  // Mission / challenge check — the agent inspects live progress
  if (/(mission|challenge|progress|how am i doing|goal|task)/.test(q)) {
    if (ctx) {
      const done = ctx.missions.filter((m) => m.done);
      const active = ctx.missions.filter((m) => !m.done);
      const closest = active.sort(
        (a, b) => b.progress / b.goal - a.progress / a.goal
      )[0];
      const lines = ctx.missions
        .map(
          (m) =>
            `${m.done ? "✅" : "▶️"} ${m.title} — ${m.done ? "complete" : `${m.progress}/${m.goal} ${m.unit}`} (+${m.points} pts)`
        )
        .join("\n");
      return {
        text: `Here's your mission check-in:\n\n${lines}\n\n${
          done.length > 0
            ? `${done.length} completed so far — nicely done. `
            : ""
        }${
          closest
            ? `Closest to done: “${closest.title}” — ${closest.goal - closest.progress} more ${closest.unit} and you earn ${closest.points} points.`
            : "All missions complete. New ones drop Monday!"
        }`,
        card: "missions",
      };
    }
    return {
      text: "You're 1 step from finishing “Shift your evening energy” (+60 pts) and 4/5 through “Charge after 11 PM” (+80 pts). Keep going!",
      card: "missions",
    };
  }

  if (/(bill|charge|expensive|high|rise|went up|increase)/.test(q)) {
    const e = billExplanation();
    return {
      text: `${e.headline}\n\n${e.plainSummary}\n\nEV charging added ${hkd(
        e.drivers[1].amount
      )} — two sessions started in the peak band. Want me to fix both? The plan below shifts ~HK$104 of next month's spend.`,
      card: "bill",
    };
  }

  if (/(save|saving|cheap|reduce|cut|lower)/.test(q)) {
    return {
      text: `Here are your three highest-value moves right now — each is one specific action with the saving attached:\n\n1. ${coolingTip().title} → ${coolingTip().savings}\n2. ${chargingTip().title} → ${chargingTip().savings}\n3. ${habitTip().title} → ${habitTip().savings}\n\nNone of them ask you to be less comfortable.`,
      card: "tips",
    };
  }

  if (/(plan|tonight|schedule|evening)/.test(q)) {
    return {
      text: `You get home around 6 PM, so here's tonight, sorted:\n\n• Start cooling at 7:30 PM at 25.5°C — the flat is still cool when you want it.\n• Charge the EV from 11:00 PM, ready by 7:00 AM.\n• Run the dryer after 9 PM.\n\nTap below to see exactly how I calculated this.`,
      card: "plan",
    };
  }

  if (/(ev|charging|charge|e-bike|ebike|bike)/.test(q)) {
    const s = chargingSavingPerSession();
    return {
      text: `Charging after 11 PM costs HK$${s.offpeak.toFixed(
        2
      )}/kWh instead of HK$${s.peak.toFixed(
        2
      )} — for your usual ${s.kwhNeeded} kWh top-up that's ${hkd(s.lo)}–${hkd(
        s.hi
      )} saved every charge, about HK$140 a month at twice a week. You're 4/5 through the "Charge after 11 PM" mission, too — one more off-peak charge earns 80 points.`,
    };
  }

  if (/(budget|spend|afford|allowance)/.test(q)) {
    const b = budgetStatus(ctx?.budget ?? profile.monthlyBudget);
    return {
      text: `You've spent HK$${b.spentHkd} of your HK$${b.budget} July budget. On the current pace you'd land at ~HK$${b.projected} — about HK$${b.delta} over. The fastest fix: shift cooling and EV charging out of the 6–11 PM peak and you're back on track. Check the Budget page for your daily allowance of HK$${b.dailyAllowance}.`,
    };
  }

  if (/(reward|points|offer|voucher|coffee)/.test(q)) {
    const nearest = partnerOffers[0];
    const pts = ctx?.points ?? 240;
    return {
      text: `You have ${pts} points. Nearest treat: ${nearest.title} at ${nearest.partner}, ${nearest.distanceM} m away for ${nearest.points} points. And if you'd rather grow them, you can invest points into clean-energy portfolios in Rewards.`,
      card: "offers",
    };
  }

  if (/(building|neighbour|community|block|together)/.test(q)) {
    return {
      text: `${building.name} has shifted ${building.kwhShiftedThisMonth} kWh this month — ${building.householdsJoined} of ${building.householdsTotal} households are in. You're ranked #${building.rank} of ${building.blocksCompeting} blocks. ${building.groupReward}`,
    };
  }

  if (/(hello|hi|hey|morning|afternoon)/.test(q)) {
    return {
      text: `Hi ${profile.name}! It's ${weather.tempC}°C and ${weather.humidity}% humidity outside. Ask me about your bill, tonight's plan, or how to save without losing comfort.`,
    };
  }

  return {
    text: `I can explain your bill, plan tonight's cooling and charging, check your budget, or find savings — every answer comes with a HK$ figure from your meter data. Try one of the chips above.`,
  };
}

// ── Comparison vs similar homes ──────────────────────────────────────────────
export function comparisonStat() {
  const pct = Math.round(
    (1 - comparison.youKwhPerDay / comparison.similarHomesKwhPerDay) * 100
  );
  return { ...comparison, pct };
}

export function peakShareYesterday() {
  // share of usage in 18–23h
  const peak = hourlyUsageYesterday.slice(18, 24).reduce((a, b) => a + b, 0);
  const total = hourlyUsageYesterday.reduce((a, b) => a + b, 0);
  return Math.round((peak / total) * 100);
}
