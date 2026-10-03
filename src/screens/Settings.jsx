import { BarChart3, HeartHandshake, RotateCcw, ShieldCheck, ThermometerSun, Type } from 'lucide-react'
import Mascot from '../components/Mascot'
import { Page, Row, SectionTitle, Toggle } from '../components/ui'
import { LANGS } from '../i18n'
import { useStore } from '../store'

export default function Settings() {
  const { state, dispatch, t, push, showToast } = useStore()
  const s = state.settings
  const p = state.profile
  const set = (key) => (value) => dispatch({ type: 'setting', key, value })
  const prof = (key) => (value) => dispatch({ type: 'profile', patch: { [key]: value } })
  const consent = (key) => (value) => dispatch({ type: 'consent', key, value })

  return (
    <Page title={t('settings')}>
      <div className="profile-head">
        <span className="avatar lg">{p.name.slice(0, 1)}</span>
        <div>
          <b>{p.name}</b>
          <small className="muted">
            {p.estate}, {p.block} · {p.flat} · {p.people} people
          </small>
        </div>
      </div>

      <SectionTitle>{t('language')}</SectionTitle>
      <div className="seg">
        {LANGS.map((l) => (
          <button key={l.id} className={s.lang === l.id ? 'on' : ''} onClick={() => set('lang')(l.id)}>
            {l.label}
          </button>
        ))}
      </div>

      <SectionTitle>Accessibility</SectionTitle>
      <div className="card toggles">
        <label>
          <span>
            <Type size={16} /> {t('simpleMode')}
          </span>
          <Toggle checked={s.simple} onChange={set('simple')} />
        </label>
        <label>
          <span>Budget alerts</span>
          <Toggle checked={s.budgetAlerts} onChange={set('budgetAlerts')} />
        </label>
      </div>

      <SectionTitle>My home</SectionTitle>
      <div className="card toggles">
        <label>
          <span>EV at home</span>
          <Toggle checked={p.ev} onChange={prof('ev')} />
        </label>
        <label>
          <span>E-bike or scooter</span>
          <Toggle checked={p.ebike} onChange={prof('ebike')} />
        </label>
        <label>
          <span>
            Elderly or vulnerable resident
            <small>Cooling is never reduced in tips</small>
          </span>
          <Toggle checked={p.elderly} onChange={prof('elderly')} />
        </label>
        <label>
          <span>I look after a relative's home</span>
          <Toggle checked={p.caregiver} onChange={prof('caregiver')} />
        </label>
      </div>

      <SectionTitle>
        <ShieldCheck size={16} /> Privacy & consent
      </SectionTitle>
      <div className="card toggles">
        <label>
          <span>Smart-meter data for tips</span>
          <Toggle checked={s.consent.meter} onChange={consent('meter')} />
        </label>
        <label>
          <span>Estate saving challenge</span>
          <Toggle checked={s.consent.community} onChange={consent('community')} />
        </label>
        <label>
          <span>Personalised partner offers</span>
          <Toggle checked={s.consent.personalisedOffers} onChange={consent('personalisedOffers')} />
        </label>
      </div>
      <p className="small muted">No household data is shared with partners. Only anonymous redemption counts.</p>

      <SectionTitle>Demo controls</SectionTitle>
      <div className="card toggles">
        <label>
          <span>
            <ThermometerSun size={16} /> Simulate {t('heatWarning')}
            <small>Pauses any tip that reduces cooling</small>
          </span>
          <Toggle checked={s.heatWarning} onChange={set('heatWarning')} />
        </label>
      </div>
      <div className="stack">
        {p.caregiver && (
          <Row icon={<HeartHandshake size={22} strokeWidth={1.8} />} title={t('caregiver')} sub="Mum's home in Wong Tai Sin" onClick={() => push('Caregiver')} />
        )}
        <Row
          icon={<BarChart3 size={22} strokeWidth={1.8} />}
          title="CLP pilot dashboard"
          sub="KPIs, control group, partner revenue"
          onClick={() => push('Pilot')}
          className="highlight"
        />
        <Row
          icon={<RotateCcw size={22} strokeWidth={1.8} />}
          title="Reset demo"
          sub="Restart onboarding with fresh data"
          onClick={() => {
            dispatch({ type: 'reset' })
            showToast('Demo reset')
          }}
        />
      </div>

      <div className="about">
        <Mascot size={48} />
        <small className="muted">Cool Shift concept demo for CLP · Illustrative data only · v0.1</small>
      </div>
    </Page>
  )
}
