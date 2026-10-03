"use client";

import React, { useState } from "react";
import { ChevronDown, Clock, Droplets, Leaf, Thermometer, Home as HomeIcon } from "lucide-react";
import { Card, Footnote, GhostButton, PrimaryButton, Row } from "@/components/ui";
import { Shell, BackHeader, BottomNav } from "@/components/nav";
import { TempDial } from "@/components/charts";
import { useApp } from "@/lib/store";
import { weather } from "@/lib/data";
import { tonightPlan } from "@/lib/engine";

export default function CoolingPage() {
  const { applyPlan, planApplied } = useApp();
  const [showWhy, setShowWhy] = useState(false);
  const plan = tonightPlan();

  return (
    <Shell>
      <BackHeader title="Smart cooling" subtitle="Living room · comfort first" />

      {/* Dial */}
      <div className="px-5">
        <Card className="p-5">
          <TempDial value="25.5°C" label="Suggested temperature" />
          <div className="mt-2 flex items-center justify-center gap-5 text-[12.5px] font-medium text-mute">
            <span className="flex items-center gap-1.5">
              <Droplets size={14} /> Humidity {weather.humidity}%
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf size={14} /> Comfort first
            </span>
          </div>
        </Card>
      </div>

      {/* Tonight's plan */}
      <div className="px-5">
        <h2 className="mb-2.5 mt-6 px-1 text-[15px] font-semibold">Tonight’s plan</h2>
        <Card className="divide-y divide-hairline">
          <Row
            icon={<Clock size={16} />}
            title="Start cooling"
            subtitle="After the peak, before you settle in"
            right={<span className="text-[14px] font-bold">7:30 PM</span>}
          />
          <Row
            icon={<Thermometer size={16} />}
            title="Comfort preference"
            subtitle="Balanced with a fan"
            right={<span className="text-[14px] font-bold">Keep it cool</span>}
          />
          <Row
            icon={<HomeIcon size={16} />}
            title="You get home ~6 PM"
            subtitle="We pre-cool only when needed"
            right={<span className="text-[14px] font-bold">25.5°</span>}
          />
        </Card>

        <div className="mt-3 rounded-card border border-hairline bg-white p-4">
          <div className="flex items-start gap-2.5">
            <Leaf size={15} className="mt-0.5 shrink-0 text-mute" />
            <p className="text-[12.5px] leading-relaxed text-mute">
              A gentle adjustment can reduce cooling energy. Starting at 7:30 PM and
              holding 25.5°C instead of 24°C saves ≈0.85 kWh tonight — HK$26–34 a
              month — while a fan keeps it feeling like 23°C.
            </p>
          </div>
        </div>

        {/* Why this suggestion */}
        <button
          type="button"
          onClick={() => setShowWhy((s) => !s)}
          className="tap-target mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-[13px] font-semibold underline underline-offset-4"
        >
          Why this suggestion?
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
            {planApplied ? "Plan applied ✓" : "Use this plan"}
          </PrimaryButton>
          <GhostButton onClick={() => setShowWhy(true)}>Adjust my plan</GhostButton>
          <p className="pt-1 text-center text-[12px] text-mute">You stay in control.</p>
        </div>

        <Footnote>
          Safety rule: during a Very Hot Weather Warning, or for elderly and
          health-sensitive users, Cool Shift never suggests reducing cooling.
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
