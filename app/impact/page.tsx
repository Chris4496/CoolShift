"use client";

import React from "react";
import {
  Building2,
  Heart,
  Leaf,
  Medal,
  Sprout,
  TreePine,
  Trophy,
  Users,
  Wind,
} from "lucide-react";
import { Card, Footnote, PrimaryButton, ProgressBar, SectionTitle } from "@/components/ui";
import { Shell, BackHeader, BottomNav } from "@/components/nav";
import { useApp, useT } from "@/lib/store";
import { building } from "@/lib/data";

export default function ImpactPage() {
  const { joinedChallenge, joinChallenge } = useApp();
  const t = useT();
  const goalPct = Math.round((building.kwhShiftedThisMonth / building.goalKwh) * 100);

  return (
    <Shell>
      <BackHeader
        title={t("Your impact", "你的成果")}
        subtitle={t("Small actions. Everyday value.", "小行動，日日都有價值。")}
      />

      {/* Personal impact hero */}
      <div className="px-5">
        <Card dark className="p-5">
          <div className="flex items-center gap-2 text-[13px] font-medium text-white/75">
            <Heart size={14} /> {t("You’re part of something bigger", "你正參與一件更大的事")}
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[42px] font-bold leading-none">18.2</span>
            <span className="text-[15px] font-medium text-white/60">
              {t("kWh shifted this month", "度電本月已轉移")}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-white/65">
            {t(
              "Every kWh you move out of the evening peak is one the grid doesn’t have to generate on the hottest, dirtiest hours of the day. That’s you, quietly helping Hong Kong breathe easier. 💚",
              "你每移離黃昏繁忙時段一度電，電網就少一度要喺全日最熱、最污染的時段發電。你正默默幫香港透一口清新空氣。💚"
            )}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/10 p-3 text-center">
              <Wind size={16} className="mx-auto" />
              <div className="mt-1 text-[15px] font-bold">{t("14 kg", "14 公斤")}</div>
              <div className="text-[10px] text-white/55">{t("CO₂ avoided", "減少碳排放")}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-center">
              <TreePine size={16} className="mx-auto" />
              <div className="mt-1 text-[15px] font-bold">0.6</div>
              <div className="text-[10px] text-white/55">{t("trees’ worth", "棵樹的減碳量")}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-center">
              <Medal size={16} className="mx-auto" />
              <div className="mt-1 text-[15px] font-bold">{t("Top 15%", "頭 15%")}</div>
              <div className="text-[10px] text-white/55">{t("of your block", "全座排名")}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Building community */}
      <div className="px-5">
        <SectionTitle title={t("Your building, together", "全座大廈，一齊出力")} />
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 size={20} />
              <div>
                <div className="text-[15px] font-semibold">{t(building.name, building.nameZh)}</div>
                <div className="text-[12px] text-mute">
                  <Users size={11} className="mr-1 inline" />
                  {t(
                    `${building.householdsJoined} of ${building.householdsTotal} households joined`,
                    `${building.householdsTotal} 戶中有 ${building.householdsJoined} 戶參加`
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[15px] font-bold">
                <Trophy size={14} /> {t(`#${building.rank}`, `第 ${building.rank} 名`)}
              </div>
              <div className="text-[11px] text-mute">
                {t(`of ${building.blocksCompeting} blocks`, `共 ${building.blocksCompeting} 座`)}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
              <span className="font-semibold">
                {t(
                  `${building.kwhShiftedThisMonth} kWh shifted`,
                  `已轉移 ${building.kwhShiftedThisMonth} 度電`
                )}
              </span>
              <span className="text-mute">
                {t(
                  `goal ${building.goalKwh} kWh · ${goalPct}%`,
                  `目標 ${building.goalKwh} 度 · ${goalPct}%`
                )}
              </span>
            </div>
            <ProgressBar value={building.kwhShiftedThisMonth} max={building.goalKwh} />
          </div>

          <div className="mt-4 rounded-2xl bg-paper p-3.5 text-[12.5px] leading-relaxed">
            <span className="font-semibold">{t("Group reward:", "集體獎賞：")}</span>{" "}
            {t(building.groupReward, building.groupRewardZh)}
          </div>

          <div className="mt-3">
            <PrimaryButton onClick={joinChallenge} disabled={joinedChallenge}>
              {joinedChallenge
                ? t("You’re in ✓", "已參加 ✓")
                : t("Join the Block 7 challenge", "參加第 7 座挑戰")}
            </PrimaryButton>
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="px-5">
        <SectionTitle title={t("Block leaderboard — this month", "全座排行榜 — 本月")} />
        <Card className="divide-y divide-hairline">
          {building.leaderboard.map((row, i) => (
            <div
              key={row.flat}
              className={`flex items-center gap-3 px-4 py-3 ${
                row.you ? "bg-paper" : ""
              }`}
            >
              <span className="w-6 text-center text-[13px] font-bold text-mute">
                {i + 1}
              </span>
              <span className={`flex-1 text-[14px] ${row.you ? "font-bold" : "font-medium"}`}>
                {t(row.flat, row.flatZh)}
              </span>
              <span className="text-[13.5px] font-semibold">{t(`${row.kwh} kWh`, `${row.kwh} 度`)}</span>
            </div>
          ))}
        </Card>
        <p className="mt-2 px-1 text-[11.5px] text-mute">
          {t(
            "Neighbours are anonymised by default — only you can see it’s you.",
            "鄰居資料預設匿名 — 只有你自己知道邊個係你。"
          )}
        </p>
      </div>

      {/* Green investing cross-link */}
      <div className="px-5">
        <SectionTitle title={t("Put your points to work", "讓積分發揮作用")} />
        <Card className="flex items-center gap-3.5 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper">
            <Sprout size={19} />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold">
              {t("Invest points in clean energy", "用積分投資潔淨能源")}
            </div>
            <div className="text-[12px] text-mute">
              {t(
                "Grow mission rewards in solar, wind and grid portfolios",
                "將任務獎賞投資於太陽能、風電及電網組合，讓積分增值"
              )}
            </div>
          </div>
          <a href="/rewards" className="tap-target rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold text-white">
            {t("Open", "開啟")}
          </a>
        </Card>
      </div>

      {/* Social harmony note */}
      <div className="px-5">
        <Card className="mt-4 border-dashed p-4">
          <div className="flex items-start gap-3">
            <Leaf size={16} className="mt-0.5 shrink-0 text-mute" />
            <p className="text-[12px] leading-relaxed text-mute">
              {t(
                "Electricity for social harmony: when a whole block shifts together, the estate avoids peak strain, neighbours share the reward, and the city needs less new infrastructure. Community challenges are opt-in and always anonymised.",
                "用電促進社區和諧：當全座一齊轉移用電，屋苑可避免繁忙時段負荷過重，鄰居共享獎賞，城市亦毋須興建咁多新基建。社區挑戰自願參加，並一律匿名。"
              )}
            </p>
          </div>
        </Card>
        <Footnote>
          {t("Illustrative community data · City One Shatin", "社區數據僅作說明用途 · 沙田第一城")}
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
