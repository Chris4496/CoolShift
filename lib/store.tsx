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
import type { Lang } from "./i18n";

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
      setState((s) => ({ ...s, points: s.points + n }));
      toast(`+${n} points${reason ? ` — ${reason}` : ""}`);
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
        };
      });
      // Toast outside setState for latest value
      setState((s) => {
        const done = s.completedMissions.includes(id);
        const prog = s.missionProgress[id] ?? 0;
        setTimeout(() => {
          if (done) toast(`Mission complete: “${mission.title}” — +${mission.points} points 🎉`);
          else toast(`Logged: ${prog}/${mission.goal} ${mission.unit}`);
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
        if (s.points < offer.points) {
          setTimeout(() => toast(`Not enough points — you need ${offer.points}.`), 0);
          return s;
        }
        setTimeout(
          () => toast(`Voucher saved: “${offer.title}”. Show it at ${offer.partner}.`),
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
        if (s.points < points) {
          setTimeout(() => toast("Not enough points to invest that amount."), 0);
          return s;
        }
        const existing = s.portfolio.find((p) => p.fundId === fundId);
        const portfolio = existing
          ? s.portfolio.map((p) =>
              p.fundId === fundId ? { ...p, points: p.points + points } : p
            )
          : [...s.portfolio, { fundId, points }];
        setTimeout(
          () => toast(`Invested ${points} pts into ${fund.name}. Growing clean energy 🌱`),
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
      setTimeout(() => toast("Tonight’s plan applied — +20 points when you complete it."), 0);
      return { ...s, planApplied: true, points: s.points + 20 };
    });
  }, [toast]);

  const confirmCharge = useCallback(() => {
    setState((s) => {
      if (s.chargeScheduled) return s;
      setTimeout(() => toast("Charging scheduled for 11:00 PM. Ready by 7:00 AM ⚡"), 0);
      return { ...s, chargeScheduled: true };
    });
  }, [toast]);

  const joinChallenge = useCallback(() => {
    setState((s) => {
      if (s.joinedChallenge) return s;
      setTimeout(() => toast("You joined the Block 7 challenge. Let’s hit 500 kWh together 🏘️"), 0);
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
