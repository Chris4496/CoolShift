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
  Sparkles,
} from "lucide-react";
import { Card, PrimaryButton, ProgressBar } from "@/components/ui";
import { Shell, BottomNav } from "@/components/nav";
import { useApp } from "@/lib/store";
import { bill, missions, partnerOffers } from "@/lib/data";
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

const chips = [
  "Why is my bill higher?",
  "Save without losing comfort",
  "Plan tonight",
  "How are my missions?",
  "Charge my EV cheaper",
];

export default function AskPage() {
  const {
    applyPlan,
    planApplied,
    points,
    budget,
    missionProgress,
    completedMissions,
  } = useApp();

  // Live context so the agent can verify real mission / challenge progress
  const chatCtx: ChatContext = {
    points,
    budget,
    missions: missions.map((m) => ({
      id: m.id,
      title: m.title,
      progress: missionProgress[m.id] ?? 0,
      goal: m.goal,
      points: m.points,
      done: completedMissions.includes(m.id),
      unit: m.unit,
    })),
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi Alex! I’ve looked at your meter data, tonight’s humidity and the tariff. Ask me anything about your home’s energy — every answer comes with real numbers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    const answer = chatReply(q, chatCtx);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: answer.text, card: answer.card }]);
      setTyping(false);
    }, 800);
  }

  const explanation = billExplanation();
  const plan = tonightPlan();
  const offer = partnerOffers[0];

  return (
    <Shell>
      {/* Header */}
      <header className="px-5 pb-3 pt-6">
        <div className="flex items-center gap-2">
          <Sparkles size={19} className="fill-ink" />
          <h1 className="text-[19px] font-bold tracking-tight">Ask Cool Shift</h1>
        </div>
        <span className="mt-1 inline-block rounded-full bg-neutral-200/70 px-2.5 py-0.5 text-[11.5px] font-medium text-mute">
          Your energy assistant
        </span>
      </header>

      {/* Quick chips */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
        {chips.map((c) => (
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
          <div key={i} className={`bubble-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] ${m.role === "user" ? "" : ""}`}>
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
                    {bill.month} bill: HK${bill.thisMonth} <span className="font-normal text-mute">(May: HK${bill.lastMonth})</span>
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
                    Total +HK${explanation.delta}
                  </div>
                </Card>
              )}

              {/* ── Rich card: tonight's plan ── */}
              {m.card === "plan" && (
                <Card className="mt-2 p-4">
                  <div className="mb-2.5 text-[13px] font-semibold">A plan that fits you</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-2xl border border-hairline px-3.5 py-3">
                      <Snowflake size={17} />
                      <div className="flex-1">
                        <div className="text-[13.5px] font-medium">Cooling</div>
                        <div className="text-[12px] text-mute">7:30 PM · 25.5°C</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-hairline px-3.5 py-3">
                      <BatteryCharging size={17} />
                      <div className="flex-1">
                        <div className="text-[13.5px] font-medium">EV charging</div>
                        <div className="text-[12px] text-mute">11:00 PM · 80% target</div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCalc((s) => !s)}
                    className="mt-2.5 flex w-full items-center gap-2 rounded-2xl bg-paper px-3.5 py-3 text-left text-[12.5px] font-medium text-mute"
                  >
                    <Info size={14} />
                    <span className="flex-1">How this plan was calculated</span>
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
                      {planApplied ? "Plan applied ✓" : "Use this plan"}
                    </PrimaryButton>
                  </div>
                </Card>
              )}

              {/* ── Rich card: mission progress (live from app state) ── */}
              {m.card === "missions" && (
                <Card className="mt-2 p-4">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[13px] font-semibold">Mission check-in</span>
                    <span className="rounded-full bg-clp-sky px-2.5 py-0.5 text-[11px] font-bold text-clp-blue">
                      {points} pts
                    </span>
                  </div>
                  <div className="space-y-3">
                    {missions.map((mi) => {
                      const prog = missionProgress[mi.id] ?? 0;
                      const done = completedMissions.includes(mi.id);
                      return (
                        <div key={mi.id}>
                          <div className="flex items-center justify-between text-[12.5px]">
                            <span className={done ? "font-semibold" : "font-medium"}>
                              {done ? "✅ " : ""}{mi.title}
                            </span>
                            <span className="text-mute">
                              {done ? "complete" : `${prog}/${mi.goal} ${mi.unit}`}
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
                        {offer.title} · {offer.distanceM} m away · {offer.points} pts
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
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
              placeholder="Ask about your home…"
              className="tap-target w-full bg-transparent py-3 text-[14px] outline-none placeholder:text-mute"
            />
            <button
              type="button"
              title="Voice input — Cantonese, English and Mandarin (pilot)"
              onClick={() => send("Why is my bill higher?")}
              className="tap-target p-1 text-mute"
            >
              <Mic size={18} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => send(input)}
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
