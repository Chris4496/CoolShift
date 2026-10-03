"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BatteryCharging,
  Building2,
  Car,
  ChevronRight,
  Droplets,
  Flame,
  PiggyBank,
  Snowflake,
  Sun,
  Wallet,
} from "lucide-react";
import { Card, Footnote, SectionTitle } from "@/components/ui";
import { Shell, TopBar, BottomNav } from "@/components/nav";
import { BurstLayer, PetFigure, useBursts } from "@/components/pet";
import { useApp } from "@/lib/store";
import { profile, weather } from "@/lib/data";
import { budgetStatus, dailyTips } from "@/lib/engine";
import { homeStrings } from "@/lib/i18n";

const tipIcons = {
  snowflake: <Snowflake size={17} />,
  battery: <BatteryCharging size={17} />,
  flame: <Flame size={17} />,
};

const quickActions = [
  { href: "/cooling", key: "cooling" as const, icon: Snowflake },
  { href: "/charging", key: "ev" as const, icon: Car },
  { href: "/budget", key: "budget" as const, icon: Wallet },
  { href: "/impact", key: "impact" as const, icon: Building2 },
];

export default function HomePage() {
  const { budget, lang, patPet } = useApp();
  const tips = dailyTips(lang);
  const [tipIndex, setTipIndex] = useState(0);
  const tip = tips[tipIndex];
  const b = budgetStatus(budget);
  const tr = homeStrings[lang];
  const hearts = useBursts();

  return (
    <Shell>
      <TopBar />

      {/* Greeting */}
      <div className="px-5">
        <h1 className="mt-1 text-[26px] font-bold tracking-tight">
          {tr.greeting(profile.name)}
        </h1>
        <p className="text-[14px] text-mute">{tr.tagline}</p>
        <div className="mt-3 flex items-center gap-4 text-[13.5px] font-medium">
          <span className="flex items-center gap-1.5">
            <Sun size={16} /> {weather.tempC}°C
          </span>
          <span className="h-4 w-px bg-hairline" />
          <span className="flex items-center gap-1.5 text-mute">
            <Droplets size={15} /> {tr.humidity(weather.humidity)}
          </span>
        </div>
      </div>

      {/* Mascot with rotating next-move tips */}
      <div className="mt-4 flex flex-col px-5">
        <div className="relative z-10 mx-auto w-[72%]">
          <div
            key={tip.id}
            className="bubble-in relative flex h-[150px] flex-col rounded-[22px] border border-hairline bg-white p-4 shadow-soft"
          >
            <span className="absolute -bottom-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-b border-r border-hairline bg-white" />
            <div className="flex items-center justify-between text-[11.5px] font-semibold text-mute">
              <span>{tr.tipsTitle}</span>
              <Link href="/insights" className="text-clp-blue">
                {tr.seeAll}
              </Link>
            </div>
            <Link href={tip.href} className="mt-2 block">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">{tipIcons[tip.icon]}</span>
                <span className="line-clamp-2 text-[15px] font-semibold leading-snug">
                  {tip.title}
                </span>
              </div>
              <div className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-mute">
                {tip.savings} · {tip.kwh}
              </div>
            </Link>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex gap-1">
                {tips.map((t, i) => (
                  <span
                    key={t.id}
                    className={`h-1.5 rounded-full transition-all ${
                      i === tipIndex ? "w-4 bg-ink" : "w-1.5 bg-hairline"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-mute">{tr.tipsHint}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setTipIndex((i) => (i + 1) % tips.length);
            patPet();
            hearts.spawn();
          }}
          aria-label={tr.tipsHint}
          className="relative -mt-8 flex flex-col items-center self-center transition active:scale-95"
        >
          <BurstLayer bursts={hearts.bursts} />
          <PetFigure height={310} priority />
          <div className="mascot-shadow -mt-10 h-14 w-40 rounded-full bg-[radial-gradient(ellipse,rgba(17,17,16,0.3)_0%,rgba(17,17,16,0.12)_50%,transparent_72%)]" />
        </button>
      </div>

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-4 gap-2.5 px-5">
        {quickActions.map((a, i) => (
          <Link
            key={a.href}
            href={a.href}
            className={`tap-target flex flex-col items-center gap-2 rounded-2xl border py-3.5 text-[12px] font-semibold transition active:scale-[0.97] ${
              i === 0
                ? "border-clp-blue bg-clp-blue text-white"
                : "border-hairline bg-white text-ink"
            }`}
          >
            <a.icon size={20} strokeWidth={1.9} />
            {tr.quick[a.key]}
          </Link>
        ))}
      </div>

      {/* Hero: suggested cooling setting */}
      <div className="px-5">
        <Link href="/cooling">
          <Card dark className="mt-4 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[15px] font-medium text-white/80">
                  {tr.heroTitle}
                </div>
                <div className="mt-2 text-[44px] font-bold leading-none tracking-tight">
                  25.5°C
                </div>
                <div className="mt-1.5 text-[13px] text-white/60">
                  {tr.heroSubtitle}
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Snowflake size={24} />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Budget mini-card */}
      <div className="px-5">
        <SectionTitle title={tr.budgetTitle} action={tr.manage} href="/budget" />
        <Link href="/budget">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper">
                  <PiggyBank size={17} />
                </div>
                <div>
                  <div className="text-[15px] font-semibold">
                    {tr.budgetOf(b.spentHkd, b.budget)}
                  </div>
                  <div className="text-[12.5px] text-mute">
                    {b.over
                      ? tr.budgetOver(b.projected, b.delta)
                      : tr.budgetOnTrack(b.projected)}
                  </div>
                </div>
              </div>
              <ChevronRight size={17} className="text-mute" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Community mini-card */}
      <div className="px-5">
        <SectionTitle title={tr.blockTitle} action={tr.seeImpact} href="/impact" />
        <Link href="/impact">
          <Card dark className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-medium text-white/85">
                  {tr.blockLine1}
                </div>
                <div className="mt-0.5 text-[12.5px] text-white/55">
                  {tr.blockLine2}
                </div>
              </div>
              <Building2 size={22} className="text-white/70" />
            </div>
          </Card>
        </Link>
        <Footnote>{tr.footnote}</Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
