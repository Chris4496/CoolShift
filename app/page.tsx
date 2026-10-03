"use client";

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
import { Card, Footnote, Row, SectionTitle } from "@/components/ui";
import { Shell, TopBar, BottomNav } from "@/components/nav";
import { useApp } from "@/lib/store";
import { profile, weather } from "@/lib/data";
import { budgetStatus, dailyTips } from "@/lib/engine";
import { homeStrings, tipStrings, zhSavings } from "@/lib/i18n";

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
  const { budget, lang } = useApp();
  const tips = dailyTips();
  const b = budgetStatus(budget);
  const tr = homeStrings[lang];
  const tipTr = tipStrings[lang];

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

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-4 gap-2.5 px-5">
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

      {/* Today's tips */}
      <div className="px-5">
        <SectionTitle title={tr.tipsTitle} action={tr.seeAll} href="/insights" />
        <Card className="divide-y divide-hairline">
          {tips.map((t) => {
            const zh = tipTr[t.id];
            return (
              <Row
                key={t.id}
                href={t.href}
                icon={tipIcons[t.icon]}
                title={zh?.title ?? t.title}
                subtitle={
                  zh
                    ? `${zhSavings(t.savings)} · ${zh.kwh}`
                    : `${t.savings} · ${t.kwh}`
                }
              />
            );
          })}
        </Card>
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
