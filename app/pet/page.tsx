"use client";

import React from "react";
import Image from "next/image";
import { Candy, Hand, Heart, Sparkles } from "lucide-react";
import { Card, Footnote, ProgressBar, SectionTitle } from "@/components/ui";
import { Shell, TopBar, BottomNav } from "@/components/nav";
import { BurstLayer, PetFigure, useBursts } from "@/components/pet";
import { useApp, useT } from "@/lib/store";
import {
  XP_PER_FEED,
  isOutfitUnlocked,
  levelFromXp,
  moodFor,
  nextStage,
  petOutfits,
  stageForLevel,
} from "@/lib/pet";

export default function PetPage() {
  const {
    petSnacks,
    petXp,
    petFeeds,
    lastFedAt,
    feedPet,
    patPet,
    lang,
    ownedOutfits,
    currentOutfit,
    buyOutfit,
    equipOutfit,
  } = useApp();
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
          {t("Watt-son", "節能仔")} · Lv {level}
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
            aria-label={t("Pat Watt-son", "摸一摸節能仔")}
            className="relative transition active:scale-95"
          >
            <BurstLayer bursts={pat.bursts} />
            <PetFigure height={300} priority />
          </button>
          <div className="mascot-shadow mx-auto -mt-10 h-14 w-40 rounded-full bg-[radial-gradient(ellipse,rgba(17,17,16,0.3)_0%,rgba(17,17,16,0.12)_50%,transparent_72%)]" />
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
              {upcoming.outfitId
                ? t(
                    `Lv ${upcoming.minLevel}: evolves & unlocks the “${upcoming.name}” outfit`,
                    `Lv ${upcoming.minLevel} 進化並解鎖「${upcoming.nameZh}」套裝`
                  )
                : t(
                    `Lv ${upcoming.minLevel}: evolves into ${upcoming.name} ${upcoming.accessory}`,
                    `Lv ${upcoming.minLevel} 進化成${upcoming.nameZh} ${upcoming.accessory}`
                  )}
            </div>
          )}
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 px-5 min-[320px]:grid-cols-2 min-[320px]:max-[359px]:gap-2">
        <div className="relative min-w-0">
          <BurstLayer bursts={feed.bursts} />
          <button
            type="button"
            onClick={() => {
              feedPet();
              feed.spawn("🍬");
            }}
            disabled={petSnacks < 1}
            className={`tap-target flex w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border py-3.5 text-[15px] font-semibold transition active:scale-[0.98] min-[320px]:max-[359px]:gap-1.5 min-[320px]:max-[359px]:text-[13px] ${
              petSnacks >= 1
                ? "border-transparent bg-clp-blue text-white"
                : "border-transparent bg-neutral-300 text-neutral-500"
            }`}
          >
            <Candy size={17} className="shrink-0" />
            {t(`Feed (+${XP_PER_FEED} XP)`, `餵食（+${XP_PER_FEED} 經驗）`)}
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            patPet();
            pat.spawn();
          }}
          className="tap-target flex w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-ink/15 bg-white py-3.5 text-[15px] font-semibold text-ink transition active:scale-[0.98] min-[320px]:max-[359px]:gap-1.5 min-[320px]:max-[359px]:text-[13px]"
        >
          <Hand size={17} className="shrink-0" />
          {t("Pat pat", "摸頭頭")}
        </button>
      </div>

      {/* Wardrobe */}
      <div className="px-5">
        <SectionTitle title={t("Wardrobe", "衣櫃")} />
        <div className="grid grid-cols-4 gap-2">
          {petOutfits.map((o) => {
            const unlocked = isOutfitUnlocked(o, level, ownedOutfits);
            const wearing = currentOutfit === o.id;
            const affordable =
              o.unlock.type === "shop" && petSnacks >= o.unlock.cost;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  if (unlocked) equipOutfit(o.id);
                  else if (o.unlock.type === "shop") buyOutfit(o.id);
                }}
                className={`tap-target flex flex-col items-center rounded-2xl border p-2 transition active:scale-95 ${
                  wearing
                    ? "border-clp-blue bg-clp-sky"
                    : "border-hairline bg-white"
                } ${!unlocked && o.unlock.type === "stage" ? "opacity-60" : ""}`}
              >
                <div className="flex h-16 items-end justify-center">
                  <Image
                    src={o.src ?? "/mascot-sm.png"}
                    alt={lang === "zh" ? o.nameZh : o.name}
                    width={Math.round(64 * o.ratio)}
                    height={64}
                    className="select-none"
                    draggable={false}
                  />
                </div>
                <div className="mt-1.5 w-full truncate text-center text-[10.5px] font-semibold leading-tight">
                  {lang === "zh" ? o.nameZh : o.name}
                </div>
                <div
                  className={`mt-0.5 text-[10px] font-bold ${
                    wearing ? "text-clp-blue" : "text-mute"
                  }`}
                >
                  {wearing
                    ? t("Wearing ✓", "著緊 ✓")
                    : unlocked
                      ? t("Wear", "換上")
                      : o.unlock.type === "shop"
                        ? affordable
                          ? `${o.unlock.cost} 🍬`
                          : `${o.unlock.cost} 🍬 🔒`
                        : o.unlock.type === "stage"
                          ? `Lv ${o.unlock.minLevel} 🔒`
                          : ""}
                </div>
              </button>
            );
          })}
        </div>
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
                  "Complete missions, apply tonight’s plan and shift energy — every point you earn also feeds your companion. The greener your home, the stronger Watt-son grows.",
                  "完成任務、套用今晚計劃、轉移用電 — 你賺到的每 1 分同時養大你的小伙伴。屋企越環保，節能仔就越強大。"
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="px-5">
        <Footnote>
          {t(
            "Watt-son is your energy-saving companion — concept demo",
            "節能仔是你的節能小伙伴 — 概念示範"
          )}
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
