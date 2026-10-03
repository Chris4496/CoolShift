import { BellRing, CheckCircle2, Info, Phone, Snowflake } from 'lucide-react'
import { Bubble, Page, Toggle } from '../components/ui'
import { caregiver } from '../data'
import { useStore } from '../store'
import { useState } from 'react'

export default function Caregiver() {
  const { t } = useStore()
  const c = caregiver
  const [noActivity, setNoActivity] = useState(true)
  const [acOff, setAcOff] = useState(true)
  const pct = Math.round((c.todayKwh / c.usualKwh) * 100)

  return (
    <Page title={t('caregiver')}>
      <p className="eyebrow">{c.district}</p>
      <h1 className="title">{c.name}</h1>

      <div className="card dark care-status">
        <CheckCircle2 size={30} />
        <div>
          <b>{c.status}</b>
          <span>{c.lastActivity}</span>
        </div>
      </div>

      <div className="grid2">
        <div className="card stat">
          <Snowflake size={20} />
          <b>{c.acNow}</b>
          <small className="muted">Right now</small>
        </div>
        <div className="card stat">
          <span className="stat-big">{c.todayKwh} kWh</span>
          <small className="muted">Today · {pct}% of her usual</small>
        </div>
      </div>

      <div className="stack">
        {c.alerts.map((a, i) => (
          <div key={i} className={`card alert-line ${a.level}`}>
            {a.level === 'ok' ? <CheckCircle2 size={18} /> : <Info size={18} />}
            <span>{a.text}</span>
          </div>
        ))}
      </div>

      <Bubble>
        Her tips are in Cantonese, large text, and never suggest less cooling. I'm only watching patterns, not
        cameras or microphones.
      </Bubble>

      <div className="card toggles">
        <label>
          <span>
            <BellRing size={16} /> Alert me if no activity by 10 AM
          </span>
          <Toggle checked={noActivity} onChange={setNoActivity} />
        </label>
        <label>
          <span>Alert me if her AC is off during a heat warning</span>
          <Toggle checked={acOff} onChange={setAcOff} />
        </label>
      </div>

      <a className="btn primary block" href="tel:00000000">
        <Phone size={18} /> Call Mum
      </a>
      <p className="small muted center">Mrs Chan approved this link from her own app. She can remove it any time.</p>
    </Page>
  )
}
