import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { defaultProfile, initialLedger, missions as missionSeed, tipLibrary } from './data'
import { translate } from './i18n'

const KEY = 'coolshift-demo-v1'

const initialState = {
  onboarded: false,
  profile: defaultProfile,
  settings: {
    lang: 'en',
    simple: false,
    heatWarning: false,
    budgetAlerts: true,
    consent: { meter: true, community: true, personalisedOffers: true },
  },
  points: 240,
  ledger: initialLedger,
  doneTips: [],
  plans: [],
  vouchers: [],
  holdings: {},
  budget: 1000,
  savedKwh: 46.2,
  savedHkd: 74,
  missions: Object.fromEntries(missionSeed.map((m) => [m.id, m.progress])),
  cheered: [],
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    const s = JSON.parse(raw)
    return { ...initialState, ...s, settings: { ...initialState.settings, ...s.settings } }
  } catch {
    return initialState
  }
}

let seq = 0
const uid = () => `${Date.now().toString(36)}${(seq++).toString(36)}`

function earn(state, pts, label) {
  return {
    ...state,
    points: state.points + pts,
    ledger: [{ id: uid(), label, pts, when: 'Today' }, ...state.ledger],
  }
}

function reducer(state, a) {
  switch (a.type) {
    case 'onboard':
      return { ...state, onboarded: true, profile: { ...state.profile, ...a.profile } }
    case 'profile':
      return { ...state, profile: { ...state.profile, ...a.patch } }
    case 'setting':
      return { ...state, settings: { ...state.settings, [a.key]: a.value } }
    case 'consent':
      return { ...state, settings: { ...state.settings, consent: { ...state.settings.consent, [a.key]: a.value } } }
    case 'budget':
      return { ...state, budget: a.value }
    case 'completeTip': {
      if (state.doneTips.includes(a.tip.id)) return state
      let s = earn(state, a.tip.points, a.tip.title.en)
      s = {
        ...s,
        doneTips: [...s.doneTips, a.tip.id],
        savedKwh: +(s.savedKwh + a.tip.kwh).toFixed(2),
        savedHkd: +(s.savedHkd + a.tip.hkd).toFixed(2),
      }
      if (a.tip.mission) s = { ...s, missions: { ...s.missions, [a.tip.mission]: s.missions[a.tip.mission] + 1 } }
      return s
    }
    case 'claimMission': {
      const m = a.mission
      const s = earn(state, m.points, `Mission: ${m.title}`)
      return { ...s, missions: { ...s.missions, [m.id]: -1 } }
    }
    case 'applyPlan':
      return { ...earn(state, 20, 'Plan accepted'), plans: [...state.plans, { id: uid(), ...a.plan }] }
    case 'redeem': {
      if (state.points < a.partner.points) return state
      const code = 'CS-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      return {
        ...state,
        points: state.points - a.partner.points,
        ledger: [{ id: uid(), label: `Redeemed · ${a.partner.name}`, pts: -a.partner.points, when: 'Today' }, ...state.ledger],
        vouchers: [{ id: uid(), partnerId: a.partner.id, code, used: false, when: 'Today' }, ...state.vouchers],
      }
    }
    case 'useVoucher':
      return { ...state, vouchers: state.vouchers.map((v) => (v.id === a.id ? { ...v, used: true } : v)) }
    case 'invest': {
      if (state.points < a.points) return state
      return {
        ...state,
        points: state.points - a.points,
        holdings: { ...state.holdings, [a.fundId]: (state.holdings[a.fundId] || 0) + a.points },
        ledger: [{ id: uid(), label: `Invested · ${a.fundName}`, pts: -a.points, when: 'Today' }, ...state.ledger],
      }
    }
    case 'cheer':
      return state.cheered.includes(a.idx) ? state : { ...state, cheered: [...state.cheered, a.idx] }
    case 'bonus':
      return earn(state, a.pts, a.label)
    case 'reset':
      return { ...initialState }
    default:
      return state
  }
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [toast, setToast] = useState(null)
  const [celebrate, setCelebrate] = useState(null)
  const [stack, setStack] = useState([])
  const [tab, setTab] = useState('home')

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.documentElement.classList.toggle('simple', state.settings.simple)
    document.documentElement.lang = { en: 'en', hk: 'zh-HK', cn: 'zh-CN' }[state.settings.lang]
  }, [state.settings.simple, state.settings.lang])

  const showToast = useCallback((msg) => {
    setToast({ msg, id: Date.now() })
    setTimeout(() => setToast(null), 2600)
  }, [])

  const push = useCallback((screen, props = {}) => setStack((s) => [...s, { screen, props, key: uid() }]), [])
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), [])
  const go = useCallback((t) => {
    setStack([])
    setTab(t)
    window.scrollTo(0, 0)
  }, [])

  const [pendingQ, setPendingQ] = useState(null)
  const ask = useCallback(
    (q) => {
      setPendingQ({ q, id: uid() })
      go('ask')
    },
    [go],
  )

  const t = useCallback((k) => translate(state.settings.lang, k), [state.settings.lang])

  const vulnerable = state.settings.heatWarning || state.profile.elderly

  const todaysTips = useMemo(() => {
    const p = state.profile
    return tipLibrary
      .filter((tip) => (tip.requires === 'ev' ? p.ev || p.ebike : true))
      .filter((tip) => (vulnerable ? tip.heatSafe : tip.id !== 'ac-dry' && tip.id !== 'curtains'))
      .slice(0, 3)
  }, [state.profile, vulnerable])

  const completeTip = useCallback(
    (tip) => {
      dispatch({ type: 'completeTip', tip })
      setCelebrate({ points: tip.points, hkd: tip.hkd, kwh: tip.kwh, title: tip.title })
    },
    [],
  )

  const value = {
    state,
    dispatch,
    t,
    lang: state.settings.lang,
    toast,
    showToast,
    celebrate,
    setCelebrate,
    stack,
    push,
    pop,
    tab,
    go,
    ask,
    pendingQ,
    setPendingQ,
    todaysTips,
    vulnerable,
    completeTip,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
