"use client";

import React from "react";
import { tariffAt } from "@/lib/data";

// ── Hourly usage chart — peak-band bars highlighted dark ─────────────────────
export function HourlyChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex h-28 items-end gap-[3px]">
        {data.map((v, h) => {
          const peak = tariffAt(h).label === "Evening peak" || (h >= 21 && h <= 22);
          return (
            <div
              key={h}
              title={`${h}:00 — ${v.toFixed(1)} kWh`}
              className={`flex-1 rounded-full ${peak ? "bg-clp-orange" : "bg-clp-sky"}`}
              style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] font-medium text-mute">
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>12 AM</span>
      </div>
    </div>
  );
}

// ── Semi-circular dial for the cooling setpoint ──────────────────────────────
export function TempDial({ value, label }: { value: string; label: string }) {
  // Arc from 135° to 405° (270° sweep), filled ~70%
  const r = 80;
  const cx = 100;
  const cy = 100;
  const polar = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arc = (from: number, to: number) => {
    const s = polar(from);
    const e = polar(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const knob = polar(135 + 270 * 0.72);
  return (
    <div className="relative mx-auto w-full max-w-[240px]">
      <svg viewBox="0 0 200 130" className="w-full">
        <path d={arc(135, 405)} fill="none" stroke="#ececea" strokeWidth="10" strokeLinecap="round" />
        <path d={arc(135, 135 + 270 * 0.72)} fill="none" stroke="#0057a8" strokeWidth="10" strokeLinecap="round" />
        <circle cx={knob.x} cy={knob.y} r="9" fill="#0057a8" stroke="#fff" strokeWidth="3" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <div className="text-[40px] font-bold leading-none tracking-tight">{value}</div>
        <div className="mt-1 text-[12px] text-mute">{label}</div>
      </div>
    </div>
  );
}

// ── Budget pace bar: spend vs expected pace ──────────────────────────────────
export function PaceBar({
  spentPct,
  expectedPct,
}: {
  spentPct: number;
  expectedPct: number;
}) {
  return (
    <div className="relative pt-1">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            spentPct > expectedPct + 6 ? "bg-clp-orange" : "bg-clp-blue"
          }`}
          style={{ width: `${Math.min(100, spentPct)}%` }}
        />
      </div>
      {/* expected-pace marker */}
      <div
        className="absolute -top-0.5 h-5 w-[2px] bg-mute"
        style={{ left: `${Math.min(100, expectedPct)}%` }}
      />
      <div className="mt-1.5 flex justify-between text-[11px] text-mute">
        <span>Spent {spentPct}%</span>
        <span>Expected pace {expectedPct}%</span>
      </div>
    </div>
  );
}

// ── EV infographic: sedan side view, charge port + cable to wallbox ─────────
export function EvGraphic({ chargePct, targetPct }: { chargePct: number; targetPct: number }) {
  return (
    <svg viewBox="0 0 340 160" className="w-full" role="img" aria-label="Electric car charging">
      {/* wallbox charger */}
      <rect x="296" y="34" width="30" height="52" rx="7" fill="#00294d" />
      <circle cx="311" cy="47" r="4.5" fill="#f26522" />
      <rect x="304" y="58" width="14" height="4" rx="2" fill="#ffffff" opacity="0.5" />
      {/* charging cable */}
      <path
        d="M 296 74 C 268 96, 252 78, 228 92"
        fill="none"
        stroke="#00294d"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* car body */}
      <path
        d="M 28 108 C 34 84, 62 66, 104 62 L 150 58 C 192 58, 214 74, 224 88 L 244 94 C 256 98, 260 106, 256 114 L 252 120 L 34 120 Z"
        fill="#0057a8"
      />
      {/* windows */}
      <path
        d="M 96 68 C 118 64, 142 62, 158 62 L 186 64 C 200 68, 210 76, 216 86 L 112 86 C 102 86, 94 78, 96 68 Z"
        fill="#e8f2fa"
      />
      {/* charge port */}
      <circle cx="226" cy="92" r="6" fill="#f26522" stroke="#fff" strokeWidth="2" />
      {/* wheels */}
      <circle cx="86" cy="120" r="17" fill="#00294d" />
      <circle cx="86" cy="120" r="7" fill="#f6f6f4" />
      <circle cx="212" cy="120" r="17" fill="#00294d" />
      <circle cx="212" cy="120" r="7" fill="#f6f6f4" />
      {/* ground */}
      <rect x="14" y="136" width="318" height="3" rx="1.5" fill="#e9e9e6" />
      {/* battery bar */}
      <rect x="60" y="146" width="200" height="8" rx="4" fill="#e8f2fa" />
      <rect
        x="60"
        y="146"
        width={(200 * chargePct) / 100}
        height="8"
        rx="4"
        fill="#0057a8"
      />
      {/* target marker */}
      <rect x={58 + (200 * targetPct) / 100} y="143" width="3" height="14" rx="1.5" fill="#f26522" />
      <text x="66" y="143" fontSize="8.5" fill="#6f6f6a">{chargePct}%</text>
      <text x={52 + (200 * targetPct) / 100} y="134" fontSize="8.5" fill="#f26522" fontWeight="700">
        {targetPct}%
      </text>
      {/* energy bolt on body */}
      <path d="M 150 92 l 8 0 -5 8 7 0 -13 12 3 -9 -6 0 z" fill="#f26522" />
    </svg>
  );
}

// ── Illustrative Sha Tin map (stylised SVG, pins positioned by % coords) ─────
export function FauxMap({
  pins,
}: {
  pins: { id: string; x: number; y: number; label?: string; icon?: React.ReactNode }[];
}) {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-card border border-hairline bg-[#eef0ec]">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* park */}
        <ellipse cx="250" cy="70" rx="80" ry="45" fill="#dde8dc" />
        <text x="238" y="72" fontSize="9" fill="#9db49b">Sha Tin Park</text>
        {/* river */}
        <path d="M 20 300 C 80 220, 60 150, 130 60 C 150 35, 180 10, 210 0" fill="none" stroke="#c8d9e6" strokeWidth="16" />
        <text x="42" y="215" fontSize="8" fill="#a8bfd0" transform="rotate(-64 60 190)">Shing Mun River</text>
        {/* street grid */}
        <g stroke="#e2e4df" strokeWidth="6">
          <path d="M 0 120 L 400 100" />
          <path d="M 0 190 L 400 170" />
          <path d="M 0 250 L 400 240" />
          <path d="M 120 0 L 140 300" />
          <path d="M 230 0 L 240 300" />
          <path d="M 330 0 L 320 300" />
        </g>
        {/* blocks */}
        <g fill="#e9ebe6">
          <rect x="150" y="130" width="60" height="40" rx="4" />
          <rect x="160" y="200" width="50" height="35" rx="4" />
          <rect x="255" y="125" width="55" height="35" rx="4" />
          <rect x="30" y="250" width="70" height="35" rx="4" />
          <rect x="260" y="200" width="50" height="30" rx="4" />
        </g>
        <text x="168" y="152" fontSize="8.5" fill="#8f938c">Sha Tin</text>
        <text x="278" y="262" fontSize="8" fill="#8f938c">Sha Tin Station</text>
      </svg>
      {/* you-are-here dot */}
      <div className="absolute" style={{ left: "58%", top: "52%" }}>
        <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#3b82f6] shadow" />
        <div className="absolute -inset-3 animate-ping rounded-full bg-[#3b82f6]/20" />
      </div>
      {/* pins */}
      {pins.map((p) => (
        <div
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {p.label && (
            <div className="mb-0.5 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-center text-[9.5px] font-semibold text-white">
              {p.label}
            </div>
          )}
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full rounded-br-none bg-ink text-white shadow-md" style={{ transform: "rotate(-45deg)" }}>
            <span style={{ transform: "rotate(45deg)" }}>{p.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
