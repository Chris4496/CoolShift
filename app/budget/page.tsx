"use client";

import React, { useState } from "react";
import { Bell, BellRing, ShieldCheck, Wallet } from "lucide-react";
import { Card, Footnote, SectionTitle } from "@/components/ui";
import { Shell, BackHeader, BottomNav } from "@/components/nav";
import { PaceBar } from "@/components/charts";
import { useApp, useT } from "@/lib/store";
import { budgetStatus, dailyTips } from "@/lib/engine";

export default function BudgetPage() {
  const { budget, setBudget, toast, lang } = useApp();
  const t = useT();
  const b = budgetStatus(budget);
  const tips = dailyTips(lang);
  const [alerts, setAlerts] = useState({ a50: true, a80: true, a100: true });

  const toggle = (key: keyof typeof alerts, label: string) => {
    const next = { ...alerts, [key]: !alerts[key] };
    setAlerts(next);
    toast(
      next[key]
        ? t(`Alert on: ${label}`, `已開啟提醒：${label}`)
        : t(`Alert off: ${label}`, `已關閉提醒：${label}`)
    );
  };

  return (
    <Shell>
      <BackHeader
        title={t("Budget & alerts", "預算及提醒")}
        subtitle={t("No surprises at the end of the month.", "月尾唔再有驚嚇。")}
      />

      {/* Budget setter */}
      <div className="px-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-[13px] font-medium text-mute">
            <Wallet size={14} /> {t("Monthly electricity budget", "每月電費預算")}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[40px] font-bold leading-none">HK${budget}</span>
            <span className="text-[13px] text-mute">{t("/ month", "/ 月")}</span>
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
            {t(
              "Set a limit that fits your household. Cool Shift paces your usage against it and nudges you before — not after — you overshoot.",
              "設定一個適合你家庭的上限。Cool Shift 會按預算追蹤你的用電進度，喺超支之前 — 而唔係之後 — 提醒你。"
            )}
          </p>
        </Card>
      </div>

      {/* Status */}
      <div className="px-5">
        <SectionTitle title={t(`${b.month} so far`, `${b.monthZh}至今`)} />
        <Card className="p-5">
          <div className="flex items-baseline justify-between">
            <div className="text-[15px] font-semibold">
              HK${b.spentHkd}{" "}
              <span className="font-normal text-mute">
                {t(
                  `spent · day ${b.dayOfMonth} of ${b.daysInMonth}`,
                  `已用 · 第 ${b.dayOfMonth} 日（共 ${b.daysInMonth} 日）`
                )}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <PaceBar spentPct={b.pacePct} expectedPct={b.expectedPct} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-paper p-3.5">
              <div className="text-[11.5px] font-medium text-mute">{t("Projected bill", "預計電費")}</div>
              <div className="mt-0.5 text-[22px] font-bold">HK${b.projected}</div>
              <div className={`text-[11.5px] font-medium ${b.over ? "text-ink" : "text-mute"}`}>
                {b.over
                  ? t(`~HK$${b.delta} over budget`, `超出預算約 HK$${b.delta}`)
                  : t(`HK$${b.delta} under budget`, `低於預算 HK$${b.delta}`)}
              </div>
            </div>
            <div className="rounded-2xl bg-paper p-3.5">
              <div className="text-[11.5px] font-medium text-mute">{t("Daily allowance left", "每日可用餘額")}</div>
              <div className="mt-0.5 text-[22px] font-bold">HK${b.dailyAllowance}</div>
              <div className="text-[11.5px] text-mute">{t("per day to stay on budget", "每日用量，保持在預算內")}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <div className="px-5">
        <SectionTitle title={t("Alerts", "提醒")} />
        <Card className="divide-y divide-hairline">
          {(
            [
              ["a50", t("At 50% of budget", "用到預算 50%"), t("A gentle heads-up, mid-month", "月中溫馨提示")],
              ["a80", t("At 80% of budget", "用到預算 80%"), t("Time to shift a few loads", "是時候轉移部分用電")],
              ["a100", t("At 100% of budget", "用到預算 100%"), t("Immediate notification + tips", "即時通知及慳電建議")],
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
        <SectionTitle title={t("Ways to stay under budget", "保持在預算內的方法")} />
        <Card className="divide-y divide-hairline">
          {tips.map((tip) => (
            <div key={tip.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
              <div className="min-w-0">
                <div className="truncate text-[14px] font-medium">{tip.title}</div>
                <div className="text-[12px] text-mute">{tip.kwh}</div>
              </div>
              <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-[12px] font-bold">
                {tip.savings}
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
              {t(
                "Inclusive by design: budget alerts help low-income households avoid bill shock, large-text simple mode and Cantonese voice input keep the app usable for elderly residents, and no smart-home hardware is required — everything works from your existing smart meter.",
                "共融設計：預算提醒幫助低收入家庭避免電費突然飆升；大字簡易模式及廣東話語音輸入方便長者使用；而且毋須任何智能家居設備 — 只靠你現有的智能電錶就做到。"
              )}
            </p>
          </div>
        </Card>
        <Footnote>
          {t(
            "Budget is illustrative and editable — changes save locally on this device",
            "預算僅作說明並可隨時修改 — 更改只會儲存在此裝置"
          )}
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
