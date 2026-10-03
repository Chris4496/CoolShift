"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ── Cards ────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-card ${
        dark ? "bg-clp-navy text-white" : "bg-white border border-hairline shadow-soft"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────
export function SectionTitle({
  title,
  action,
  href,
}: {
  title: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="mb-2.5 mt-6 flex items-end justify-between px-1">
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      {action && href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-[13px] font-medium text-mute"
        >
          {action}
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

// ── List row with chevron ────────────────────────────────────────────────────
export function Row({
  icon,
  title,
  subtitle,
  href,
  right,
  onClick,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  const inner = (
    <div className="tap-target flex w-full items-center gap-3 px-4 py-3.5 text-left">
      {icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium leading-tight">{title}</div>
        {subtitle && (
          <div className="mt-0.5 truncate text-[13px] text-mute">{subtitle}</div>
        )}
      </div>
      {right}
      {(href || onClick) && <ChevronRight size={17} className="shrink-0 text-mute" />}
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return (
    <button type="button" onClick={onClick} className="w-full">
      {inner}
    </button>
  );
}

// ── Buttons ──────────────────────────────────────────────────────────────────
export function PrimaryButton({
  children,
  onClick,
  href,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}) {
  const cls = `tap-target flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-semibold transition ${
    disabled ? "bg-neutral-300 text-neutral-500" : "bg-clp-blue text-white active:scale-[0.99]"
  }`;
  if (href && !disabled) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "tap-target flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-white py-3.5 text-[15px] font-semibold text-ink transition active:scale-[0.99]";
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────────
export function ProgressBar({
  value,
  max,
  dark = false,
}: {
  value: number;
  max: number;
  dark?: boolean;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full ${
        dark ? "bg-white/15" : "bg-neutral-200"
      }`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          dark ? "bg-white" : "bg-clp-blue"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Chip (filter pill) ───────────────────────────────────────────────────────
export function Chip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap-target flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-medium transition ${
        active
          ? "bg-clp-blue text-white"
          : "border border-hairline bg-white text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Stat block ───────────────────────────────────────────────────────────────
export function Stat({
  value,
  unit,
  label,
  dark = false,
}: {
  value: string;
  unit?: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-[28px] font-bold leading-none tracking-tight">
          {value}
        </span>
        {unit && <span className={`text-[14px] font-medium ${dark ? "text-white/70" : "text-mute"}`}>{unit}</span>}
      </div>
      <div className={`mt-1 text-[12.5px] ${dark ? "text-white/60" : "text-mute"}`}>
        {label}
      </div>
    </div>
  );
}

// ── Footnote ─────────────────────────────────────────────────────────────────
export function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 px-2 text-center text-[11px] leading-relaxed text-mute">
      {children}
    </p>
  );
}
