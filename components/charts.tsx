"use client";

import React from "react";
import { tariffAt } from "@/lib/data";
import { useT } from "@/lib/store";

// ── Hourly usage chart — peak-band bars highlighted dark ─────────────────────
export function HourlyChart({ data }: { data: number[] }) {
  const t = useT();
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex h-28 items-end gap-[3px]">
        {data.map((v, h) => {
          const peak = tariffAt(h).label === "Evening peak" || (h >= 21 && h <= 22);
          return (
            <div
              key={h}
              title={t(`${h}:00 — ${v.toFixed(1)} kWh`, `${h}:00 — ${v.toFixed(1)} 度`)}
              className={`flex-1 rounded-full ${peak ? "bg-clp-orange" : "bg-clp-sky"}`}
              style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] font-medium text-mute">
        <span>{t("6 AM", "上午 6 時")}</span>
        <span>{t("12 PM", "中午 12 時")}</span>
        <span>{t("6 PM", "下午 6 時")}</span>
        <span>{t("12 AM", "午夜 12 時")}</span>
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
  const t = useT();
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
        <span>{t(`Spent ${spentPct}%`, `已用 ${spentPct}%`)}</span>
        <span>{t(`Expected pace ${expectedPct}%`, `應有進度 ${expectedPct}%`)}</span>
      </div>
    </div>
  );
}

// ── Illustrative Sha Tin map (stylised SVG, pins positioned by % coords) ─────
export function FauxMap({
  pins,
}: {
  pins: { id: string; x: number; y: number; label?: string; icon?: React.ReactNode }[];
}) {
  const t = useT();
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-card border border-hairline bg-[#eef0ec]">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* park */}
        <ellipse cx="250" cy="70" rx="80" ry="45" fill="#dde8dc" />
        <text x="238" y="72" fontSize="9" fill="#9db49b">{t("Sha Tin Park", "沙田公園")}</text>
        {/* river */}
        <path d="M 20 300 C 80 220, 60 150, 130 60 C 150 35, 180 10, 210 0" fill="none" stroke="#c8d9e6" strokeWidth="16" />
        <text x="42" y="215" fontSize="8" fill="#a8bfd0" transform="rotate(-64 60 190)">{t("Shing Mun River", "城門河")}</text>
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
        <text x="168" y="152" fontSize="8.5" fill="#8f938c">{t("Sha Tin", "沙田")}</text>
        <text x="278" y="262" fontSize="8" fill="#8f938c">{t("Sha Tin Station", "沙田站")}</text>
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
