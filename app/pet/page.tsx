"use client";

import React from "react";
import { Candy, Check, Hand, Heart, Lock, Sparkles } from "lucide-react";
import { Card, Footnote, ProgressBar, SectionTitle } from "@/components/ui";
import { Shell, TopBar, BottomNav } from "@/components/nav";
import { BurstLayer, PetFigure, useBursts } from "@/components/pet";
import { useApp, useT } from "@/lib/store";
import {
  XP_PER_FEED,
  levelFromXp,
  moodFor,
  nextStage,
  petStages,
  stageForLevel,
} from "@/lib/pet";

export default function PetPage() {
  const { petSnacks, petXp, petFeeds, lastFedAt, feedPet, patPet, lang } = useApp();
  const t = useT();
  const { level, into, needed } = levelFromXp(petXp);
  const stage = stageForLevel(level);
  const upcoming = nextStage(level);
  const mood = moodFor(lastFedAt);
  const pat = useBursts();
  const feed = useBursts();

  const stageName = lang === "zh" ? stage.nameZh : stage.name;
  const moodLine = lang === "zh" ? mood.lineZh : mood.line;

  return (
    <Shell>
      <TopBar />

      {/* Title */}
      <div className="px-5">
        <h1 className="mt-1 text-[26px] font-bold tracking-tight">
          {t("Snowie", "雪寶")} · Lv {level}
        </h1>
        <p className="text-[14px] text-mute">
          {stage.accessory} {stageName} — {lang === "zh" ? stage.taglineZh : stage.tagline}
        </p>
      </div>

      {/* Mood bubble + pet */}
      <div className="mt-4 flex flex-col px-5">
        <div className="relative z-10 mx-auto w-[72%]">
          <div className="bubble-in relative rounded-[22px] border border-hairline bg-white p-3.5 shadow-soft">
            <span className="absolute -bottom-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-b border-r border-hairline bg-white" />
            <div className="flex items-start gap-2 text-[13.5px] font-medium leading-snug">
              <span className="text-[16px]">{mood.emoji}</span>
              <span>{moodLine}</span>
            </div>
          </div>
        </div>

        <div className="relative -mt-2 self-center">
          <button
            type="button"
            onClick={() => {
              patPet();
              pat.spawn();
            }}
            aria-label={t("Pat Snowie", "摸一摸雪寶")}
            className="relative transition active:scale-95"
          >
            <BurstLayer bursts={pat.bursts} />
            <PetFigure height={300} priority />
          </button>
          <div className="mascot-shadow mx-auto -mt-5 h-4 w-36 rounded-full bg-ink/15 blur-[4px]" />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 px-5">
        <Card className="flex flex-col items-center gap-1 p-3">
          <Candy size={17} className="text-clp-blue" />
          <span className="text-[19px] font-bold leading-none">{petSnacks}</span>
          <span className="text-[11px] text-mute">{t("Frosties", "涼涼果")}</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 p-3">
          <Sparkles size={17} className="text-clp-blue" />
          <span className="text-[19px] font-bold leading-none">{petXp}</span>
          <span className="text-[11px] text-mute">{t("Total XP", "總經驗")}</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 p-3">
          <Heart size={17} className="text-clp-blue" />
          <span className="text-[19px] font-bold leading-none">{petFeeds}</span>
          <span className="text-[11px] text-mute">{t("Meals", "進食次數")}</span>
        </Card>
      </div>

      {/* Level progress */}
      <div className="px-5">
        <Card className="mt-3 p-4">
          <div className="flex items-center justify-between text-[12.5px] font-medium text-mute">
            <span>
              {t(`Lv ${level}`, `Lv ${level}`)}
            </span>
            <span>
              {upcoming
                ? t(
                    `${needed - into} XP to Lv ${level + 1}`,
                    `再儲 ${needed - into} 經驗升 Lv ${level + 1}`
                  )
                : t("Max level — legendary!", "已達最高等級 — 傳說級！")}
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar value={into} max={needed} />
          </div>
          {upcoming && (
            <div className="mt-2 text-[12px] text-mute">
              {t(
                `Lv ${upcoming.minLevel}: evolves into ${upcoming.name} ${upcoming.accessory}`,
                `Lv ${upcoming.minLevel} 進化成${upcoming.nameZh} ${upcoming.accessory}`
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 px-5">
        <div className="relative">
          <BurstLayer bursts={feed.bursts} />
          <button
            type="button"
            onClick={() => {
              feedPet();
              feed.spawn("🍬");
            }}
            disabled={petSnacks < 1}
            className={`tap-target flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-semibold transition active:scale-[0.98] ${
              petSnacks >= 1
                ? "bg-clp-blue text-white"
                : "bg-neutral-300 text-neutral-500"
            }`}
          >
            <Candy size={17} />
            {t(`Feed (+${XP_PER_FEED} XP)`, `餵食（+${XP_PER_FEED} 經驗）`)}
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            patPet();
            pat.spawn();
          }}
          className="tap-target flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-white py-3.5 text-[15px] font-semibold text-ink transition active:scale-[0.98]"
        >
          <Hand size={17} />
          {t("Pat pat", "摸頭頭")}
        </button>
      </div>

      {/* How the token loop works */}
      <div className="px-5">
        <Card dark className="mt-4 p-4">
          <div className="flex items-start gap-3">
            <Candy size={18} className="mt-0.5 shrink-0 text-white/80" />
            <div>
              <div className="text-[14px] font-semibold">
                {t("1 point earned = 1 Frosty minted", "每賺 1 積分 = 鑄造 1 粒涼涼果")}
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">
                {t(
                  "Complete missions, apply tonight’s plan and shift energy — every point you earn also feeds your companion. The greener your home, the stronger Snowie grows.",
                  "完成任務、套用今晚計劃、轉移用電 — 你賺到的每 1 分同時養大你的小伙伴。屋企越環保，雪寶就越強大。"
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Evolution path */}
      <div className="px-5">
        <SectionTitle title={t("Evolution path", "進化之路")} />
        <Card className="divide-y divide-hairline">
          {petStages.map((s) => {
            const unlocked = level >= s.minLevel;
            return (
              <div key={s.minLevel} className="flex items-center gap-3 p-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[18px] ${
                    unlocked ? "bg-clp-sky" : "bg-paper"
                  }`}
                >
                  {unlocked ? s.accessory || "🐣" : <Lock size={15} className="text-mute" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-semibold">
                    {lang === "zh" ? s.nameZh : s.name}
                  </div>
                  <div className="truncate text-[12px] text-mute">
                    {lang === "zh" ? s.taglineZh : s.tagline}
                  </div>
                </div>
                <span className="shrink-0 text-[11.5px] font-semibold text-mute">
                  {unlocked ? (
                    <span className="flex items-center gap-1 text-clp-blue">
                      <Check size={13} /> Lv {s.minLevel}
                    </span>
                  ) : (
                    `Lv ${s.minLevel}`
                  )}
                </span>
              </div>
            );
          })}
        </Card>
        <Footnote>
          {t(
            "Snowie is your energy-saving companion — concept demo",
            "雪寶是你的節能小伙伴 — 概念示範"
          )}
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
