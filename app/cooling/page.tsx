"use client";

import React, { useState } from "react";
import { ChevronDown, Clock, Droplets, Leaf, Thermometer, Home as HomeIcon } from "lucide-react";
import { Card, Footnote, GhostButton, PrimaryButton, Row } from "@/components/ui";
import { Shell, BackHeader, BottomNav } from "@/components/nav";
import { TempDial } from "@/components/charts";
import { useApp, useT } from "@/lib/store";
import { weather } from "@/lib/data";
import { tonightPlan } from "@/lib/engine";

export default function CoolingPage() {
  const { applyPlan, planApplied, lang } = useApp();
  const t = useT();
  const [showWhy, setShowWhy] = useState(false);
  const plan = tonightPlan(lang);

  return (
    <Shell>
      <BackHeader
        title={t("Smart cooling", "智能冷氣")}
        subtitle={t("Living room · comfort first", "客廳 · 舒適優先")}
      />

      {/* Dial */}
      <div className="px-5">
        <Card className="p-5">
          <TempDial value="25.5°C" label={t("Suggested temperature", "建議溫度")} />
          <div className="mt-2 flex items-center justify-center gap-5 text-[12.5px] font-medium text-mute">
            <span className="flex items-center gap-1.5">
              <Droplets size={14} /> {t(`Humidity ${weather.humidity}%`, `濕度 ${weather.humidity}%`)}
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf size={14} /> {t("Comfort first", "舒適優先")}
            </span>
          </div>
        </Card>
      </div>

      {/* Tonight's plan */}
      <div className="px-5">
        <h2 className="mb-2.5 mt-6 px-1 text-[15px] font-semibold">{t("Tonight’s plan", "今晚計劃")}</h2>
        <Card className="divide-y divide-hairline">
          <Row
            icon={<Clock size={16} />}
            title={t("Start cooling", "開始開冷氣")}
            subtitle={t("After the peak, before you settle in", "繁忙時段過後、你坐低休息之前")}
            right={<span className="text-[14px] font-bold">{t("7:30 PM", "晚上 7:30")}</span>}
          />
          <Row
            icon={<Thermometer size={16} />}
            title={t("Comfort preference", "舒適偏好")}
            subtitle={t("Balanced with a fan", "配合風扇，平衡舒適")}
            right={<span className="text-[14px] font-bold">{t("Keep it cool", "保持涼快")}</span>}
          />
          <Row
            icon={<HomeIcon size={16} />}
            title={t("You get home ~6 PM", "你大約晚上 6 時回家")}
            subtitle={t("We pre-cool only when needed", "只在有需要時先預冷")}
            right={<span className="text-[14px] font-bold">25.5°</span>}
          />
        </Card>

        <div className="mt-3 rounded-card border border-hairline bg-white p-4">
          <div className="flex items-start gap-2.5">
            <Leaf size={15} className="mt-0.5 shrink-0 text-mute" />
            <p className="text-[12.5px] leading-relaxed text-mute">
              {t(
                "A gentle adjustment can reduce cooling energy. Starting at 7:30 PM and holding 25.5°C instead of 24°C saves ≈0.85 kWh tonight — HK$26–34 a month — while a fan keeps it feeling like 23°C.",
                "輕輕調整就可以減少冷氣用電。晚上 7:30 先開，並設定 25.5°C 而唔係 24°C，今晚可慳約 0.85 度電 — 每月 HK$26–34 — 配合風扇，體感仍然似 23°C。"
              )}
            </p>
          </div>
        </div>

        {/* Why this suggestion */}
        <button
          type="button"
          onClick={() => setShowWhy((s) => !s)}
          className="tap-target mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-[13px] font-semibold underline underline-offset-4"
        >
          {t("Why this suggestion?", "點解咁建議？")}
          <ChevronDown size={14} className={`transition ${showWhy ? "rotate-180" : ""}`} />
        </button>
        {showWhy && (
          <Card className="p-4">
            <ul className="list-disc space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-mute">
              {plan.calc.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Card>
        )}

        <div className="mt-4 space-y-2.5">
          <PrimaryButton onClick={applyPlan} disabled={planApplied}>
            {planApplied ? t("Plan applied ✓", "已套用計劃 ✓") : t("Use this plan", "使用此計劃")}
          </PrimaryButton>
          <GhostButton onClick={() => setShowWhy(true)}>{t("Adjust my plan", "調整我的計劃")}</GhostButton>
          <p className="pt-1 text-center text-[12px] text-mute">{t("You stay in control.", "一切由你話事。")}</p>
        </div>

        <Footnote>
          {t(
            "Safety rule: during a Very Hot Weather Warning, or for elderly and health-sensitive users, Cool Shift never suggests reducing cooling.",
            "安全守則：酷熱天氣警告生效期間，或對長者及健康較易受影響的用戶，Cool Shift 絕不會建議減少開冷氣。"
          )}
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
