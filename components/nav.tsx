"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Gift, Home, MessageCircle, PawPrint, Type } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { useApp, useT } from "@/lib/store";
import { navStrings, topBarStrings } from "@/lib/i18n";
import { profile } from "@/lib/data";

const tabs = [
  { href: "/", key: "home" as const, icon: Home },
  { href: "/insights", key: "insights" as const, icon: BarChart3 },
  { href: "/pet", key: "pet" as const, icon: PawPrint },
  { href: "/ask", key: "ask" as const, icon: MessageCircle },
  { href: "/rewards", key: "rewards" as const, icon: Gift },
];

export function BottomNav() {
  const pathname = usePathname();
  const { lang } = useApp();
  const labels = navStrings[lang];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div className="w-full max-w-phone border-t border-hairline bg-white/90 px-6 py-2 backdrop-blur-md">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const active =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            const Icon = tab.icon;
            const label = labels[tab.key];
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`tap-target flex flex-1 flex-col items-center gap-0.5 py-1.5 ${
                  active ? "text-clp-blue" : "text-mute"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                <span className={`text-[10.5px] ${active ? "font-semibold" : "font-medium"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function Logo({ big = false }: { big?: boolean }) {
  const { lang } = useApp();
  const tb = topBarStrings[lang];
  return (
    <div className="flex items-center gap-2">
      <Mascot height={big ? 44 : 36} priority />
      <div className="leading-none">
        <div className={`font-bold tracking-tight ${big ? "text-[22px]" : "text-[17px]"}`}>
          Cool Shift
        </div>
        <div className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-clp-blue">
          {tb.poweredBy}
        </div>
      </div>
    </div>
  );
}

export function TopBar({
  title,
  showAvatar = true,
}: {
  title?: string;
  showAvatar?: boolean;
}) {
  const { simpleMode, toggleSimpleMode, lang, toggleLang } = useApp();
  const tb = topBarStrings[lang];
  const initials =
    profile.name
      .trim()
      .split(/\s+/)
      .map((w) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-6">
      {title ? (
        <div className="text-[17px] font-bold tracking-tight">{title}</div>
      ) : (
        <Logo />
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSimpleMode}
          title={tb.simpleTitle}
          aria-label={tb.simpleTitle}
          aria-pressed={simpleMode}
          className={`tap-target flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-95 ${
            simpleMode
              ? "border-transparent bg-ink text-white"
              : "border-hairline bg-white text-ink"
          }`}
        >
          <Type size={15} />
        </button>
        <button
          type="button"
          onClick={toggleLang}
          title={tb.langTitle}
          aria-label={tb.langTitle}
          className="tap-target flex h-8 min-w-8 items-center justify-center rounded-full border border-hairline bg-white px-2 text-[12px] font-bold text-ink transition active:scale-95"
        >
          {tb.langButton}
        </button>
        {showAvatar && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
            {initials}
          </div>
        )}
      </div>
    </header>
  );
}

export function BackHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const t = useT();
  return (
    <header className="px-5 pb-1 pt-6">
      <Link href="/" className="mb-2 inline-flex items-center gap-1 text-[13px] font-medium text-mute">
        ‹ {t("Back", "返回")}
      </Link>
      <h1 className="text-[24px] font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-0.5 text-[13.5px] text-mute">{subtitle}</p>}
    </header>
  );
}

// Phone-style page shell: centered column with bottom-nav clearance
export function Shell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto min-h-dvh w-full max-w-phone bg-paper pb-32 ${className}`}>
      {children}
    </div>
  );
}
