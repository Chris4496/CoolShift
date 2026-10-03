"use client";

import React, { useState } from "react";
import { BatteryCharging, CalendarClock, Car, Clock, MapPin, Target, Zap } from "lucide-react";
import { Card, Footnote, GhostButton, PrimaryButton, Row } from "@/components/ui";
import { Shell, BackHeader, BottomNav } from "@/components/nav";
import { EvCar3D } from "@/components/ev-car-3d";
import { useApp } from "@/lib/store";
import { chargingSavingPerSession } from "@/lib/engine";

export default function ChargingPage() {
  const { confirmCharge, chargeScheduled, toast } = useApp();
  const [target, setTarget] = useState(80);
  const now = 42;
  const s = chargingSavingPerSession();

  return (
    <Shell>
      <BackHeader title="Smart EV charging" subtitle="Your electric car — ready for tomorrow." />

      {/* Your car */}
      <div className="px-5">
        <Card className="p-4">
          <EvCar3D chargePct={42} targetPct={target} />
          <div className="mt-1 flex items-center justify-center gap-2 text-[12.5px] font-medium text-mute">
            <Car size={14} />
            <span>EV Sedan · 58 kWh battery · plugged in at home</span>
          </div>
        </Card>
      </div>

      {/* Battery stats */}
      <div className="grid grid-cols-2 gap-2.5 px-5">
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-mute">
            <BatteryCharging size={14} /> Battery now
          </div>
          <div className="mt-1.5 text-[32px] font-bold leading-none">{now}%</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-mute">
            <Target size={14} /> Target
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
            {Math.round(((target - now) / 100) * 58)} kWh needed · at 7 kW that’s about{" "}
            {Math.round((((target - now) / 100) * 58) / 7 * 10) / 10} hours — fits
            comfortably in the 11 PM – 7 AM off-peak window.
          </p>
        </Card>
      </div>

      {/* Plan */}
      <div className="px-5">
        <h2 className="mb-2.5 mt-5 px-1 text-[15px] font-semibold">Your charging plan</h2>
        <Card className="divide-y divide-hairline">
          <Row
            icon={<Clock size={16} />}
            title="Start"
            subtitle="Off-peak rate HK$1.06/kWh begins"
            right={<span className="text-[14px] font-bold">11:00 PM</span>}
          />
          <Row
            icon={<CalendarClock size={16} />}
            title="Ready by"
            subtitle="Full morning buffer"
            right={<span className="text-[14px] font-bold">7:00 AM</span>}
          />
        </Card>

        <Card dark className="mt-3 p-4">
          <div className="flex items-start gap-3">
            <Zap size={18} className="mt-0.5 shrink-0" />
            <div>
              <div className="text-[14px] font-semibold">
                Shift charging beyond the evening peak.
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/65">
                Same {s.kwhNeeded} kWh, but HK${Math.round(s.lo)}–{Math.round(s.hi)}{" "}
                cheaper than plugging in at 7 PM — about HK$140 a month at your
                usual rhythm. One more off-peak charge completes your mission (+80 pts).
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-4 space-y-2.5">
          <PrimaryButton onClick={confirmCharge} disabled={chargeScheduled}>
            {chargeScheduled ? "Scheduled for 11:00 PM ✓" : "Confirm schedule"}
          </PrimaryButton>
          <GhostButton
            onClick={() => toast("3 chargers within 800 m — see Rewards › Charging ⚡")}
          >
            <MapPin size={15} /> Find a charger nearby
          </GhostButton>
        </div>

        <Footnote>
          Cost depends on your charging provider · e-bike battery swaps also count
          toward off-peak missions
        </Footnote>
      </div>

      <BottomNav />
    </Shell>
  );
}
