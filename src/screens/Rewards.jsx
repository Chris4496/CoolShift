import { ChevronDown, ChevronRight, Crosshair, Gift, History, MapPin, Sprout, Train } from 'lucide-react'
import { useState } from 'react'
import { Icon, Progress, Row, SectionTitle } from '../components/ui'
import { hkd } from '../calc'
import { categories, missions, partners } from '../data'
import { useStore } from '../store'

function MapView({ list, selected, onSelect }) {
  return (
    <div className="map">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="map-bg" aria-hidden>
        <rect width="100" height="100" fill="#eceeef" />
        <path d="M62 0 Q60 20 72 28 Q90 40 100 34 V0 Z" fill="#dfe8dc" />
        <path d="M0 52 Q20 46 34 58 Q48 70 60 66 Q78 60 100 74 V84 Q78 70 60 76 Q46 80 32 68 Q20 58 0 62 Z" fill="#cfe0ec" />
        <g stroke="#fff" strokeWidth="1.6" fill="none">
          <path d="M0 20 H100" />
          <path d="M0 40 Q50 36 100 46" />
          <path d="M20 0 V100" />
          <path d="M48 0 Q44 50 52 100" />
          <path d="M80 0 V100" />
          <path d="M0 88 H100" />
        </g>
        <g stroke="#f7f7f7" strokeWidth="0.6" fill="none">
          <path d="M0 10 H100 M0 30 H100 M0 78 H100 M10 0 V100 M34 0 V100 M64 0 V100 M92 0 V100" />
        </g>
      </svg>
      <span className="map-label" style={{ left: '64%', top: '3%' }}>
        Sha Tin Park
      </span>
      <span className="map-label river" style={{ left: '6%', top: '66%' }}>
        Shing Mun River
      </span>
      <span className="map-label big" style={{ left: '38%', top: '44%' }}>
        Sha Tin
      </span>
      <span className="map-station" style={{ left: '84%', top: '60%' }}>
        <Train size={12} /> Sha Tin Station
      </span>
      <span className="me-dot" style={{ left: '56%', top: '46%' }} />
      {list.map((p) => (
        <button
          key={p.id}
          className={`pin ${selected?.id === p.id ? 'on' : ''}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          onClick={() => onSelect(p)}
          aria-label={p.name}
        >
          {selected?.id === p.id && <span className="pin-pts">{p.points} pts</span>}
          <span className="pin-head">
            <Icon name={p.icon} size={16} />
          </span>
        </button>
      ))}
      <button className="map-locate" aria-label="Recenter">
        <Crosshair size={18} />
      </button>
    </div>
  )
}

function PartnerCard({ p, onOpen }) {
  return (
    <button className="card partner" onClick={onOpen}>
      <span className="partner-img">{p.img ? <img src={p.img} alt="" /> : <Icon name={p.icon} size={30} />}</span>
      <span className="partner-body">
        <b>{p.name}</b>
        <span>{p.offer}</span>
        <small className="muted">
          {p.distance} · {p.cofunded ? 'Partner co-funded' : 'Partner offer'}
        </small>
        <span className="partner-pts">
          <b>{p.points}</b> points
        </span>
      </span>
      <ChevronRight size={18} className="muted" />
    </button>
  )
}

export default function Rewards() {
  const { state, dispatch, t, push, showToast } = useStore()
  const [cat, setCat] = useState('all')
  const [view, setView] = useState('map')
  const list = partners.filter((p) => cat === 'all' || p.category === cat)
  const [selected, setSelected] = useState(partners[0])
  const sel = list.includes(selected) ? selected : list[0]
  const activeVouchers = state.vouchers.filter((v) => !v.used).length

  return (
    <div>
      <header className="top">
        <div>
          <p className="eyebrow brand-eyebrow">
            Cool Shift <small>by CLP</small>
          </p>
          <h1 className="title tight">Partner Rewards</h1>
        </div>
        <button className="top-action" onClick={() => push('Vouchers')}>
          <Gift size={24} strokeWidth={1.6} />
          {activeVouchers > 0 && <span className="dot-count">{activeVouchers}</span>}
          <span>{t('myVouchers')}</span>
        </button>
      </header>

      <div className="points-hero">
        <div>
          <p className="points-num">{state.points}</p>
          <p>{t('pointsAvail')}</p>
          <small>≈ {hkd(state.points / 10)} reward value · 100 pts = HK$10</small>
        </div>
        <img src="/img/coin.jpg" alt="" />
      </div>

      <SectionTitle>{t('mission')}</SectionTitle>
      <div className="stack">
        {missions.map((m) => {
          const prog = state.missions[m.id]
          const claimed = prog === -1
          const complete = prog >= m.target
          return (
            <div key={m.id} className={`card mission ${claimed ? 'done' : ''}`}>
              <div className="mission-top">
                <Icon name={m.icon} size={22} />
                <div>
                  <b>{m.title}</b>
                  <span className="muted small">{m.detail}</span>
                </div>
                <span className="badge outline">+{m.points} pts</span>
              </div>
              <Progress value={claimed ? m.target : prog} max={m.target} dark />
              <div className="mission-foot">
                <span className="small muted">
                  {claimed ? 'Claimed' : `${Math.min(prog, m.target)} of ${m.target} completed`}
                </span>
                {complete && !claimed && (
                  <button
                    className="btn small primary"
                    onClick={() => {
                      dispatch({ type: 'claimMission', mission: m })
                      showToast(`Mission complete · +${m.points} EcoPoints`)
                    }}
                  >
                    Claim
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card earn">
        <b>How smart-meter savings become rewards</b>
        <div className="earn-flow">
          <div>
            <Icon name="zap" size={18} />
            <span>Shift 2 kWh</span>
          </div>
          <ChevronRight size={14} />
          <div>
            <Sprout size={18} />
            <span>30 EcoPoints</span>
          </div>
          <ChevronRight size={14} />
          <div>
            <Icon name="coffee" size={18} />
            <span>Local reward</span>
          </div>
        </div>
        <ul className="earn-list">
          <li>
            <span>Delay AC 1.5 h on hot evenings</span>
            <b>+30</b>
          </li>
          <li>
            <span>Off-peak EV / e-bike charging (monthly)</span>
            <b>+150</b>
          </li>
          <li>
            <span>Peak Hero week (7 days under target)</span>
            <b>+500</b>
          </li>
        </ul>
      </div>

      <SectionTitle>{t('nearYou')}</SectionTitle>
      <p className="loc">
        <MapPin size={16} /> {state.profile.district} · Within 2 km <ChevronDown size={14} />
      </p>
      <div className="chips">
        {categories.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
            <Icon name={c.icon} size={16} />
            {c.label}
          </button>
        ))}
      </div>

      <div className="map-wrap">
        <div className="seg overlay-seg">
          <button className={view === 'map' ? 'on' : ''} onClick={() => setView('map')}>
            Map
          </button>
          <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>
            List
          </button>
        </div>
        {view === 'map' ? (
          <>
            <MapView list={list} selected={sel} onSelect={setSelected} />
            {sel && (
              <div className="map-card card">
                <span className="partner-img">{sel.img ? <img src={sel.img} alt="" /> : <Icon name={sel.icon} size={30} />}</span>
                <div>
                  <b>{sel.name}</b>
                  <span>{sel.offer}</span>
                  <small className="muted">
                    {sel.distance} · {sel.cofunded ? 'Partner co-funded' : 'Partner offer'}
                  </small>
                  <div className="map-card-foot">
                    <span>
                      <b>{sel.points}</b> points
                    </span>
                    <button className="btn small primary" onClick={() => push('PartnerDetail', { id: sel.id })}>
                      {t('viewReward')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="stack list-pad">
            {list.map((p) => (
              <PartnerCard key={p.id} p={p} onOpen={() => push('PartnerDetail', { id: p.id })} />
            ))}
          </div>
        )}
      </div>

      <Row
        icon={<Sprout size={22} strokeWidth={1.8} />}
        title={t('invest')}
        sub="Put spare points into illustrative solar & wind portfolios"
        onClick={() => push('Invest')}
        className="highlight"
      />
      <Row icon={<History size={22} strokeWidth={1.8} />} title="Points history" sub={`${state.ledger.length} entries`} onClick={() => push('Ledger')} />
      <p className="small muted center">Offers are clearly labelled. We never promote anything that increases your energy use.</p>
    </div>
  )
}
