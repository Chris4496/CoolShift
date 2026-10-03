"use client";

import React, { useCallback, useRef, useState } from "react";
import { Mascot } from "@/components/mascot";
import { useApp } from "@/lib/store";
import { levelFromXp, stageForLevel } from "@/lib/pet";

// ── The mascot dressed up as the user's pet ──────────────────────────────────
// Level badge + evolution accessory (emoji) + aura for high stages.
export function PetFigure({
  height = 310,
  float = true,
  priority = false,
  showBadge = true,
}: {
  height?: number;
  float?: boolean;
  priority?: boolean;
  showBadge?: boolean;
}) {
  const { petXp } = useApp();
  const { level } = levelFromXp(petXp);
  const stage = stageForLevel(level);
  const accessorySize = Math.max(26, Math.round(height * 0.11));

  return (
    <div className="relative inline-block">
      {stage.aura && (
        <div
          aria-hidden
          className="pet-aura absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: height * 0.95,
            height: height * 0.95,
            background:
              "radial-gradient(circle, rgba(0,87,168,0.22) 0%, rgba(0,87,168,0.10) 45%, transparent 70%)",
          }}
        />
      )}
      <Mascot
        height={height}
        float={float}
        priority={priority}
        className="relative z-10"
      />
      {stage.accessory && (
        <span
          aria-hidden
          className="absolute left-1/2 z-20 -translate-x-1/2 drop-shadow-sm"
          style={{ top: -height * 0.015, fontSize: accessorySize }}
        >
          {stage.accessory}
        </span>
      )}
      {showBadge && (
        <span className="absolute right-[-6px] top-[16%] z-20 rounded-full bg-ink px-2 py-0.5 text-[10.5px] font-bold tracking-wide text-white shadow-soft">
          Lv {level}
        </span>
      )}
    </div>
  );
}

// ── Floating hearts / emoji burst on interaction ─────────────────────────────
interface Burst {
  id: number;
  x: number; // % offset from center
  emoji: string;
}

export function useBursts() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const idRef = useRef(0);
  const spawn = useCallback((emoji = "🩵") => {
    const id = ++idRef.current;
    const x = Math.round((Math.random() - 0.5) * 70);
    setBursts((b) => [...b.slice(-7), { id, x, emoji }]);
    setTimeout(() => setBursts((b) => b.filter((i) => i.id !== id)), 950);
  }, []);
  return { bursts, spawn };
}

export function BurstLayer({ bursts }: { bursts: Burst[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full overflow-visible"
    >
      {bursts.map((b) => (
        <span
          key={b.id}
          className="burst-float absolute top-[12%] text-[26px]"
          style={{ left: `calc(50% + ${b.x}px)` }}
        >
          {b.emoji}
        </span>
      ))}
    </div>
  );
}
