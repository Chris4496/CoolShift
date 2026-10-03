import { BarChart3, Building2, Download, Gift, House, MessageSquare, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Mascot from './components/Mascot'
import { hkd } from './calc'
import { pick } from './i18n'
import { useStore } from './store'
import Ask from './screens/Ask'
import Bill from './screens/Bill'
import Budget from './screens/Budget'
import Caregiver from './screens/Caregiver'
import Community from './screens/Community'
import Home from './screens/Home'
import Insights from './screens/Insights'
import Invest from './screens/Invest'
import Ledger from './screens/Ledger'
import Onboarding from './screens/Onboarding'
import PartnerDetail from './screens/PartnerDetail'
import Pilot from './screens/Pilot'
import Rewards from './screens/Rewards'
import Settings from './screens/Settings'
import Vouchers from './screens/Vouchers'

const TABS = [
  { id: 'home', icon: House, C: Home },
  { id: 'insights', icon: BarChart3, C: Insights },
  { id: 'ask', icon: MessageSquare, C: Ask },
  { id: 'rewards', icon: Gift, C: Rewards },
  { id: 'community', icon: Building2, C: Community },
]

const SCREENS = { Bill, Budget, Caregiver, Invest, Ledger, PartnerDetail, Pilot, Settings, Vouchers }

function Celebration() {
  const { celebrate, setCelebrate, t, lang } = useStore()
  if (!celebrate) return null
  return (
    <div className="modal-backdrop" onClick={() => setCelebrate(null)}>
      <div className="modal celebrate" onClick={(e) => e.stopPropagation()}>
        <div className="confetti" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <i key={i} style={{ '--i': i }} />
          ))}
        </div>
        <Mascot mood="cheer" size={110} className="pop" />
        <h2>{t('greatJob')}</h2>
        <p className="muted">{pick(lang, celebrate.title)}</p>
        <div className="celebrate-stats">
          <div>
            <b>+{celebrate.points}</b>
            <span>EcoPoints</span>
          </div>
          <div>
            <b>{celebrate.kwh.toFixed(1)}</b>
            <span>kWh shifted</span>
          </div>
          <div>
            <b>{hkd(celebrate.hkd, 1)}</b>
            <span>est. saving</span>
          </div>
        </div>
        <p className="small muted">You just helped ease the evening peak for your neighbours too.</p>
        <button className="btn primary block" onClick={() => setCelebrate(null)}>
          {t('close')}
        </button>
      </div>
    </div>
  )
}

function InstallBanner() {
  const [evt, setEvt] = useState(null)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const h = (e) => {
      e.preventDefault()
      setEvt(e)
    }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])
  if (!evt || hidden) return null
  return (
    <div className="install">
      <Download size={18} />
      <span>Install Cool Shift on your phone</span>
      <button
        className="btn small primary"
        onClick={async () => {
          evt.prompt()
          await evt.userChoice
          setEvt(null)
        }}
      >
        Install
      </button>
      <button className="icon-btn" onClick={() => setHidden(true)} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  )
}

export default function App() {
  const { state, tab, go, stack, toast, t } = useStore()

  if (!state.onboarded) return <Onboarding />

  const Active = TABS.find((x) => x.id === tab).C
  const top = stack[stack.length - 1]
  const Overlay = top && SCREENS[top.screen]

  return (
    <div className="app">
      <main className="screen" key={tab}>
        <Active />
        <p className="footnote">Concept demo · Illustrative data · Not connected to real meters</p>
      </main>

      {Overlay && (
        <div className="overlay" key={top.key}>
          <Overlay {...top.props} />
        </div>
      )}

      <nav className="tabbar">
        {TABS.map(({ id, icon: I }) => (
          <button key={id} className={id === tab && !Overlay ? 'active' : ''} onClick={() => go(id)}>
            <I size={22} strokeWidth={id === tab ? 2.4 : 1.7} />
            <span>{t(id)}</span>
          </button>
        ))}
      </nav>

      <InstallBanner />
      <Celebration />
      {toast && (
        <div className="toast" key={toast.id}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
