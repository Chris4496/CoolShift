"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CircleDollarSign,
  Heart,
  Leaf,
  MessageCircle,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Users,
  Zap,
} from "lucide-react";

interface Slide {
  dark?: boolean;
  kicker?: string;
  title: React.ReactNode;
  body: React.ReactNode;
}

const hkd = "HK$";

const slides: Slide[] = [
  {
    dark: true,
    kicker: "⚡ Powered by CLP · Hackathon concept",
    title: (
      <>
        Cool Shift
        <span className="mt-4 block text-[34px] font-extrabold leading-tight md:text-[42px]">
          Small actions.{" "}
          <span className="text-clp-orange">Everyday value.</span>
        </span>
      </>
    ),
    body: (
      <p>
        A personal AI assistant that turns CLP’s smart meters, tariffs, rewards and
        partners into <strong>one proactive customer journey</strong> — from
        electricity supplier to trusted energy & lifestyle partner.
      </p>
    ),
  },
  {
    kicker: "The problem",
    title: "Electricity is a monthly bill, not something you can manage.",
    body: (
      <ul className="space-y-3">
        <li>🏠 Compact, humid Hong Kong homes run cooling, appliances and EVs harder every summer.</li>
        <li>📈 Demand is rising and more variable — hot-evening peaks strain the grid.</li>
        <li>🔌 The energy system is decentralising; customers need a reason to engage daily.</li>
        <li>🧩 CLP already owns the assets — smart meters, digital platform, rewards, missions — but they sit as <strong>separate features</strong>.</li>
      </ul>
    ),
  },
  {
    kicker: "What customers actually ask",
    title: "Five questions. One assistant.",
    body: (
      <ol className="space-y-2.5">
        <li><strong>1.</strong> Why is my electricity bill increasing? <span className="opacity-60">→ Insights + Ask, explained in HK$</span></li>
        <li><strong>2.</strong> When should I run the AC, washer or dryer? <span className="opacity-60">→ 3 daily tips with tariff timing</span></li>
        <li><strong>3.</strong> How do I charge an EV without adding to the peak? <span className="opacity-60">→ Smart charging, 11 PM–7 AM</span></li>
        <li><strong>4.</strong> How do I join saving programmes without losing comfort? <span className="opacity-60">→ Missions with comfort-first guardrails</span></li>
        <li><strong>5.</strong> Which action fits <em>my</em> home? <span className="opacity-60">→ Personal energy profile, not generic advice</span></li>
      </ol>
    ),
  },
  {
    kicker: "The product",
    title: "Three tips a day. Each one action, each with a HK$ figure.",
    body: (
      <ul className="space-y-3">
        <li><Zap size={16} className="mr-2 inline" /> “Cool at 7:30 PM, 25.5°C” — HK$26–34 / month</li>
        <li><Zap size={16} className="mr-2 inline" /> “Charge the EV after 11 PM” — HK$16–18 per charge</li>
        <li><Zap size={16} className="mr-2 inline" /> “Dryer after 9 PM” — HK$15–20 / month</li>
        <li className="opacity-60">No charts to decode. No guilt. Just moves that pay.</li>
      </ul>
    ),
  },
  {
    dark: true,
    kicker: "Purposeful AI — an enabler of value, not a demo",
    title: "The model explains. The numbers come from the meter.",
    body: (
      <ul className="space-y-3">
        <li><strong>Personalisation</strong> — learns each household’s load pattern from smart-meter data + a short profile.</li>
        <li><strong>Optimisation</strong> — picks the best time to cool, charge and run appliances against weather, humidity and tariff.</li>
        <li><strong>Explanation</strong> — turns meter data into plain language with a {hkd} figure attached.</li>
        <li><strong>Dialogue</strong> — answers “Why did my bill go up?” in Cantonese, English or Mandarin.</li>
        <li className="border-t border-white/15 pt-3 text-white/70">
          Savings are calculated deterministically from meter data and published tariffs —
          the language model only explains them. Success is judged by <strong>kWh shifted
          and dollars saved, not chat volume</strong>.
        </li>
      </ul>
    ),
  },
  {
    kicker: "Live product",
    title: "The app is running — let’s walk through it.",
    body: (
      <div className="space-y-3">
        <p>Open the app in another tab and follow along:</p>
        <div className="grid grid-cols-2 gap-3 text-[15px]">
          <div className="rounded-2xl bg-black/[0.04] p-4"><strong>Home</strong><br />today’s 3 moves</div>
          <div className="rounded-2xl bg-black/[0.04] p-4"><strong>Insights</strong><br />bill explained in {hkd}</div>
          <div className="rounded-2xl bg-black/[0.04] p-4"><strong>Ask</strong><br />“Why is my bill higher?”</div>
          <div className="rounded-2xl bg-black/[0.04] p-4"><strong>Rewards</strong><br />missions → local partners</div>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-white">
          Open the app <ArrowRight size={15} />
        </Link>
      </div>
    ),
  },
  {
    kicker: "New · inclusive journeys",
    title: (
      <span className="flex items-center gap-3">
        <PiggyBank size={30} /> Budget control — no bill shock.
      </span>
    ),
    body: (
      <ul className="space-y-3">
        <li>Set a monthly limit; Cool Shift paces usage and alerts at 50 / 80 / 100%.</li>
        <li>“HK$22/day left to stay on budget” — a number anyone can act on.</li>
        <li>Built for inclusion: large-text simple mode, Cantonese voice input, caregiver view for elderly relatives, and <strong>no smart-home hardware required</strong>.</li>
      </ul>
    ),
  },
  {
    kicker: "New · electricity for social harmony",
    title: (
      <span className="flex items-center gap-3">
        <Building2 size={30} /> Your block shifts together.
      </span>
    ),
    body: (
      <ul className="space-y-3">
        <li>See your own saving — 18.2 kWh this month — and feel good about it.</li>
        <li>See the group: Block 7 has shifted <strong>412 kWh</strong> toward a 500 kWh goal; everyone earns 120 pts when it lands.</li>
        <li>Anonymised leaderboard builds friendly pressure and neighbourhood cohesion.</li>
        <li className="opacity-60">Behaviour, not infrastructure: estates that shift together avoid peak strain together.</li>
      </ul>
    ),
  },
  {
    kicker: "New · points that grow",
    title: (
      <span className="flex items-center gap-3">
        <Sprout size={30} /> Invest mission points in clean energy.
      </span>
    ),
    body: (
      <ul className="space-y-3">
        <li>Points earned from energy missions can be allocated to illustrative clean-energy portfolios — HK solar, offshore wind, future-grid innovators.</li>
        <li>Saving the planet → funding the planet: engagement that compounds.</li>
        <li>A new reason to return daily, and a story no other utility app tells.</li>
        <li className="opacity-60">Loyalty mechanics only — clearly labelled, never securities advice.</li>
      </ul>
    ),
  },
  {
    dark: true,
    kicker: "Value proposition",
    title: "Four winners, one loop.",
    body: (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-white/10 p-4"><Users size={17} className="mb-1.5" /><strong>Users</strong><br /><span className="text-white/70">Lower bills without losing comfort · 3 actions a day · rewards they already use</span></div>
        <div className="rounded-2xl bg-white/10 p-4"><Zap size={17} className="mb-1.5" /><strong>CLP</strong><br /><span className="text-white/70">Lower evening peak · daily instead of bi-monthly contact · partnership revenue · trusted lifestyle partner</span></div>
        <div className="rounded-2xl bg-white/10 p-4"><Target size={17} className="mb-1.5" /><strong>Partners</strong><br /><span className="text-white/70">Reach customers at the moment of need (AC service when efficiency drops) · pay only for results</span></div>
        <div className="rounded-2xl bg-white/10 p-4"><Leaf size={17} className="mb-1.5" /><strong>Hong Kong</strong><br /><span className="text-white/70">Less peak strain, lower emissions — through behaviour, not new infrastructure</span></div>
      </div>
    ),
  },
  {
    kicker: "Pilot — 12 weeks, this summer",
    title: "1,000 smart-meter households. One or two estates. Real numbers.",
    body: (
      <div className="space-y-3">
        <p className="opacity-70">≈100 EV owners · an elderly-resident cohort · a matched control group · inside the existing CLP app · 5–10 local partners.</p>
        <ul className="space-y-2">
          <li>✅ Evening-peak (4–11 PM) use <strong>5–8% below control</strong></li>
          <li>✅ ≥60% of EV charging moved off-peak</li>
          <li>✅ ≥40% weekly active users · ≥30% of tips acted on</li>
          <li>✅ Average verified saving per household, in {hkd}</li>
          <li>✅ Reward redemption rate · partner repeat rate</li>
        </ul>
      </div>
    ),
  },
  {
    kicker: "Risks → mitigations · route to scale",
    title: "Safe today, bigger tomorrow.",
    body: (
      <div className="space-y-3">
        <ul className="space-y-2 text-[15px]">
          <li><ShieldCheck size={14} className="mr-1.5 inline" /><strong>Privacy</strong> — opt-in, data minimisation, no household data shared with partners.</li>
          <li><ShieldCheck size={14} className="mr-1.5 inline" /><strong>Wrong advice</strong> — savings shown as ranges from deterministic calculations; human-reviewed tip library.</li>
          <li><Heart size={14} className="mr-1.5 inline" /><strong>Health</strong> — never reduce cooling during hot-weather warnings or for vulnerable users.</li>
          <li><MessageCircle size={14} className="mr-1.5 inline" /><strong>Engagement</strong> — missions, and a strict three-tip daily limit.</li>
          <li><ShieldCheck size={14} className="mr-1.5 inline" /><strong>Trust</strong> — offers clearly labelled; none that increase energy use.</li>
        </ul>
        <p className="border-t border-black/10 pt-3">
          <strong>Scale:</strong> pilot → all smart-meter app users → smart-home device
          control + open partner API → automated demand response.
        </p>
        <p className="flex items-center gap-2 text-[19px] font-bold text-clp-orange">
          <CircleDollarSign size={18} /> The ask: approval to run the 12-week pilot this summer.
        </p>
      </div>
    ),
  },
];

export default function PitchPage() {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];

  const go = useCallback(
    (d: number) => setIdx((i) => Math.min(slides.length - 1, Math.max(0, i + d))),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div
      className={`flex min-h-dvh flex-col ${
        slide.dark ? "bg-clp-navy text-white" : "bg-paper text-ink"
      }`}
    >
      {/* progress */}
      <div className="mx-auto w-full max-w-3xl px-6 pt-5">
        <div className={`h-1 w-full rounded-full ${slide.dark ? "bg-white/15" : "bg-black/10"}`}>
          <div
            className={`h-full rounded-full transition-all ${slide.dark ? "bg-white" : "bg-ink"}`}
            style={{ width: `${((idx + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* slide */}
      <main key={idx} className="slide-in mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-8">
        {slide.kicker && (
          <div className={`mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] ${slide.dark ? "text-white/50" : "text-mute"}`}>
            {slide.kicker}
          </div>
        )}
        <h1 className="text-[34px] font-bold leading-[1.12] tracking-tight md:text-[44px]">
          {slide.title}
        </h1>
        <div className={`mt-6 text-[16.5px] leading-relaxed md:text-[18px] ${slide.dark ? "text-white/85" : "text-ink/85"}`}>
          {slide.body}
        </div>
      </main>

      {/* controls */}
      <footer className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pb-6">
        <span className={`text-[12.5px] font-medium ${slide.dark ? "text-white/40" : "text-mute"}`}>
          {idx + 1} / {slides.length} · ← → to navigate
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={idx === 0}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition disabled:opacity-25 ${
              slide.dark ? "border-white/25" : "border-black/15"
            }`}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={idx === slides.length - 1}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition disabled:opacity-25 ${
              slide.dark ? "bg-white text-ink" : "bg-ink text-white"
            }`}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </footer>
    </div>
  );
}
