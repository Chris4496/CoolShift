"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BatteryCharging,
  ChevronDown,
  Coffee,
  Info,
  Mic,
  Send,
  Snowflake,
} from "lucide-react";
import { Card, PrimaryButton, ProgressBar } from "@/components/ui";
import { Mascot, MascotAvatar } from "@/components/mascot";
import { Shell, BottomNav } from "@/components/nav";
import { useApp, useT } from "@/lib/store";
import { bill, missions, partnerOffers } from "@/lib/data";
import { localize } from "@/lib/i18n";
import {
  billExplanation,
  chatReply,
  tonightPlan,
  type ChatAnswer,
  type ChatContext,
} from "@/lib/engine";

interface Message {
  role: "user" | "assistant";
  text: string;
  card?: ChatAnswer["card"];
}

const chips = {
  en: [
    "Why is my bill higher?",
    "Save without losing comfort",
    "Plan tonight",
    "How are my missions?",
    "Charge my EV cheaper",
  ],
  zh: [
    "點解電費貴咗？",
    "點樣慳電又唔失舒適？",
    "幫我計劃今晚",
    "我的任務進度如何？",
    "電動車點樣充電平啲？",
  ],
};

export default function AskPage() {
  const {
    applyPlan,
    planApplied,
    points,
    budget,
    missionProgress,
    completedMissions,
    lang,
  } = useApp();
  const t = useT();

  // Live context so the agent can verify real mission / challenge progress
  const chatCtx: ChatContext = {
    points,
    budget,
    missions: missions.map((raw) => {
      const m = localize(raw, lang);
      return {
        id: m.id,
        title: m.title,
        progress: missionProgress[m.id] ?? 0,
        goal: m.goal,
        points: m.points,
        done: completedMissions.includes(m.id),
        unit: m.unit,
      };
    }),
  };
  const welcome: Message = {
    role: "assistant",
    text: t(
      "Hi Alex! I’ve looked at your meter data, tonight’s humidity and the tariff. Ask me anything about your home’s energy — every answer comes with real numbers.",
      "你好 Alex！我已經睇過你的智能電錶數據、今晚的濕度同電價。有關家居用電的問題隨便問 — 每個答案都有真實數字支持。"
    ),
  };
  const [history, setHistory] = useState<Message[]>([]);
  const messages = [welcome, ...history];
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, typing]);

  function send(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    setHistory((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    const answer = chatReply(q, chatCtx, lang);
    setTimeout(() => {
      setHistory((m) => [...m, { role: "assistant", text: answer.text, card: answer.card }]);
      setTyping(false);
    }, 800);
  }

  const explanation = billExplanation(lang);
  const plan = tonightPlan(lang);
  const offer = localize(partnerOffers[0], lang);

  return (
    <Shell>
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pb-3 pt-6">
        <Mascot height={56} float priority />
        <div>
          <h1 className="text-[19px] font-bold tracking-tight">{t("Ask Cool Shift", "問 Cool Shift")}</h1>
          <span className="mt-1 inline-block rounded-full bg-neutral-200/70 px-2.5 py-0.5 text-[11.5px] font-medium text-mute">
            {t("Your energy assistant", "你的節能助手")}
          </span>
        </div>
      </header>

      {/* Quick chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
        {chips[lang].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => send(c)}
            className="tap-target shrink-0 rounded-full border border-hairline bg-white px-4 py-2 text-[13px] font-medium active:scale-[0.98]"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex flex-col gap-3 px-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`bubble-in flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="self-start">
                <MascotAvatar />
              </div>
            )}
            <div className="max-w-[80%]">
              <div
                className={`whitespace-pre-line rounded-3xl px-4 py-3 text-[14px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-neutral-200/80 text-ink"
                    : "rounded-bl-md bg-ink text-white"
                }`}
              >
                {m.text}
              </div>

              {/* ── Rich card: bill breakdown ── */}
              {m.card === "bill" && (
                <Card className="mt-2 p-4">
                  <div className="mb-2 text-[13px] font-semibold">
                    {t(`${bill.month} bill: HK$${bill.thisMonth}`, `${bill.monthZh}電費：HK$${bill.thisMonth}`)}{" "}
                    <span className="font-normal text-mute">
                      {t(`(May: HK$${bill.lastMonth})`, `（五月：HK$${bill.lastMonth}）`)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {explanation.drivers.map((d) => (
                      <div key={d.label} className="flex items-start justify-between gap-3 text-[13px]">
                        <div>
                          <div className="font-medium">{d.label}</div>
                          <div className="text-[12px] leading-snug text-mute">{d.why}</div>
                        </div>
                        <span className="shrink-0 font-semibold">+HK${d.amount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-hairline pt-2.5 text-right text-[13px] font-bold">
                    {t(`Total +HK$${explanation.delta}`, `合共 +HK$${explanation.delta}`)}
                  </div>
                </Card>
              )}

              {/* ── Rich card: tonight's plan ── */}
              {m.card === "plan" && (
                <Card className="mt-2 p-4">
                  <div className="mb-2.5 text-[13px] font-semibold">{t("A plan that fits you", "為你度身訂造的計劃")}</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-2xl border border-hairline px-3.5 py-3">
                      <Snowflake size={17} />
                      <div className="flex-1">
                        <div className="text-[13.5px] font-medium">{t("Cooling", "冷氣")}</div>
                        <div className="text-[12px] text-mute">{t("7:30 PM · 25.5°C", "晚上 7:30 · 25.5°C")}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-hairline px-3.5 py-3">
                      <BatteryCharging size={17} />
                      <div className="flex-1">
                        <div className="text-[13.5px] font-medium">{t("EV charging", "電動車充電")}</div>
                        <div className="text-[12px] text-mute">{t("11:00 PM · 80% target", "晚上 11:00 · 目標 80%")}</div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCalc((s) => !s)}
                    className="mt-2.5 flex w-full items-center gap-2 rounded-2xl bg-paper px-3.5 py-3 text-left text-[12.5px] font-medium text-mute"
                  >
                    <Info size={14} />
                    <span className="flex-1">{t("How this plan was calculated", "計劃是怎樣計算出來的")}</span>
                    <ChevronDown size={14} className={`transition ${showCalc ? "rotate-180" : ""}`} />
                  </button>
                  {showCalc && (
                    <ul className="mt-2 list-disc space-y-1.5 rounded-2xl bg-paper px-8 py-3 text-[12px] leading-relaxed text-mute">
                      {plan.calc.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3">
                    <PrimaryButton onClick={applyPlan} disabled={planApplied}>
                      {planApplied ? t("Plan applied ✓", "已套用計劃 ✓") : t("Use this plan", "使用這個計劃")}
                    </PrimaryButton>
                  </div>
                </Card>
              )}

              {/* ── Rich card: mission progress (live from app state) ── */}
              {m.card === "missions" && (
                <Card className="mt-2 p-4">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{t("Mission check-in", "任務進度")}</span>
                    <span className="rounded-full bg-clp-sky px-2.5 py-0.5 text-[11px] font-bold text-clp-blue">
                      {t(`${points} pts`, `${points} 分`)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {missions.map((raw) => {
                      const mi = localize(raw, lang);
                      const prog = missionProgress[mi.id] ?? 0;
                      const done = completedMissions.includes(mi.id);
                      return (
                        <div key={mi.id}>
                          <div className="flex items-center justify-between text-[12.5px]">
                            <span className={done ? "font-semibold" : "font-medium"}>
                              {done ? "✅ " : ""}{mi.title}
                            </span>
                            <span className="text-mute">
                              {done ? t("complete", "已完成") : `${prog}/${mi.goal} ${mi.unit}`}
                            </span>
                          </div>
                          <div className="mt-1">
                            <ProgressBar value={prog} max={mi.goal} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* ── Rich card: offers ── */}
              {m.card === "offers" && (
                <Link href="/rewards">
                  <Card className="mt-2 flex items-center gap-3 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper">
                      <Coffee size={19} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13.5px] font-semibold">{offer.partner}</div>
                      <div className="text-[12px] text-mute">
                        {t(
                          `${offer.title} · ${offer.distanceM} m away · ${offer.points} pts`,
                          `${offer.title} · 距離 ${offer.distanceM} 米 · ${offer.points} 分`
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-start justify-start gap-2">
            <MascotAvatar />
            <div className="flex gap-1.5 rounded-3xl rounded-bl-md bg-ink px-4 py-3.5">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed inset-x-0 bottom-[76px] z-40 mx-auto w-full max-w-phone bg-paper/95 px-5 pb-2 pt-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center rounded-full border border-hairline bg-white px-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder={t("Ask about your home…", "問吓你屋企的用電…")}
              aria-label={t("Ask about your home…", "問吓你屋企的用電…")}
              className="tap-target w-full bg-transparent py-3 text-[14px] outline-none placeholder:text-mute"
            />
            <button
              type="button"
              title={t(
                "Voice input — Cantonese, English and Mandarin (pilot)",
                "語音輸入 — 支援廣東話、英文及普通話（試行）"
              )}
              aria-label={t("Voice input", "語音輸入")}
              onClick={() => send(chips[lang][0])}
              className="tap-target p-1 text-mute"
            >
              <Mic size={18} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => send(input)}
            aria-label={t("Send", "傳送")}
            className="tap-target flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white active:scale-95"
          >
            <Send size={17} />
          </button>
        </div>
      </div>

      <BottomNav />
    </Shell>
  );
}
