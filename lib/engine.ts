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
import { localize, translator, type Lang } from "./i18n";

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
export function coolingTip(lang: Lang = "en"): Tip {
  const t = translator(lang);
  // AC ~1.0 kW input. Tonight: start 19:30 at 25.5°C instead of 18:00 at 24°C.
  const kwhSavedPerNight = 0.85; // compressor duty-cycle model (illustrative)
  const rate = tariffAt(19).rate;
  const perNight = kwhSavedPerNight * rate;
  const monthLo = perNight * 22 * 0.8;
  const monthHi = perNight * 22;
  return {
    id: "cooling",
    icon: "snowflake",
    title: t("Cool the living room at 7:30 PM", "晚上 7:30 先開客廳冷氣"),
    detail: t(
      `Humidity is ${weather.humidity}%. Pre-cool briefly, then hold 25.5°C with a fan — comfort stays, compressor rests.`,
      `濕度 ${weather.humidity}%。先短暫預冷，再配合風扇維持 25.5°C — 一樣舒適，壓縮機又可以休息。`
    ),
    savings: t(
      `${hkd(monthLo)}–${hkd(monthHi)} / month`,
      `每月 ${hkd(monthLo)}–${hkd(monthHi)}`
    ),
    kwh: t("≈ 19 kWh shifted out of peak", "≈ 19 度電移離繁忙時段"),
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

export function chargingTip(lang: Lang = "en"): Tip {
  const t = translator(lang);
  const s = chargingSavingPerSession();
  const off = s.offpeak.toFixed(2);
  const peak = s.peak.toFixed(2);
  return {
    id: "charging",
    icon: "battery",
    title: t("Charge the EV after 11 PM", "晚上 11 時後先為電動車充電"),
    detail: t(
      `Same ${s.kwhNeeded} kWh, ready by 7:00 AM — but at the HK$${off}/kWh off-peak rate instead of HK$${peak}.`,
      `一樣充 ${s.kwhNeeded} 度電，早上 7 時前充好 — 但用每度 HK$${off} 的非繁忙時段電價，而唔係 HK$${peak}。`
    ),
    savings: t(
      `${hkd(s.lo)}–${hkd(s.hi)} per charge`,
      `每次充電慳 ${hkd(s.lo)}–${hkd(s.hi)}`
    ),
    kwh: t("≈ 176 kWh / year off-peak", "≈ 每年 176 度電改用非繁忙時段"),
    href: "/charging",
  };
}

// ── Appliance habit tip ──────────────────────────────────────────────────────
export function habitTip(lang: Lang = "en"): Tip {
  const t = translator(lang);
  // Dryer: 2.5 kWh per load, 3 loads a week, moved out of the peak band.
  const kwhPerLoad = 2.5;
  const delta = tariffAt(20).rate - tariffAt(23).rate;
  const monthLo = kwhPerLoad * delta * 13 * 0.8;
  const monthHi = kwhPerLoad * delta * 13;
  return {
    id: "habit",
    icon: "flame",
    title: t("Run the dryer after 9 PM", "晚上 9 時後先用乾衣機"),
    detail: t(
      "Same dry clothes, cheaper electrons. Set the delay timer before dinner and it runs itself.",
      "衫一樣乾，電費更平。晚飯前設定好延時，佢會自己開始。"
    ),
    savings: t(
      `${hkd(monthLo)}–${hkd(monthHi)} / month`,
      `每月 ${hkd(monthLo)}–${hkd(monthHi)}`
    ),
    kwh: t("≈ 33 kWh / year shifted", "≈ 每年轉移 33 度電"),
    href: "/insights",
  };
}

export function dailyTips(lang: Lang = "en"): Tip[] {
  return [coolingTip(lang), chargingTip(lang), habitTip(lang)];
}

// ── Bill explanation (answers "Why did my bill go up?") ──────────────────────
export function billExplanation(lang: Lang = "en") {
  const t = translator(lang);
  const delta = bill.thisMonth - bill.lastMonth;
  const drivers = bill.drivers.map((d) =>
    lang === "zh" ? { ...d, label: d.labelZh, why: d.whyZh } : d
  );
  const month = t(bill.month, bill.monthZh);
  return {
    ...bill,
    month,
    drivers,
    delta,
    headline: t(
      `Your ${month} bill is ${hkd(delta)} higher than last month.`,
      `你${month}的電費比上月多 ${hkd(delta)}。`
    ),
    plainSummary: t(
      `${hkd(drivers[0].amount)} of the ${hkd(delta)} increase is cooling — ${drivers[0].why.toLowerCase()}`,
      `增加的 ${hkd(delta)} 之中，有 ${hkd(drivers[0].amount)} 來自冷氣 — ${drivers[0].why}`
    ),
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
export function tonightPlan(lang: Lang = "en") {
  const t = translator(lang);
  const charge = chargingSavingPerSession();
  const peakRate = tariffAt(18).rate.toFixed(2);
  const offRate = charge.offpeak.toFixed(2);
  return {
    steps: [
      {
        label: t("Cooling", "冷氣"),
        time: t("7:30 PM", "晚上 7:30"),
        setting: "25.5°C",
      },
      {
        label: t("EV charging", "電動車充電"),
        time: t("11:00 PM", "晚上 11:00"),
        setting: t("80% target", "目標 80%"),
      },
    ],
    calc: [
      t(
        `Humidity tonight: ${weather.humidity}% (feels like ${weather.feelsLikeC}°C)`,
        `今晚濕度：${weather.humidity}%（體感 ${weather.feelsLikeC}°C）`
      ),
      t(
        `Peak tariff HK$${peakRate}/kWh applies 4–9 PM`,
        `下午 4 時至晚上 9 時為繁忙時段，每度 HK$${peakRate}`
      ),
      t(
        "Your living-room AC draws ~1.0 kW; starting at 7:30 PM with a 25.5°C setpoint saves ≈0.85 kWh tonight",
        "客廳冷氣約用 1.0 千瓦；晚上 7:30 開始並設定 25.5°C，今晚可慳約 0.85 度電"
      ),
      t(
        `EV needs ${charge.kwhNeeded} kWh; at 11 PM the rate drops to HK$${offRate}/kWh — ${hkd(charge.lo)}–${hkd(charge.hi)} saved this charge`,
        `電動車需要 ${charge.kwhNeeded} 度電；晚上 11 時後電價降至每度 HK$${offRate} — 今次充電可慳 ${hkd(charge.lo)}–${hkd(charge.hi)}`
      ),
      t(
        "Very Hot Weather Warning is off, so a later start is safe. If it were on, we'd never suggest delaying cooling.",
        "現時沒有酷熱天氣警告，遲啲先開冷氣是安全的。如有警告，我們絕不會建議延遲開冷氣。"
      ),
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

export function chatReply(raw: string, ctx?: ChatContext, lang: Lang = "en"): ChatAnswer {
  const t = translator(lang);
  const zh = lang === "zh";
  const q = raw.toLowerCase();

  // Mission / challenge check — the agent inspects live progress
  if (/(mission|challenge|progress|how am i doing|goal|task|任務|挑戰|進度|目標)/.test(q)) {
    if (ctx) {
      const done = ctx.missions.filter((m) => m.done);
      const active = ctx.missions.filter((m) => !m.done);
      const closest = active.sort(
        (a, b) => b.progress / b.goal - a.progress / a.goal
      )[0];
      const lines = ctx.missions
        .map((m) =>
          zh
            ? `${m.done ? "✅" : "▶️"} ${m.title} — ${m.done ? "已完成" : `${m.progress}/${m.goal} ${m.unit}`}（+${m.points} 分）`
            : `${m.done ? "✅" : "▶️"} ${m.title} — ${m.done ? "complete" : `${m.progress}/${m.goal} ${m.unit}`} (+${m.points} pts)`
        )
        .join("\n");
      const doneLine =
        done.length > 0
          ? t(`${done.length} completed so far — nicely done. `, `已完成 ${done.length} 個，做得好！`)
          : "";
      const closestLine = closest
        ? t(
            `Closest to done: “${closest.title}” — ${closest.goal - closest.progress} more ${closest.unit} and you earn ${closest.points} points.`,
            `最接近完成：「${closest.title}」— 再多 ${closest.goal - closest.progress} ${closest.unit}就有 ${closest.points} 積分。`
          )
        : t("All missions complete. New ones drop Monday!", "全部任務完成！新任務星期一推出。");
      return {
        text: t(
          `Here's your mission check-in:\n\n${lines}\n\n${doneLine}${closestLine}`,
          `你的任務進度：\n\n${lines}\n\n${doneLine}${closestLine}`
        ),
        card: "missions",
      };
    }
    return {
      text: t(
        "You're 1 step from finishing “Shift your evening energy” (+60 pts) and 4/5 through “Charge after 11 PM” (+80 pts). Keep going!",
        "再做多一次就完成「轉移黃昏用電」（+60 分），「晚上 11 時後充電」亦已完成 4/5（+80 分）。繼續加油！"
      ),
      card: "missions",
    };
  }

  if (/(\bev\b|charging|charge my|e-?bike|\bbike|充電|電動車|單車)/.test(q)) {
    const s = chargingSavingPerSession();
    const off = s.offpeak.toFixed(2);
    const peak = s.peak.toFixed(2);
    return {
      text: t(
        `Charging after 11 PM costs HK$${off}/kWh instead of HK$${peak} — for your usual ${s.kwhNeeded} kWh top-up that's ${hkd(s.lo)}–${hkd(s.hi)} saved every charge, about HK$140 a month at twice a week. You're 4/5 through the "Charge after 11 PM" mission, too — one more off-peak charge earns 80 points.`,
        `晚上 11 時後充電每度只需 HK$${off}，而唔係 HK$${peak} — 以你平時充 ${s.kwhNeeded} 度電計，每次慳 ${hkd(s.lo)}–${hkd(s.hi)}，一星期充兩次每月約慳 HK$140。你「晚上 11 時後充電」任務亦已完成 4/5 — 多一次非繁忙時段充電就有 80 積分。`
      ),
    };
  }

  if (/(bill|expensive|high|rise|went up|increase|電費|帳單|賬單|貴|多咗|增加)/.test(q)) {
    const e = billExplanation(lang);
    return {
      text: t(
        `${e.headline}\n\n${e.plainSummary}\n\nEV charging added ${hkd(e.drivers[1].amount)} — two sessions started in the peak band. Want me to fix both? The plan below shifts ~HK$104 of next month's spend.`,
        `${e.headline}\n\n${e.plainSummary}\n\n電動車充電多了 ${hkd(e.drivers[1].amount)} — 有兩次在繁忙時段開始充電。要我一次過幫你搞掂？下面的計劃可以為下月轉移約 HK$104 電費。`
      ),
      card: "bill",
    };
  }

  if (/(save|saving|cheap|reduce|cut|lower|慳|節省|減少|平啲|悭)/.test(q)) {
    const tips = dailyTips(lang);
    const list = tips.map((tip, i) => `${i + 1}. ${tip.title} → ${tip.savings}`).join("\n");
    return {
      text: t(
        `Here are your three highest-value moves right now — each is one specific action with the saving attached:\n\n${list}\n\nNone of them ask you to be less comfortable.`,
        `以下是現在最值得做的三件事 — 每項都是具體行動，附上可慳的金額：\n\n${list}\n\n全部都唔使犧牲舒適。`
      ),
      card: "tips",
    };
  }

  if (/(plan|tonight|schedule|evening|計劃|今晚|安排|夜晚)/.test(q)) {
    return {
      text: t(
        "You get home around 6 PM, so here's tonight, sorted:\n\n• Start cooling at 7:30 PM at 25.5°C — the flat is still cool when you want it.\n• Charge the EV from 11:00 PM, ready by 7:00 AM.\n• Run the dryer after 9 PM.\n\nTap below to see exactly how I calculated this.",
        "你大約 6 點返到屋企，今晚咁安排就啱：\n\n• 晚上 7:30 開冷氣，設定 25.5°C — 想涼嘅時候屋企一樣涼。\n• 晚上 11:00 開始為電動車充電，早上 7 點前充好。\n• 晚上 9 點後先用乾衣機。\n\n按下面睇吓我點樣計出嚟。"
      ),
      card: "plan",
    };
  }

  if (/(budget|spend|afford|allowance|預算|使費|開支|使咗)/.test(q)) {
    const b = budgetStatus(ctx?.budget ?? profile.monthlyBudget);
    return {
      text: t(
        `You've spent HK$${b.spentHkd} of your HK$${b.budget} July budget. On the current pace you'd land at ~HK$${b.projected} — about HK$${b.delta} over. The fastest fix: shift cooling and EV charging out of the 6–11 PM peak and you're back on track. Check the Budget page for your daily allowance of HK$${b.dailyAllowance}.`,
        `七月預算 HK$${b.budget}，你已用 HK$${b.spentHkd}。照現時速度，月尾會用到約 HK$${b.projected} — 超支約 HK$${b.delta}。最快的方法：把冷氣和電動車充電移離晚上 6 至 11 時，就可以返回正軌。到「預算」頁查看每日可用的 HK$${b.dailyAllowance}。`
      ),
    };
  }

  if (/(reward|points|offer|voucher|coffee|獎賞|積分|優惠|禮券|咖啡)/.test(q)) {
    const nearest = localize(partnerOffers[0], lang);
    const pts = ctx?.points ?? 240;
    return {
      text: t(
        `You have ${pts} points. Nearest treat: ${nearest.title} at ${nearest.partner}, ${nearest.distanceM} m away for ${nearest.points} points. And if you'd rather grow them, you can invest points into clean-energy portfolios in Rewards.`,
        `你有 ${pts} 積分。最近的獎賞：${nearest.partner}的${nearest.title}，距離 ${nearest.distanceM} 米，只需 ${nearest.points} 積分。如果想積分增值，亦可以在「獎賞」頁投資潔淨能源組合。`
      ),
      card: "offers",
    };
  }

  if (/(building|neighbour|community|block|together|大廈|鄰居|街坊|社區|一齊)/.test(q)) {
    return {
      text: t(
        `${building.name} has shifted ${building.kwhShiftedThisMonth} kWh this month — ${building.householdsJoined} of ${building.householdsTotal} households are in. You're ranked #${building.rank} of ${building.blocksCompeting} blocks. ${building.groupReward}`,
        `${building.nameZh}本月已轉移 ${building.kwhShiftedThisMonth} 度電 — ${building.householdsTotal} 戶中有 ${building.householdsJoined} 戶參與。在 ${building.blocksCompeting} 座大廈中排第 ${building.rank}。${building.groupRewardZh}`
      ),
    };
  }

  if (/(hello|hi|hey|morning|afternoon|你好|哈囉|早晨|午安)/.test(q)) {
    return {
      text: t(
        `Hi ${profile.name}! It's ${weather.tempC}°C and ${weather.humidity}% humidity outside. Ask me about your bill, tonight's plan, or how to save without losing comfort.`,
        `${profile.name}你好！外面 ${weather.tempC}°C，濕度 ${weather.humidity}%。你可以問我電費、今晚的安排，或者點樣唔犧牲舒適都可以慳電。`
      ),
    };
  }

  return {
    text: t(
      "I can explain your bill, plan tonight's cooling and charging, check your budget, or find savings — every answer comes with a HK$ figure from your meter data. Try one of the chips above.",
      "我可以解釋你的電費、安排今晚的冷氣和充電、查看預算，或者幫你搵慳電方法 — 每個答案都附上根據電錶數據計算的金額。試吓按上面的建議問題。"
    ),
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
