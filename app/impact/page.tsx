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
import { useApp } from "@/lib/store";
import { building } from "@/lib/data";

export default function ImpactPage() {
  const { joinedChallenge, joinChallenge } = useApp();
  const goalPct = Math.round((building.kwhShiftedThisMonth / building.goalKwh) * 100);

  return (
    <Shell>
      <BackHeader title="Your impact" subtitle="Small actions. Everyday value." />

      {/* Personal impact hero */}
      <div className="px-5">
        <Card dark className="p-5">
          <div className="flex items-center gap-2 text-[13px] font-medium text-white/75">
            <Heart size={14} /> You’re part of something bigger
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[42px] font-bold leading-none">18.2</span>
            <span className="text-[15px] font-medium text-white/60">kWh shifted this month</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-white/65">
            Every kWh you move out of the evening peak is one the grid doesn’t have to
            generate on the hottest, dirtiest hours of the day. That’s you, quietly
            helping Hong Kong breathe easier. 💚
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/10 p-3 text-center">
              <Wind size={16} className="mx-auto" />
              <div className="mt-1 text-[15px] font-bold">14 kg</div>
              <div className="text-[10px] text-white/55">CO₂ avoided</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-center">
              <TreePine size={16} className="mx-auto" />
              <div className="mt-1 text-[15px] font-bold">0.6</div>
              <div className="text-[10px] text-white/55">trees’ worth</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-center">
              <Medal size={16} className="mx-auto" />
              <div className="mt-1 text-[15px] font-bold">Top 15%</div>
              <div className="text-[10px] text-white/55">of your block</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Building community */}
      <div className="px-5">
        <SectionTitle title="Your building, together" />
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 size={20} />
              <div>
                <div className="text-[15px] font-semibold">{building.name}</div>
                <div className="text-[12px] text-mute">
                  <Users size={11} className="mr-1 inline" />
                  {building.householdsJoined} of {building.householdsTotal} households joined
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[15px] font-bold">
                <Trophy size={14} /> #{building.rank}
              </div>
              <div className="text-[11px] text-mute">of {building.blocksCompeting} blocks</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
              <span className="font-semibold">
                {building.kwhShiftedThisMonth} kWh shifted
              </span>
              <span className="text-mute">goal {building.goalKwh} kWh · {goalPct}%</span>
            </div>
            <ProgressBar value={building.kwhShiftedThisMonth} max={building.goalKwh} />
          </div>

          <div className="mt-4 rounded-2xl bg-paper p-3.5 text-[12.5px] leading-relaxed">
            <span className="font-semibold">Group reward:</span> {building.groupReward}
          </div>

          <div className="mt-3">
            <PrimaryButton onClick={joinChallenge} disabled={joinedChallenge}>
              {joinedChallenge ? "You’re in ✓" : "Join the Block 7 challenge"}
            </PrimaryButton>
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="px-5">
        <SectionTitle title="Block leaderboard — this month" />
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
                {row.flat}
              </span>
              <span className="text-[13.5px] font-semibold">{row.kwh} kWh</span>
            </div>
          ))}
        </Card>
        <p className="mt-2 px-1 text-[11.5px] text-mute">
          Neighbours are anonymised by default — only you can see it’s you.
        </p>
      </div>

      {/* Green investing cross-link */}
      <div className="px-5">
        <SectionTitle title="Put your points to work" />
        <Card className="flex items-center gap-3.5 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper">
            <Sprout size={19} />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold">Invest points in clean energy</div>
            <div className="text-[12px] text-mute">
              Grow mission rewards in solar, wind and grid portfolios
            </div>
          </div>
          <a href="/rewards" className="tap-target rounded-full bg-ink px-4 py-2 text-[12.5px] font-semibold text-white">
            Open
          </a>
        </Card>
      </div>

      {/* Social harmony note */}
      <div className="px-5">
        <Card className="mt-4 border-dashed p-4">
          <div className="flex items-start gap-3">
            <Leaf size={16} className="mt-0.5 shrink-0 text-mute" />
            <p className="text-[12px] leading-relaxed text-mute">
              Electricity for social harmony: when a whole block shifts together, the
              estate avoids peak strain, neighbours share the reward, and the city
              needs less new infrastructure. Community challenges are opt-in and
              always anonymised.
            </p>
          </div>
        </Card>
        <Footnote>Illustrative community data · City One Shatin</Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
