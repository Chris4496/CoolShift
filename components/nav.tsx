"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Gift, Home, MessageCircle, Type, Zap } from "lucide-react";
import { useApp } from "@/lib/store";
import { navStrings, topBarStrings } from "@/lib/i18n";

const tabs = [
  { href: "/", key: "home" as const, icon: Home },
  { href: "/insights", key: "insights" as const, icon: BarChart3 },
  { href: "/ask", key: "ask" as const, icon: MessageCircle },
  { href: "/rewards", key: "rewards" as const, icon: Gift },
];

export function BottomNav() {
  const pathname = usePathname();
  const { lang } = useApp();
  const labels = navStrings[lang];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center">
      <div className="w-full max-w-phone border-t border-hairline bg-white/90 px-6 pb-5 pt-2 backdrop-blur-md">
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
                className={`tap-target flex w-16 flex-col items-center gap-0.5 py-1.5 ${
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
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-xl bg-clp-blue text-white ${
          big ? "h-10 w-10" : "h-8 w-8"
        }`}
      >
        <Zap size={big ? 20 : 16} className="fill-white" />
      </div>
      <div className="leading-none">
        <div className={`font-bold tracking-tight ${big ? "text-[22px]" : "text-[17px]"}`}>
          Cool Shift
        </div>
        <div className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-clp-blue">
          Powered by CLP
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
          onClick={toggleLang}
          title={tb.langTitle}
          aria-label={tb.langTitle}
          className="tap-target flex h-8 min-w-8 items-center justify-center rounded-full border border-hairline bg-white px-2 text-[12px] font-bold text-ink transition active:scale-95"
        >
          {tb.langButton}
        </button>
        <button
          type="button"
          onClick={toggleSimpleMode}
          title={tb.simpleTitle}
          className={`tap-target flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
            simpleMode
              ? "border-ink bg-ink text-white"
              : "border-hairline bg-white text-ink"
          }`}
        >
          <Type size={13} />
          Aa
        </button>
        {showAvatar && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-white">
            AC
          </div>
        )}
      </div>
    </header>
  );
}

export function BackHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-5 pb-1 pt-6">
      <Link href="/" className="mb-2 inline-flex items-center gap-1 text-[13px] font-medium text-mute">
        ‹ Back
      </Link>
      <h1 className="text-[24px] font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-0.5 text-[13.5px] text-mute">{subtitle}</p>}
    </header>
  );
}

// Phone-style page shell: centered column with bottom-nav clearance
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-phone bg-paper pb-32">
      {children}
    </div>
  );
}
