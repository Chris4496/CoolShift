"use client";

import React, { useState } from "react";
import {
  Award,
  Coffee,
  Gift,
  Leaf,
  MapPin,
  Sparkles,
  Sprout,
  Ticket,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import { Card, Chip, Footnote, ProgressBar, SectionTitle } from "@/components/ui";
import { Shell, BottomNav, Logo } from "@/components/nav";
import { FauxMap } from "@/components/charts";
import { useApp, useT } from "@/lib/store";
import { localize } from "@/lib/i18n";
import {
  categoryLabelsZh,
  greenFunds,
  missions,
  partnerOffers,
  POINTS_TO_HKD,
  type OfferCategory,
} from "@/lib/data";

const categories: (OfferCategory | "All")[] = [
  "All",
  "Food & Coffee",
  "Charging",
  "Home Services",
  "Experiences",
];

const catIcon = (c: string) =>
  c === "Food & Coffee" ? <Coffee size={13} /> :
  c === "Charging" ? <Zap size={13} /> :
  c === "Home Services" ? <Wrench size={13} /> :
  c === "Experiences" ? <Ticket size={13} /> :
  <Sparkles size={13} />;

export default function RewardsPage() {
  const {
    points,
    missionProgress,
    completedMissions,
    checkInMission,
    redeemOffer,
    vouchers,
    invest,
    portfolio,
    lang,
  } = useApp();
  const t = useT();
  const [cat, setCat] = useState<(OfferCategory | "All")>("All");
  const [view, setView] = useState<"map" | "list">("map");
  const [investAmt, setInvestAmt] = useState(50);
  const [fundId, setFundId] = useState(greenFunds[0].id);

  const offers = partnerOffers.filter((o) => cat === "All" || o.category === cat);
  const weekMission = localize(missions[0], lang);
  const investedTotal = portfolio.reduce((a, p) => a + p.points, 0);
  const investedHkd = (investedTotal * POINTS_TO_HKD * 1.02).toFixed(1);

  return (
    <Shell>
      {/* Header */}
      <header className="flex items-start justify-between px-5 pt-6">
        <div>
          <Logo />
          <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight">
            {t("Partner Rewards", "合作商戶獎賞")}
          </h1>
        </div>
        <div className="flex flex-col items-center gap-1 text-mute">
          <Gift size={22} />
          <span className="text-[11px] font-medium">
            {vouchers.length > 0
              ? t(`My vouchers (${vouchers.length})`, `我的禮券（${vouchers.length}）`)
              : t("My vouchers", "我的禮券")}
          </span>
        </div>
      </header>

      {/* Points hero */}
      <div className="px-5">
        <Card dark className="mt-3 flex items-center justify-between p-5">
          <div>
            <div className="text-[40px] font-bold leading-none">{points}</div>
            <div className="mt-1 text-[13px] text-white/60">{t("points available", "可用積分")}</div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Sparkles size={30} className="fill-white/20" />
          </div>
        </Card>
      </div>

      {/* Weekly mission */}
      <div className="px-5">
        <SectionTitle title={t("This week’s mission", "本週任務")} />
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold">{weekMission.title}</div>
              <div className="text-[12.5px] text-mute">{weekMission.desc}</div>
            </div>
            <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-[12px] font-bold">
              {t(`+${weekMission.points} pts`, `+${weekMission.points} 分`)}
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={missionProgress[weekMission.id] ?? 0}
              max={weekMission.goal}
            />
            <div className="mt-1.5 flex items-center justify-between text-[12px] text-mute">
              <span>
                {t(
                  `${missionProgress[weekMission.id] ?? 0} of ${weekMission.goal} completed`,
                  `已完成 ${missionProgress[weekMission.id] ?? 0}/${weekMission.goal}`
                )}
              </span>
              {!completedMissions.includes(weekMission.id) ? (
                <button
                  type="button"
                  onClick={() => checkInMission(weekMission.id)}
                  className="tap-target rounded-full bg-clp-blue px-3 py-1 font-semibold text-white"
                >
                  {weekMission.action}
                </button>
              ) : (
                <span className="font-semibold text-ink">{t("Completed ✓", "已完成 ✓")}</span>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* All missions */}
      <div className="px-5">
        <SectionTitle title={t("More ways to earn", "更多賺分方法")} />
        <Card className="divide-y divide-hairline">
          {missions.slice(1).map((mission) => {
            const m = localize(mission, lang);
            const prog = missionProgress[m.id] ?? 0;
            const done = completedMissions.includes(m.id);
            return (
              <div key={m.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[14.5px] font-semibold">{m.title}</div>
                  <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11.5px] font-bold">
                    {t(`+${m.points} pts`, `+${m.points} 分`)}
                  </span>
                </div>
                <div className="mt-0.5 text-[12.5px] text-mute">{m.desc}</div>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={prog} max={m.goal} />
                  </div>
                  <span className="text-[11.5px] font-medium text-mute">
                    {prog}/{m.goal}
                  </span>
                  {!done ? (
                    <button
                      type="button"
                      onClick={() => checkInMission(m.id)}
                      className="tap-target rounded-full border border-ink/15 px-3 py-1 text-[12px] font-semibold"
                    >
                      {t("Check in", "打卡")}
                    </button>
                  ) : (
                    <span className="text-[12px] font-semibold">{t("Done ✓", "完成 ✓")}</span>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Green investing */}
      <div className="px-5">
        <SectionTitle title={t("Grow your points — clean energy", "積分增值 — 清潔能源")} />
        <Card dark className="p-5">
          <div className="flex items-center gap-2 text-[13px] font-medium text-white/80">
            <Sprout size={15} />{" "}
            {t(
              "Invest mission points into clean-energy portfolios",
              "將任務積分投資到清潔能源投資組合"
            )}
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[30px] font-bold leading-none">
              {t(`${investedTotal} pts`, `${investedTotal} 分`)}
            </span>
            <span className="text-[12.5px] text-white/60">
              {t(
                `invested · ≈ HK$${investedHkd} illustrative value`,
                `已投資 · 示意價值約 HK$${investedHkd}`
              )}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {greenFunds.map((fund) => {
              const f = localize(fund, lang);
              const held = portfolio.find((p) => p.fundId === f.id)?.points ?? 0;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFundId(f.id)}
                  className={`tap-target flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    fundId === f.id
                      ? "border-white bg-white/10"
                      : "border-white/15"
                  }`}
                >
                  <div>
                    <div className="text-[13.5px] font-semibold">{f.name}</div>
                    <div className="text-[11.5px] text-white/55">{f.focus}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[13px] font-bold">
                      <TrendingUp size={13} /> {f.ytdPct}%
                    </div>
                    <div className="text-[11px] text-white/55">
                      {held > 0 ? t(`${held} pts held`, `持有 ${held} 分`) : f.tone}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="range"
              min={10}
              max={200}
              step={10}
              value={investAmt}
              onChange={(e) => setInvestAmt(Number(e.target.value))}
              className="w-full accent-white"
            />
            <span className="w-16 text-right text-[13px] font-bold">
              {t(`${investAmt} pts`, `${investAmt} 分`)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => invest(fundId, investAmt)}
            className="tap-target mt-3 w-full rounded-full bg-white py-3 text-[14px] font-bold text-ink active:scale-[0.99]"
          >
            {t(`Invest ${investAmt} points`, `投資 ${investAmt} 積分`)}
          </button>
          <p className="mt-2 text-center text-[10.5px] text-white/45">
            {t(
              "Illustrative only · points stay loyalty points, not securities · 10 pts ≈ HK$1",
              "僅作示意 · 積分仍屬會員積分，並非證券 · 10 分 ≈ HK$1"
            )}
          </p>
        </Card>
      </div>

      {/* Offers near you */}
      <div className="px-5">
        <SectionTitle title={t("Rewards near you", "附近獎賞")} />
        <div className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-mute">
          <MapPin size={14} /> {t("Sha Tin · Within 2 km", "沙田 · 2 公里內")}
        </div>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-3">
          {categories.map((c) => (
            <Chip
              key={c}
              label={c === "All" ? t("All", "全部") : t(c, categoryLabelsZh[c])}
              icon={catIcon(c)}
              active={cat === c}
              onClick={() => setCat(c)}
            />
          ))}
        </div>

        {/* Map / List toggle */}
        <div className="mb-3 flex w-fit gap-1 rounded-full border border-hairline bg-white p-1">
          {(["map", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`tap-target rounded-full px-4 py-1.5 text-[12.5px] font-semibold capitalize transition ${
                view === v ? "bg-ink text-white" : "text-ink"
              }`}
            >
              {v === "map" ? t("Map", "地圖") : t("List", "列表")}
            </button>
          ))}
        </div>

        {view === "map" && (
          <FauxMap
            pins={offers.map((o) => ({
              id: o.id,
              x: o.pin.x,
              y: o.pin.y,
              label: t(`${o.points} pts`, `${o.points} 分`),
              icon: catIcon(o.category),
            }))}
          />
        )}

        <div className={`space-y-2.5 ${view === "map" ? "mt-3" : ""}`}>
          {offers.map((offer) => {
            const o = localize(offer, lang);
            const owned = vouchers.includes(o.id);
            const affordable = points >= o.points;
            return (
              <Card key={o.id} className="flex items-center gap-3.5 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-paper">
                  {catIcon(o.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-semibold">{o.partner}</div>
                  <div className="truncate text-[12.5px] text-mute">
                    {o.title}
                    {o.distanceM > 0 && t(` · ${o.distanceM} m away`, ` · 距離 ${o.distanceM} 米`)}
                  </div>
                  <div className="mt-0.5 text-[12px] font-bold">
                    {t(`${o.points} points`, `${o.points} 積分`)}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={owned || !affordable}
                  onClick={() => redeemOffer(o.id)}
                  className={`tap-target shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold transition ${
                    owned
                      ? "bg-neutral-200 text-mute"
                      : affordable
                        ? "bg-ink text-white active:scale-[0.97]"
                        : "bg-neutral-200 text-mute"
                  }`}
                >
                  {owned
                    ? t("Saved ✓", "已兌換 ✓")
                    : affordable
                      ? t("Redeem", "兌換")
                      : t("Locked", "積分不足")}
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Why this matters for CLP */}
      <div className="px-5">
        <Card className="mt-4 border-dashed p-4">
          <div className="flex items-start gap-3">
            <Award size={18} className="mt-0.5 shrink-0 text-mute" />
            <p className="text-[12px] leading-relaxed text-mute">
              {t(
                "Partner offers are funded by partners and redeemed on results — CLP earns commission, partners reach you at the moment of need, and no offer ever encourages more energy use.",
                "合作商戶優惠由商戶出資，按成效兌換 — 中電賺取佣金，商戶在你最需要時接觸你，而且所有優惠都不會鼓勵多用電。"
              )}
            </p>
          </div>
        </Card>
        <Footnote>
          {t("Illustrative map and offers · Sha Tin, Hong Kong", "地圖及優惠僅作示意 · 香港沙田")}
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
