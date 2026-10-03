"use client";

import React, { useState } from "react";
import { Bell, BellRing, ShieldCheck, Wallet } from "lucide-react";
import { Card, Footnote, SectionTitle } from "@/components/ui";
import { Shell, BackHeader, BottomNav } from "@/components/nav";
import { PaceBar } from "@/components/charts";
import { useApp } from "@/lib/store";
import { budgetStatus, dailyTips } from "@/lib/engine";

export default function BudgetPage() {
  const { budget, setBudget, toast } = useApp();
  const b = budgetStatus(budget);
  const tips = dailyTips();
  const [alerts, setAlerts] = useState({ a50: true, a80: true, a100: true });

  const toggle = (key: keyof typeof alerts, label: string) => {
    const next = { ...alerts, [key]: !alerts[key] };
    setAlerts(next);
    toast(next[key] ? `Alert on: ${label}` : `Alert off: ${label}`);
  };

  return (
    <Shell>
      <BackHeader title="Budget & alerts" subtitle="No surprises at the end of the month." />

      {/* Budget setter */}
      <div className="px-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[13px] font-medium text-mute">
            <Wallet size={14} /> Monthly electricity budget
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[40px] font-bold leading-none">HK${budget}</span>
            <span className="text-[13px] text-mute">/ month</span>
          </div>
          <input
            type="range"
            min={300}
            max={1500}
            step={10}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-4 w-full accent-ink"
          />
          <div className="flex justify-between text-[11.5px] font-medium text-mute">
            <span>HK$300</span>
            <span>HK$1,500</span>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-mute">
            Set a limit that fits your household. Cool Shift paces your usage against
            it and nudges you before — not after — you overshoot.
          </p>
        </Card>
      </div>

      {/* Status */}
      <div className="px-5">
        <SectionTitle title={`${b.month} so far`} />
        <Card className="p-5">
          <div className="flex items-baseline justify-between">
            <div className="text-[15px] font-semibold">
              HK${b.spentHkd} <span className="font-normal text-mute">spent · day {b.dayOfMonth} of {b.daysInMonth}</span>
            </div>
          </div>
          <div className="mt-3">
            <PaceBar spentPct={b.pacePct} expectedPct={b.expectedPct} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-paper p-3.5">
              <div className="text-[11.5px] font-medium text-mute">Projected bill</div>
              <div className="mt-0.5 text-[22px] font-bold">HK${b.projected}</div>
              <div className={`text-[11.5px] font-medium ${b.over ? "text-ink" : "text-mute"}`}>
                {b.over ? `~HK$${b.delta} over budget` : `HK$${b.delta} under budget`}
              </div>
            </div>
            <div className="rounded-2xl bg-paper p-3.5">
              <div className="text-[11.5px] font-medium text-mute">Daily allowance left</div>
              <div className="mt-0.5 text-[22px] font-bold">HK${b.dailyAllowance}</div>
              <div className="text-[11.5px] text-mute">per day to stay on budget</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <div className="px-5">
        <SectionTitle title="Alerts" />
        <Card className="divide-y divide-hairline">
          {(
            [
              ["a50", "At 50% of budget", "A gentle heads-up, mid-month"],
              ["a80", "At 80% of budget", "Time to shift a few loads"],
              ["a100", "At 100% of budget", "Immediate notification + tips"],
            ] as const
          ).map(([key, label, sub]) => (
            <div key={key} className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper">
                {alerts[key] ? <BellRing size={16} /> : <Bell size={16} />}
              </div>
              <div className="flex-1">
                <div className="text-[14.5px] font-medium">{label}</div>
                <div className="text-[12px] text-mute">{sub}</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={alerts[key]}
                onClick={() => toggle(key, label)}
                className={`tap-target relative h-7 w-12 rounded-full transition ${
                  alerts[key] ? "bg-ink" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                    alerts[key] ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </Card>
      </div>

      {/* Ways to stay under */}
      <div className="px-5">
        <SectionTitle title="Ways to stay under budget" />
        <Card className="divide-y divide-hairline">
          {tips.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
              <div className="min-w-0">
                <div className="truncate text-[14px] font-medium">{t.title}</div>
                <div className="text-[12px] text-mute">{t.kwh}</div>
              </div>
              <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-[12px] font-bold">
                {t.savings}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* Inclusive note */}
      <div className="px-5">
        <Card className="mt-4 border-dashed p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-mute" />
            <p className="text-[12px] leading-relaxed text-mute">
              Inclusive by design: budget alerts help low-income households avoid
              bill shock, large-text simple mode and Cantonese voice input keep the
              app usable for elderly residents, and no smart-home hardware is
              required — everything works from your existing smart meter.
            </p>
          </div>
        </Card>
        <Footnote>Budget is illustrative and editable — changes save locally on this device</Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
