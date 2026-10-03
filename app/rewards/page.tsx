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
import { useApp } from "@/lib/store";
import {
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
  } = useApp();
  const [cat, setCat] = useState<(OfferCategory | "All")>("All");
  const [view, setView] = useState<"map" | "list">("map");
  const [investAmt, setInvestAmt] = useState(50);
  const [fundId, setFundId] = useState(greenFunds[0].id);

  const offers = partnerOffers.filter((o) => cat === "All" || o.category === cat);
  const weekMission = missions[0];
  const investedTotal = portfolio.reduce((a, p) => a + p.points, 0);
  const investedHkd = (investedTotal * POINTS_TO_HKD * 1.02).toFixed(1);

  return (
    <Shell>
      {/* Header */}
      <header className="flex items-start justify-between px-5 pt-6">
        <div>
          <Logo />
          <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight">
            Partner Rewards
          </h1>
        </div>
        <div className="flex flex-col items-center gap-1 text-mute">
          <Gift size={22} />
          <span className="text-[11px] font-medium">
            {vouchers.length > 0 ? `My vouchers (${vouchers.length})` : "My vouchers"}
          </span>
        </div>
      </header>

      {/* Points hero */}
      <div className="px-5">
        <Card dark className="mt-3 flex items-center justify-between p-5">
          <div>
            <div className="text-[40px] font-bold leading-none">{points}</div>
            <div className="mt-1 text-[13px] text-white/60">points available</div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Sparkles size={30} className="fill-white/20" />
          </div>
        </Card>
      </div>

      {/* Weekly mission */}
      <div className="px-5">
        <SectionTitle title="This week’s mission" />
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[15px] font-semibold">{weekMission.title}</div>
              <div className="text-[12.5px] text-mute">{weekMission.desc}</div>
            </div>
            <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-[12px] font-bold">
              +{weekMission.points} pts
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={missionProgress[weekMission.id] ?? 0}
              max={weekMission.goal}
            />
            <div className="mt-1.5 flex items-center justify-between text-[12px] text-mute">
              <span>
                {missionProgress[weekMission.id] ?? 0} of {weekMission.goal} completed
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
                <span className="font-semibold text-ink">Completed ✓</span>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* All missions */}
      <div className="px-5">
        <SectionTitle title="More ways to earn" />
        <Card className="divide-y divide-hairline">
          {missions.slice(1).map((m) => {
            const prog = missionProgress[m.id] ?? 0;
            const done = completedMissions.includes(m.id);
            return (
              <div key={m.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[14.5px] font-semibold">{m.title}</div>
                  <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11.5px] font-bold">
                    +{m.points} pts
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
                      Check in
                    </button>
                  ) : (
                    <span className="text-[12px] font-semibold">Done ✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Green investing */}
      <div className="px-5">
        <SectionTitle title="Grow your points — clean energy" />
        <Card dark className="p-5">
          <div className="flex items-center gap-2 text-[13px] font-medium text-white/80">
            <Sprout size={15} /> Invest mission points into clean-energy portfolios
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[30px] font-bold leading-none">{investedTotal} pts</span>
            <span className="text-[12.5px] text-white/60">
              invested · ≈ HK${investedHkd} illustrative value
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {greenFunds.map((f) => {
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
                      {held > 0 ? `${held} pts held` : f.tone}
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
            <span className="w-16 text-right text-[13px] font-bold">{investAmt} pts</span>
          </div>
          <button
            type="button"
            onClick={() => invest(fundId, investAmt)}
            className="tap-target mt-3 w-full rounded-full bg-white py-3 text-[14px] font-bold text-ink active:scale-[0.99]"
          >
            Invest {investAmt} points
          </button>
          <p className="mt-2 text-center text-[10.5px] text-white/45">
            Illustrative only · points stay loyalty points, not securities · 10 pts ≈ HK$1
          </p>
        </Card>
      </div>

      {/* Offers near you */}
      <div className="px-5">
        <SectionTitle title="Rewards near you" />
        <div className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-mute">
          <MapPin size={14} /> Sha Tin · Within 2 km
        </div>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-3">
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
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
              {v}
            </button>
          ))}
        </div>

        {view === "map" && (
          <FauxMap
            pins={offers.map((o) => ({
              id: o.id,
              x: o.pin.x,
              y: o.pin.y,
              label: `${o.points} pts`,
              icon: catIcon(o.category),
            }))}
          />
        )}

        <div className={`space-y-2.5 ${view === "map" ? "mt-3" : ""}`}>
          {offers.map((o) => {
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
                    {o.distanceM > 0 && ` · ${o.distanceM} m away`}
                  </div>
                  <div className="mt-0.5 text-[12px] font-bold">{o.points} points</div>
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
                  {owned ? "Saved ✓" : affordable ? "Redeem" : "Locked"}
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
              Partner offers are funded by partners and redeemed on results — CLP earns
              commission, partners reach you at the moment of need, and no offer ever
              encourages more energy use.
            </p>
          </div>
        </Card>
        <Footnote>Illustrative map and offers · Sha Tin, Hong Kong</Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
