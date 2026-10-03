"use client";

import Link from "next/link";
import {
  AirVent,
  Flame,
  Lightbulb,
  PlugZap,
  ChevronRight,
  Droplets,
} from "lucide-react";
import { Card, Footnote, SectionTitle } from "@/components/ui";
import { Shell, BottomNav } from "@/components/nav";
import { HourlyChart, PaceBar } from "@/components/charts";
import { useApp } from "@/lib/store";
import {
  comparison,
  hourlyUsageYesterday,
  usageBreakdown,
  yesterdayKwh,
} from "@/lib/data";
import { budgetStatus, comparisonStat, peakShareYesterday } from "@/lib/engine";

const breakdownIcons = [AirVent, PlugZap, Flame, Lightbulb];

export default function InsightsPage() {
  const { budget } = useApp();
  const b = budgetStatus(budget);
  const comp = comparisonStat();
  const peakShare = peakShareYesterday();

  return (
    <Shell>
      <header className="px-5 pb-1 pt-6">
        <Link href="/" className="mb-1 inline-block text-[13px] font-medium text-mute">
          ‹ Your energy
        </Link>
        <h1 className="text-[26px] font-bold tracking-tight">See where it goes.</h1>
      </header>

      {/* Yesterday total */}
      <div className="px-5">
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[44px] font-bold leading-none tracking-tight">
            {yesterdayKwh}
          </span>
          <span className="text-[16px] font-medium text-mute">kWh</span>
        </div>
        <p className="mt-1 text-[13.5px] text-mute">Yesterday’s electricity use</p>
      </div>

      {/* Hourly chart */}
      <div className="mt-5 px-5">
        <Card className="p-4">
          <HourlyChart data={hourlyUsageYesterday} />
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-paper px-4 py-3">
            <div className="text-[13.5px] font-medium">
              Most energy used: 6 – 11 PM{" "}
              <span className="text-mute">({peakShare}% of the day)</span>
            </div>
            <ChevronRight size={16} className="text-mute" />
          </div>
          <p className="mt-2.5 px-1 text-[11.5px] text-mute">
            Dark bars sit inside the evening-peak tariff (HK$1.87/kWh, 4–9 PM) —
            the most expensive hours of your day.
          </p>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="px-5">
        <SectionTitle title="What used it" />
        <div className="grid grid-cols-2 gap-2.5">
          {usageBreakdown.map((row, i) => {
            const Icon = breakdownIcons[i];
            return (
              <Card key={row.label} className="p-4">
                <Icon size={20} strokeWidth={1.8} className="text-mute" />
                <div className="mt-3 text-[13px] font-medium text-mute">{row.label}</div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-[26px] font-bold leading-none">{row.pct}%</span>
                </div>
                <div className="mt-0.5 text-[11.5px] text-mute">
                  ≈ {row.kwh} kWh · estimated
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bill explainer */}
      <div className="px-5">
        <SectionTitle title="Your bill, explained" />
        <Link href="/ask">
          <Card dark className="p-5">
            <div className="flex items-start gap-3">
              <Lightbulb size={22} className="mt-0.5 shrink-0" />
              <div>
                <div className="text-[16px] font-semibold">Why did my bill rise?</div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                  June is HK$124 higher — HK$86 of it is cooling on very-hot days.
                  Ask Cool Shift for the full breakdown.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-[13px] font-semibold">
                  Ask Cool Shift <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Budget pace */}
      <div className="px-5">
        <SectionTitle title="July budget pace" action="Adjust" href="/budget" />
        <Card className="p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-[15px] font-semibold">
              HK${b.spentHkd} <span className="font-normal text-mute">of HK${b.budget}</span>
            </span>
            <span className={`text-[12.5px] font-medium ${b.over ? "text-ink" : "text-mute"}`}>
              {b.over ? `~HK$${b.delta} over pace` : "On track"}
            </span>
          </div>
          <PaceBar spentPct={b.pacePct} expectedPct={b.expectedPct} />
        </Card>
      </div>

      {/* Comparison */}
      <div className="px-5">
        <SectionTitle title="You vs similar homes" />
        <Card className="p-4">
          <div className="flex items-center justify-between text-[13.5px]">
            <span className="font-medium">You</span>
            <span className="font-bold">{comparison.youKwhPerDay} kWh/day</span>
          </div>
          <div className="mt-1.5 h-2 w-full rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-ink"
              style={{
                width: `${(comparison.youKwhPerDay / comparison.similarHomesKwhPerDay) * 100}%`,
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[13.5px] text-mute">
            <span>{comparison.similarLabel}</span>
            <span>{comparison.similarHomesKwhPerDay} kWh/day</span>
          </div>
          <div className="mt-1.5 h-2 w-full rounded-full bg-neutral-200" />
          <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium">
            <Droplets size={13} /> You use {comp.pct}% less than similar homes. Keep it up.
          </p>
        </Card>
        <Footnote>Estimates from smart-meter intervals · illustrative comparison group</Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
