import { AlertTriangle, Check, ChevronRight, Droplet, HeartHandshake, Phone, Plug, Sun, TreePine, Wallet } from 'lucide-react'
import { useState } from 'react'
import Mascot from '../components/Mascot'
import { Bubble, Icon, Progress, Row, SectionTitle } from '../components/ui'
import { co2, fmtRange, hkd, KG_CO2_PER_TREE_YEAR, range } from '../calc'
import { bill, caregiver, heatSafetyTip, partners, smartAlert, weather } from '../data'
import { LANGS, mascotLines, pick } from '../i18n'
import { useStore } from '../store'

function TipCard({ tip }) {
  const { state, completeTip, t, lang } = useStore()
  const [open, setOpen] = useState(false)
  const done = state.doneTips.includes(tip.id)
  return (
    <div className={`card tip ${done ? 'done' : ''}`}>
      <button className="tip-main" onClick={() => setOpen(!open)}>
        <span className="row-icon">
          <Icon name={tip.icon} size={22} />
        </span>
        <span className="row-body">
          <span className="row-title">{pick(lang, tip.title)}</span>
          <span className="row-sub">{pick(lang, tip.detail)}</span>
          <span className="tip-meta">
            <b>Save {fmtRange(range(tip.hkd))}</b> · {tip.kwh.toFixed(1)} kWh · +{tip.points} pts
          </span>
        </span>
        <ChevronRight size={18} className={`muted chev ${open ? 'open' : ''}`} />
      </button>
      {open && (
        <div className="tip-why">
          <p>{tip.why}</p>
          <p className="small muted">Calculated from your meter data and the pilot tariff. Shown as a range because weather varies.</p>
        </div>
      )}
      <div className="tip-actions">
        <span className="chip-time">{tip.time}</span>
        {done ? (
          <span className="done-pill">
            <Check size={16} /> {t('done')}
          </span>
        ) : (
          <button className="btn small primary" onClick={() => completeTip(tip)}>
            {t('doIt')}
          </button>
        )}
      </div>
    </div>
  )
}

function SimpleHome() {
  const { state, t, todaysTips, completeTip, lang, go, push, vulnerable } = useStore()
  const tip = todaysTips.find((x) => !state.doneTips.includes(x.id))
  return (
    <div className="simple-home">
      <div className="simple-head">
        <h1>
          {t('hi')} {state.profile.name}
        </h1>
        <div className="simple-weather">
          <Sun size={36} /> {weather.tempC}°C
        </div>
      </div>
      {vulnerable && (
        <div className="card heat big">
          <AlertTriangle size={28} />
          <div>
            <b>{pick(lang, heatSafetyTip.title)}</b>
            <p>{pick(lang, heatSafetyTip.detail)}</p>
          </div>
        </div>
      )}
      <Bubble mood={vulnerable ? 'hot' : 'happy'} size={72}>
        {tip
          ? lang === 'en'
            ? `${pick(lang, tip.title)}. ${pick(lang, tip.detail)}.`
            : `${pick(lang, tip.title)}，${pick(lang, tip.detail)}。`
          : pick(lang, mascotLines.allDone)}
      </Bubble>
      {tip && (
        <button className="btn primary block xl" onClick={() => completeTip(tip)}>
          <Check size={28} /> {t('doIt')}
        </button>
      )}
      <div className="simple-grid">
        <button className="card" onClick={() => go('ask')}>
          <Icon name="snowflake" size={40} />
          {t('simpleCool')}
        </button>
        <button className="card" onClick={() => push('Bill')}>
          <Wallet size={40} strokeWidth={1.8} />
          {t('simpleBill')}
        </button>
        <button className="card" onClick={() => go('rewards')}>
          <Icon name="ticket" size={40} />
          {t('rewards')}
        </button>
        <a className="card" href="tel:00000000">
          <Phone size={40} strokeWidth={1.8} />
          {t('simpleHelp')}
        </a>
      </div>
      <p className="center muted">{state.points} EcoPoints</p>
    </div>
  )
}

export default function Home() {
  const { state, dispatch, t, lang, todaysTips, push, go, ask, vulnerable } = useStore()
  if (state.settings.simple) return <SimpleHome />

  const p = state.profile
  const doneCount = todaysTips.filter((x) => state.doneTips.includes(x.id)).length
  const allDone = doneCount === todaysTips.length
  const kg = co2(state.savedKwh)
  const alertPartner = partners.find((x) => x.id === smartAlert.partnerId)
  const budgetPct = (bill.projected / state.budget) * 100

  return (
    <div className="home">
      <header className="top">
        <span className="brand">
          Cool Shift <small>by CLP</small>
        </span>
        <div className="top-right">
          <button
            className="lang-pill"
            onClick={() => {
              const i = LANGS.findIndex((l) => l.id === lang)
              dispatch({ type: 'setting', key: 'lang', value: LANGS[(i + 1) % LANGS.length].id })
            }}
          >
            {LANGS.find((l) => l.id === lang).short}
          </button>
          <button className="avatar" onClick={() => push('Settings')} aria-label={t('settings')}>
            {p.name.slice(0, 1)}
          </button>
        </div>
      </header>

      <h1 className="hello">
        {t('hi')} {p.name}
      </h1>
      <p className="muted">{t('tagline')}</p>

      <div className="weather">
        <span>
          <Sun size={20} /> {weather.tempC}°C
        </span>
        <span className="sep" />
        <span>
          <Droplet size={18} /> {t('humidity')} {weather.humidity}%
        </span>
        <span className="sep" />
        <span className="muted small">{p.district}</span>
      </div>

      {vulnerable && (
        <div className="card heat">
          <AlertTriangle size={22} />
          <div>
            <b>{state.settings.heatWarning ? t('heatWarning') : pick(lang, heatSafetyTip.title)}</b>
            <p>{pick(lang, heatSafetyTip.detail)}</p>
          </div>
        </div>
      )}

      <div className="quick">
        <button className="active">
          <Icon name="grid" size={22} />
          {t('home')}
        </button>
        <button onClick={() => ask('I get home at 6 PM. Can I stay cool?')}>
          <Icon name="snowflake" size={22} />
          Cooling
        </button>
        <button onClick={() => ask('How can I charge my EV without adding to the peak?')}>
          <Plug size={22} strokeWidth={1.8} />
          Charging
        </button>
        <button onClick={() => go('rewards')}>
          <Icon name="ticket" size={22} />
          {t('rewards')}
        </button>
      </div>

      <Bubble mood={vulnerable ? 'hot' : allDone ? 'cheer' : 'happy'}>
        {pick(lang, vulnerable ? mascotLines.heat : allDone ? mascotLines.allDone : mascotLines.morning)}
      </Bubble>

      <div className="hero dark">
        <div>
          <p className="hero-title">
            {t('comfort')}
            <br />
            <span>{t('lessEnergy')}</span>
          </p>
          <p className="hero-big">
            {vulnerable ? '25' : '25.5'}
            <small>°C</small>
          </p>
          <p className="hero-sub">{t('suggested')}</p>
        </div>
        <img src="/img/ac.jpg" alt="" className="hero-img" />
        <button className="hero-go" onClick={() => ask('I get home at 6 PM. Can I stay cool?')} aria-label="Plan cooling">
          <ChevronRight size={18} />
        </button>
      </div>

      <SectionTitle action={`${doneCount}/${todaysTips.length}`}>{t('nextMoves')}</SectionTitle>
      <div className="stack">
        {todaysTips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>
      <p className="small muted center">Max three tips a day, so every one counts.</p>

      {state.settings.consent.personalisedOffers && (
        <div className="card alert-card" onClick={() => push('PartnerDetail', { id: alertPartner.id })}>
          <div className="alert-head">
            <span className="badge">Smart alert</span>
            <span className="badge outline">Partner offer</span>
          </div>
          <b>{smartAlert.title}</b>
          <p className="small muted">{smartAlert.detail}</p>
          <div className="alert-foot">
            <span>
              {alertPartner.name}: {alertPartner.offer}
            </span>
            <ChevronRight size={18} />
          </div>
        </div>
      )}

      <SectionTitle>{t('impact')}</SectionTitle>
      <div className="card impact">
        <div className="impact-top">
          <HeartHandshake size={28} />
          <div>
            <b>You're a caring neighbour.</b>
            <p className="small muted">
              Your shifts this summer eased the evening peak for {p.estate}. That's top 18% in {p.block}.
            </p>
          </div>
        </div>
        <div className="impact-grid">
          <div>
            <b>{state.savedKwh.toFixed(1)}</b>
            <span>kWh {t('saved')}</span>
          </div>
          <div>
            <b>{hkd(state.savedHkd)}</b>
            <span>off your bills</span>
          </div>
          <div>
            <b>{kg.toFixed(1)} kg</b>
            <span>CO₂ avoided</span>
          </div>
          <div>
            <b>
              <TreePine size={16} /> {(kg / KG_CO2_PER_TREE_YEAR).toFixed(1)}
            </b>
            <span>trees for a year</span>
          </div>
        </div>
        <button className="btn ghost block" onClick={() => go('community')}>
          See your estate's total <ChevronRight size={16} />
        </button>
      </div>

      <SectionTitle action="Edit" onAction={() => push('Budget')}>
        {t('budget')}
      </SectionTitle>
      <button className="card budget-mini" onClick={() => push('Budget')}>
        <div className="budget-line">
          <span>
            Projected <b>{hkd(bill.projected)}</b>
          </span>
          <span className="muted">of {hkd(state.budget)}</span>
        </div>
        <Progress value={bill.projected} max={state.budget} />
        <span className={`small ${budgetPct > 100 ? 'warn' : 'muted'}`}>
          {budgetPct > 100
            ? `On track to go ${hkd(bill.projected - state.budget)} over. Today's 3 tips cut about HK$9.`
            : `On track, ${hkd(state.budget - bill.projected)} to spare this bill period.`}
        </span>
      </button>

      {p.caregiver && (
        <Row
          icon={<Mascot size={34} />}
          title={`${t('caregiver')}: ${caregiver.name}`}
          sub={`${caregiver.status} · ${caregiver.lastActivity}`}
          onClick={() => push('Caregiver')}
        />
      )}
    </div>
  )
}
