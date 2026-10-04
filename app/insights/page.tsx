"use client";

import Image from "next/image";
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
import { useApp, useT } from "@/lib/store";
import {
  comparison,
  hourlyUsageYesterday,
  usageBreakdown,
  yesterdayKwh,
} from "@/lib/data";
import { budgetStatus, comparisonStat, peakShareYesterday } from "@/lib/engine";

const breakdownArt = [
  "/art/cooling.webp",
  "/art/appliances.webp",
  "/art/water.webp",
  "/art/lighting.webp",
];

export default function InsightsPage() {
  const { budget } = useApp();
  const t = useT();
  const b = budgetStatus(budget);
  const comp = comparisonStat();
  const peakShare = peakShareYesterday();

  return (
    <Shell>
      <header className="px-5 pb-1 pt-6">
        <Link href="/" className="mb-2 inline-block text-[13px] font-medium text-mute">
          {t("‹ Your energy", "‹ 你的用電")}
        </Link>
        <h1 className="text-[26px] font-bold tracking-tight">
          {t("See where it goes.", "睇清電用咗喺邊。")}
        </h1>
      </header>

      {/* Yesterday total */}
      <div className="px-5">
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[44px] font-bold leading-none tracking-tight">
            {yesterdayKwh}
          </span>
          <span className="text-[16px] font-medium text-mute">{t("kWh", "度")}</span>
        </div>
        <p className="mt-1 text-[13.5px] text-mute">{t("Yesterday’s electricity use", "昨日用電量")}</p>
      </div>

      {/* Hourly chart */}
      <div className="mt-4 px-5">
        <Card className="p-4">
          <HourlyChart data={hourlyUsageYesterday} />
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-paper px-4 py-3">
            <div className="text-[13.5px] font-medium">
              {t("Most energy used: 6 – 11 PM", "用電最多：晚上 6 至 11 時")}{" "}
              <span className="text-mute">
                {t(`(${peakShare}% of the day)`, `（佔全日 ${peakShare}%）`)}
              </span>
            </div>
            <ChevronRight size={16} className="text-mute" />
          </div>
          <p className="mt-2.5 px-1 text-[11.5px] text-mute">
            {t(
              "Dark bars sit inside the evening-peak tariff (HK$1.87/kWh, 4–9 PM) — the most expensive hours of your day.",
              "深色柱代表黃昏繁忙時段電價（每度 HK$1.87，下午 4 時至晚上 9 時）— 全日最貴的時間。"
            )}
          </p>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="px-5">
        <SectionTitle title={t("What used it", "邊樣用得最多")} />
        <div className="grid grid-cols-2 gap-2.5">
          {usageBreakdown.map((row, i) => {
            return (
              <Card key={row.label} className="p-4">
                <Image
                  src={breakdownArt[i]}
                  alt=""
                  width={180}
                  height={180}
                  className="h-14 w-14 select-none object-contain mix-blend-multiply"
                  draggable={false}
                />
                <div className="mt-2 text-[13px] font-medium text-mute">{t(row.label, row.labelZh)}</div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-[26px] font-bold leading-none">{row.pct}%</span>
                </div>
                <div className="mt-0.5 text-[11.5px] text-mute">
                  {t(`≈ ${row.kwh} kWh · estimated`, `≈ ${row.kwh} 度 · 估算`)}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bill explainer */}
      <div className="px-5">
        <SectionTitle title={t("Your bill, explained", "電費逐項解釋")} />
        <Link href="/ask">
          <Card dark className="p-5">
            <div className="flex items-start gap-3">
              <Lightbulb size={22} className="mt-0.5 shrink-0" />
              <div>
                <div className="text-[16px] font-semibold">
                  {t("Why did my bill rise?", "點解電費會貴咗？")}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/70">
                  {t(
                    "June is HK$124 higher — HK$86 of it is cooling on very-hot days. Ask Cool Shift for the full breakdown.",
                    "六月電費多了 HK$124 — 其中 HK$86 來自酷熱日子開冷氣。問 Cool Shift 了解詳細分析。"
                  )}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-[13px] font-semibold">
                  {t("Ask Cool Shift", "問 Cool Shift")} <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Budget pace */}
      <div className="px-5">
        <SectionTitle
          title={t(`${b.month} budget pace`, `${b.monthZh}預算進度`)}
          action={t("Adjust", "調整")}
          href="/budget"
        />
        <Card className="p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-[15px] font-semibold">
              HK${b.spentHkd}{" "}
              <span className="font-normal text-mute">{t(`of HK$${b.budget}`, `／預算 HK$${b.budget}`)}</span>
            </span>
            <span className={`text-[12.5px] font-medium ${b.over ? "text-ink" : "text-mute"}`}>
              {b.over
                ? t(`~HK$${b.delta} over pace`, `超出進度約 HK$${b.delta}`)
                : t("On track", "進度理想")}
            </span>
          </div>
          <PaceBar spentPct={b.pacePct} expectedPct={b.expectedPct} />
        </Card>
      </div>

      {/* Comparison */}
      <div className="px-5">
        <SectionTitle title={t("You vs similar homes", "你與同類家庭比較")} />
        <Card className="p-4">
          <div className="flex items-center justify-between text-[13.5px]">
            <span className="font-medium">{t("You", "你")}</span>
            <span className="font-bold">
              {t(`${comparison.youKwhPerDay} kWh/day`, `${comparison.youKwhPerDay} 度/日`)}
            </span>
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
            <span>{t(comparison.similarLabel, comparison.similarLabelZh)}</span>
            <span>
              {t(
                `${comparison.similarHomesKwhPerDay} kWh/day`,
                `${comparison.similarHomesKwhPerDay} 度/日`
              )}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full rounded-full bg-neutral-200" />
          <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium">
            <Droplets size={13} />{" "}
            {t(
              `You use ${comp.pct}% less than similar homes. Keep it up.`,
              `你比同類家庭少用 ${comp.pct}% 電，繼續保持！`
            )}
          </p>
        </Card>
        <Footnote>
          {t(
            "Estimates from smart-meter intervals · illustrative comparison group",
            "根據智能電錶分段數據估算 · 比較組別僅作說明用途"
          )}
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
