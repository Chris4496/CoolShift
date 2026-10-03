"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { greenFunds, missions, partnerOffers, profile } from "./data";
import { localize, translator, type Lang, type Translate } from "./i18n";
import {
  XP_PER_FEED,
  XP_PER_PAT,
  PAT_COOLDOWN_MS,
  STARTING_SNACKS,
  isOutfitUnlocked,
  levelFromXp,
  outfitById,
  stageForLevel,
} from "./pet";

export interface Investment {
  fundId: string;
  points: number;
}

export interface AppState {
  points: number;
  budget: number;
  simpleMode: boolean;
  lang: Lang;
  missionProgress: Record<string, number>;
  completedMissions: string[];
  portfolio: Investment[];
  vouchers: string[];
  planApplied: boolean;
  chargeScheduled: boolean;
  joinedChallenge: boolean;
  // ── Mascot raising game ──
  petSnacks: number; // "Frosty" tokens, minted 1:1 with every point earned
  petXp: number;
  petFeeds: number;
  lastFedAt: number | null;
  lastPatAt: number | null;
  ownedOutfits: string[]; // shop-purchased outfit ids
  currentOutfit: string; // equipped outfit id
}

interface AppContextValue extends AppState {
  toast: (msg: string) => void;
  addPoints: (n: number, reason?: string) => void;
  setBudget: (n: number) => void;
  toggleSimpleMode: () => void;
  toggleLang: () => void;
  checkInMission: (id: string) => void;
  redeemOffer: (id: string) => void;
  invest: (fundId: string, points: number) => void;
  applyPlan: () => void;
  confirmCharge: () => void;
  joinChallenge: () => void;
  feedPet: () => void;
  patPet: () => void;
  buyOutfit: (id: string) => void;
  equipOutfit: (id: string) => void;
}

const initialState: AppState = {
  points: 240,
  budget: profile.monthlyBudget,
  simpleMode: false,
  lang: "en",
  missionProgress: Object.fromEntries(missions.map((m) => [m.id, m.startProgress])),
  completedMissions: [],
  portfolio: [{ fundId: "hk-solar", points: 60 }],
  vouchers: [],
  planApplied: false,
  chargeScheduled: false,
  joinedChallenge: false,
  petSnacks: STARTING_SNACKS,
  petXp: 0,
  petFeeds: 0,
  lastFedAt: null,
  lastPatAt: null,
  ownedOutfits: [],
  currentOutfit: "base",
};

const STORAGE_KEY = "coolshift-v1";
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const loaded = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state once (client only)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        setState((s) => ({ ...s, ...parsed }));
      }
    } catch {
      // fresh start
    }
    loaded.current = true;
  }, []);

  // Persist on change
  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.lang = state.lang === "zh" ? "zh-HK" : "en";
  }, [state.lang]);

  // Simple mode class on <body>
  useEffect(() => {
    document.body.classList.toggle("simple-mode", state.simpleMode);
  }, [state.simpleMode]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const addPoints = useCallback(
    (n: number, reason?: string) => {
      setState((s) => {
        const t = translator(s.lang);
        // Every point earned mints one companion "Frosty" snack token 🍬
        setTimeout(
          () =>
            toast(
              t(`+${n} points · +${n} Frosties 🍬`, `+${n} 積分 · +${n} 涼涼果 🍬`) +
                (reason ? ` — ${reason}` : "")
            ),
          0
        );
        return { ...s, points: s.points + n, petSnacks: s.petSnacks + n };
      });
    },
    [toast]
  );

  const setBudget = useCallback((n: number) => {
    setState((s) => ({ ...s, budget: n }));
  }, []);

  const toggleSimpleMode = useCallback(() => {
    setState((s) => ({ ...s, simpleMode: !s.simpleMode }));
  }, []);

  const toggleLang = useCallback(() => {
    setState((s) => ({ ...s, lang: s.lang === "en" ? "zh" : "en" }));
  }, []);

  const checkInMission = useCallback(
    (id: string) => {
      const mission = missions.find((m) => m.id === id);
      if (!mission) return;
      setState((s) => {
        if (s.completedMissions.includes(id)) return s;
        const current = s.missionProgress[id] ?? 0;
        const next = Math.min(mission.goal, current + 1);
        const done = next >= mission.goal;
        return {
          ...s,
          missionProgress: { ...s.missionProgress, [id]: next },
          completedMissions: done
            ? [...s.completedMissions, id]
            : s.completedMissions,
          points: done ? s.points + mission.points : s.points,
          // Mission rewards mint companion Frosties too
          petSnacks: done ? s.petSnacks + mission.points : s.petSnacks,
        };
      });
      // Toast outside setState for latest value
      setState((s) => {
        const done = s.completedMissions.includes(id);
        const prog = s.missionProgress[id] ?? 0;
        const m = localize(mission, s.lang);
        const t = translator(s.lang);
        setTimeout(() => {
          if (done)
            toast(
              t(
                `Mission complete: “${m.title}” — +${m.points} points 🎉`,
                `任務完成：「${m.title}」— +${m.points} 積分 🎉`
              )
            );
          else toast(t(`Logged: ${prog}/${m.goal} ${m.unit}`, `已記錄：${prog}/${m.goal} ${m.unit}`));
        }, 0);
        return s;
      });
    },
    [toast]
  );

  const redeemOffer = useCallback(
    (id: string) => {
      const offer = partnerOffers.find((o) => o.id === id);
      if (!offer) return;
      setState((s) => {
        if (s.vouchers.includes(id)) return s;
        const t = translator(s.lang);
        const o = localize(offer, s.lang);
        if (s.points < offer.points) {
          setTimeout(
            () => toast(t(`Not enough points — you need ${o.points}.`, `積分不足 — 需要 ${o.points} 分。`)),
            0
          );
          return s;
        }
        setTimeout(
          () =>
            toast(
              t(
                `Voucher saved: “${o.title}”. Show it at ${o.partner}.`,
                `已儲存禮券：「${o.title}」。請到${o.partner}出示。`
              )
            ),
          0
        );
        return {
          ...s,
          points: s.points - offer.points,
          vouchers: [...s.vouchers, id],
        };
      });
    },
    [toast]
  );

  const invest = useCallback(
    (fundId: string, points: number) => {
      const fund = greenFunds.find((f) => f.id === fundId);
      if (!fund || points <= 0) return;
      setState((s) => {
        const t = translator(s.lang);
        if (s.points < points) {
          setTimeout(() => toast(t("Not enough points to invest that amount.", "積分不足，未能投資此數額。")), 0);
          return s;
        }
        const existing = s.portfolio.find((p) => p.fundId === fundId);
        const portfolio = existing
          ? s.portfolio.map((p) =>
              p.fundId === fundId ? { ...p, points: p.points + points } : p
            )
          : [...s.portfolio, { fundId, points }];
        setTimeout(
          () =>
            toast(
              t(
                `Invested ${points} pts into ${fund.name}. Growing clean energy 🌱`,
                `已將 ${points} 積分投資於${localize(fund, s.lang).name}。一齊推動潔淨能源 🌱`
              )
            ),
          0
        );
        return { ...s, points: s.points - points, portfolio };
      });
    },
    [toast]
  );

  const applyPlan = useCallback(() => {
    setState((s) => {
      if (s.planApplied) return s;
      const t = translator(s.lang);
      setTimeout(
        () => toast(t("Tonight’s plan applied — +20 points when you complete it.", "已套用今晚計劃 — 完成後 +20 積分。")),
        0
      );
      return {
        ...s,
        planApplied: true,
        points: s.points + 20,
        petSnacks: s.petSnacks + 20,
      };
    });
  }, [toast]);

  // ── Mascot raising game actions ──────────────────────────────────────────

  // Spend 1 Frosty → +XP, with a level-up celebration toast
  const feedPet = useCallback(() => {
    setState((s) => {
      const t = translator(s.lang);
      if (s.petSnacks < 1) {
        setTimeout(
          () =>
            toast(
              t(
                "No Frosties left — earn points from missions & plans to get more!",
                "涼涼果用完啦 — 做任務、慳電賺積分就有更多！"
              )
            ),
          0
        );
        return s;
      }
      const xp = s.petXp + XP_PER_FEED;
      const before = stageForLevel(levelFromXp(s.petXp).level);
      const afterLvl = levelFromXp(xp).level;
      const after = stageForLevel(afterLvl);
      // Evolving into a stage with a real outfit auto-equips it
      const evolves = after.minLevel > before.minLevel;
      const autoOutfit = evolves && after.outfitId ? after.outfitId : null;
      setTimeout(() => {
        if (evolves)
          toast(
            autoOutfit
              ? t(
                  `✨ Evolution! Snowie became ${after.name} — new outfit unlocked!`,
                  `✨ 進化啦！雪寶變成${after.nameZh} — 新套裝已解鎖！`
                )
              : t(
                  `✨ Evolution! Snowie became ${after.name} ${after.accessory}`,
                  `✨ 進化啦！雪寶變成${after.nameZh} ${after.accessory}`
                )
          );
        else if (afterLvl > levelFromXp(s.petXp).level)
          toast(t(`Level up! Snowie is now Lv ${afterLvl} 🎉`, `升級啦！雪寶升到 Lv ${afterLvl} 🎉`));
        else
          toast(t(`Yum yum! +${XP_PER_FEED} XP`, `好味好味！+${XP_PER_FEED} 經驗`));
      }, 0);
      return {
        ...s,
        petSnacks: s.petSnacks - 1,
        petXp: xp,
        petFeeds: s.petFeeds + 1,
        lastFedAt: Date.now(),
        currentOutfit: autoOutfit ?? s.currentOutfit,
      };
    });
  }, [toast]);

  // ── Wardrobe ───────────────────────────────────────────────────────────

  const buyOutfit = useCallback(
    (id: string) => {
      const outfit = outfitById(id);
      const unlock = outfit.unlock;
      if (unlock.type !== "shop") return;
      setState((s) => {
        if (s.ownedOutfits.includes(id)) return s;
        const t = translator(s.lang);
        if (s.petSnacks < unlock.cost) {
          setTimeout(
            () =>
              toast(
                t(
                  `Not enough Frosties — "${outfit.name}" costs ${unlock.cost} 🍬`,
                  `涼涼果唔夠 — 「${outfit.nameZh}」要 ${unlock.cost} 🍬`
                )
              ),
            0
          );
          return s;
        }
        setTimeout(
          () =>
            toast(
              t(
                `New outfit: "${outfit.name}"! Snowie looks great 🎀`,
                `新套裝：「${outfit.nameZh}」！雪寶好靚仔 🎀`
              )
            ),
          0
        );
        return {
          ...s,
          petSnacks: s.petSnacks - unlock.cost,
          ownedOutfits: [...s.ownedOutfits, id],
          currentOutfit: id,
        };
      });
    },
    [toast]
  );

  const equipOutfit = useCallback((id: string) => {
    setState((s) => {
      const outfit = outfitById(id);
      const level = levelFromXp(s.petXp).level;
      if (!isOutfitUnlocked(outfit, level, s.ownedOutfits)) return s;
      return { ...s, currentOutfit: id };
    });
  }, []);

  // Free affection on a short cooldown — tiny XP so tapping feels rewarding
  const patPet = useCallback(() => {
    setState((s) => {
      const now = Date.now();
      if (s.lastPatAt && now - s.lastPatAt < PAT_COOLDOWN_MS) return s;
      return { ...s, petXp: s.petXp + XP_PER_PAT, lastPatAt: now };
    });
  }, []);

  const confirmCharge = useCallback(() => {
    setState((s) => {
      if (s.chargeScheduled) return s;
      const t = translator(s.lang);
      setTimeout(
        () => toast(t("Charging scheduled for 11:00 PM. Ready by 7:00 AM ⚡", "已預約晚上 11:00 充電，早上 7:00 前充好 ⚡")),
        0
      );
      return { ...s, chargeScheduled: true };
    });
  }, [toast]);

  const joinChallenge = useCallback(() => {
    setState((s) => {
      if (s.joinedChallenge) return s;
      const t = translator(s.lang);
      setTimeout(
        () => toast(t("You joined the Block 7 challenge. Let’s hit 500 kWh together 🏘️", "你已參加第 7 座挑戰，一齊衝 500 度電 🏘️")),
        0
      );
      return { ...s, joinedChallenge: true };
    });
  }, [toast]);

  const value: AppContextValue = {
    ...state,
    toast,
    addPoints,
    setBudget,
    toggleSimpleMode,
    toggleLang,
    checkInMission,
    redeemOffer,
    invest,
    applyPlan,
    confirmCharge,
    joinChallenge,
    feedPet,
    patPet,
    buyOutfit,
    equipOutfit,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toastMsg && (
        <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-6 pointer-events-none">
          <div className="toast-in pointer-events-auto max-w-phone rounded-full bg-ink px-5 py-3 text-sm text-white shadow-lift">
            {toastMsg}
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

// Inline bilingual copy: t("English", "中文")
export function useT(): Translate {
  return translator(useApp().lang);
}
