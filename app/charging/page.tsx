"use client";

import React, { useState } from "react";
import { BatteryCharging, CalendarClock, Car, Clock, MapPin, Target, Zap } from "lucide-react";
import { Card, Footnote, GhostButton, PrimaryButton, Row } from "@/components/ui";
import { Shell, BackHeader, BottomNav } from "@/components/nav";
import { EvCar3D } from "@/components/ev-car-3d";
import { useApp, useT } from "@/lib/store";
import { chargingSavingPerSession } from "@/lib/engine";

export default function ChargingPage() {
  const { confirmCharge, chargeScheduled, toast } = useApp();
  const t = useT();
  const [target, setTarget] = useState(80);
  const now = 42;
  const s = chargingSavingPerSession();
  const kwhNeeded = Math.round(((target - now) / 100) * 58);
  const hours = Math.round((((target - now) / 100) * 58) / 7 * 10) / 10;

  return (
    <Shell>
      <BackHeader
        title={t("Smart EV charging", "智能電動車充電")}
        subtitle={t("Your electric car — ready for tomorrow.", "你的電動車 — 明日準備就緒。")}
      />

      {/* Your car */}
      <div className="px-5">
        <Card className="p-4">
          <EvCar3D chargePct={42} targetPct={target} />
          <div className="mt-1 flex items-center justify-center gap-2 text-[12.5px] font-medium text-mute">
            <Car size={14} />
            <span>{t("EV Sedan · 58 kWh battery · plugged in at home", "電動房車 · 58 度電池 · 已在家中接駁")}</span>
          </div>
        </Card>
      </div>

      {/* Battery stats */}
      <div className="grid grid-cols-2 gap-2.5 px-5">
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-mute">
            <BatteryCharging size={14} /> {t("Battery now", "現時電量")}
          </div>
          <div className="mt-1.5 text-[32px] font-bold leading-none">{now}%</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-mute">
            <Target size={14} /> {t("Target", "目標")}
          </div>
          <div className="mt-1.5 text-[32px] font-bold leading-none">{target}%</div>
        </Card>
      </div>

      {/* Target slider */}
      <div className="px-5">
        <Card className="mt-2.5 p-4">
          <input
            type="range"
            min={50}
            max={100}
            step={5}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full accent-ink"
          />
          <div className="mt-1 flex justify-between text-[11.5px] font-medium text-mute">
            <span>{now}%</span>
            <span>{target}%</span>
          </div>
          <p className="mt-2 text-[12px] text-mute">
            {t(
              `${kwhNeeded} kWh needed · at 7 kW that’s about ${hours} hours — fits comfortably in the 11 PM – 7 AM off-peak window.`,
              `需要 ${kwhNeeded} 度電 · 以 7 千瓦充電約需 ${hours} 小時 — 輕鬆喺晚上 11 時至早上 7 時的非繁忙時段內完成。`
            )}
          </p>
        </Card>
      </div>

      {/* Plan */}
      <div className="px-5">
        <h2 className="mb-2.5 mt-5 px-1 text-[15px] font-semibold">{t("Your charging plan", "你的充電計劃")}</h2>
        <Card className="divide-y divide-hairline">
          <Row
            icon={<Clock size={16} />}
            title={t("Start", "開始")}
            subtitle={t("Off-peak rate HK$1.06/kWh begins", "非繁忙時段電價每度 HK$1.06 開始")}
            right={<span className="text-[14px] font-bold">{t("11:00 PM", "晚上 11:00")}</span>}
          />
          <Row
            icon={<CalendarClock size={16} />}
            title={t("Ready by", "充好時間")}
            subtitle={t("Full morning buffer", "早上時間充裕")}
            right={<span className="text-[14px] font-bold">{t("7:00 AM", "早上 7:00")}</span>}
          />
        </Card>

        <Card dark className="mt-3 p-4">
          <div className="flex items-start gap-3">
            <Zap size={18} className="mt-0.5 shrink-0" />
            <div>
              <div className="text-[14px] font-semibold">
                {t("Shift charging beyond the evening peak.", "將充電移到黃昏繁忙時段之後。")}
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">
                {t(
                  `Same ${s.kwhNeeded} kWh, but HK$${Math.round(s.lo)}–${Math.round(s.hi)} cheaper than plugging in at 7 PM — about HK$140 a month at your usual rhythm. One more off-peak charge completes your mission (+80 pts).`,
                  `一樣充 ${s.kwhNeeded} 度電，但比晚上 7 時充電平 HK$${Math.round(s.lo)}–${Math.round(s.hi)} — 按你平時的習慣每月約慳 HK$140。多一次非繁忙時段充電就完成任務（+80 分）。`
                )}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-4 space-y-2.5">
          <PrimaryButton onClick={confirmCharge} disabled={chargeScheduled}>
            {chargeScheduled
              ? t("Scheduled for 11:00 PM ✓", "已預約晚上 11:00 ✓")
              : t("Confirm schedule", "確認預約")}
          </PrimaryButton>
          <GhostButton
            onClick={() =>
              toast(
                t(
                  "3 chargers within 800 m — see Rewards › Charging ⚡",
                  "800 米內有 3 個充電站 — 請到「獎賞 › 充電」查看 ⚡"
                )
              )
            }
          >
            <MapPin size={15} /> {t("Find a charger nearby", "搵附近充電站")}
          </GhostButton>
        </div>

        <Footnote>
          {t(
            "Cost depends on your charging provider · e-bike battery swaps also count toward off-peak missions",
            "費用視乎你的充電服務供應商 · 電動單車換電亦計入非繁忙時段任務"
          )}
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
