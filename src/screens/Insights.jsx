import { ChevronRight, Lightbulb, Users } from 'lucide-react'
import { useState } from 'react'
import { Row, SectionTitle } from '../components/ui'
import { hkd, isPeakHour, TARIFF } from '../calc'
import { bill, breakdown, daily, hourly } from '../data'
import { useStore } from '../store'

function HourlyChart() {
  const max = Math.max(...hourly)
  return (
    <div className="chart">
      <div className="bars">
        {hourly.map((v, h) => (
          <div key={h} className="bar-col" title={`${h}:00 · ${v} kWh`}>
            <div className={`bar ${isPeakHour(h) ? 'peak' : ''}`} style={{ height: `${(v / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="axis">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>12 AM</span>
      </div>
    </div>
  )
}

function DailyChart() {
  const max = Math.max(...daily.map((d) => d.kwh))
  return (
    <div className="chart">
      <div className="bars">
        {daily.map((d) => (
          <div key={d.d} className="bar-col" title={`${d.d} · ${d.kwh} kWh · ${d.t}°C`}>
            <span className="bar-temp">{d.t}°</span>
            <div className={`bar ${d.t >= 31 ? 'peak' : ''} ${d.partial ? 'partial' : ''}`} style={{ height: `${(d.kwh / max) * 85}%` }} />
          </div>
        ))}
      </div>
      <div className="axis">
        <span>{daily[0].d}</span>
        <span>{daily[7].d}</span>
        <span>Today</span>
      </div>
    </div>
  )
}

export default function Insights() {
  const { t, push, ask, state } = useStore()
  const [view, setView] = useState('day')
  const total = hourly.reduce((a, b) => a + b, 0)
  const peak = hourly.reduce((a, v, h) => (isPeakHour(h) ? a + v : a), 0)
  const cost = hourly.reduce((a, v, h) => a + v * (isPeakHour(h) ? TARIFF.peak : h >= 23 || h < 7 ? TARIFF.offPeak : TARIFF.shoulder), 0)

  return (
    <div>
      <p className="eyebrow">Your energy</p>
      <h1 className="title">{t('seeWhere')}</h1>

      <div className="seg small-seg">
        <button className={view === 'day' ? 'on' : ''} onClick={() => setView('day')}>
          Yesterday
        </button>
        <button className={view === 'two' ? 'on' : ''} onClick={() => setView('two')}>
          14 days
        </button>
      </div>

      {view === 'day' ? (
        <>
          <p className="big-num">
            {total.toFixed(1)} <small>kWh</small>
          </p>
          <p className="muted">
            {t('yesterday')} · about {hkd(cost, 2)}
          </p>
          <HourlyChart />
          <div className="pill-row">
            <span className="legend">
              <i className="peak" /> Peak 4–11 PM
            </span>
            <span>
              Most energy used: <b>6–11 PM</b> · peak hours {Math.round((peak / total) * 100)}% of the day
            </span>
          </div>
        </>
      ) : (
        <>
          <p className="big-num">
            {(daily.reduce((a, d) => a + d.kwh, 0) / daily.length).toFixed(1)} <small>kWh / day</small>
          </p>
          <p className="muted">Daily use with the day's max temperature. Black bars are 31°C+ days.</p>
          <DailyChart />
        </>
      )}

      <div className="grid2">
        {breakdown.slice(0, 2).map((b) => (
          <button key={b.key} className="card cat" onClick={() => ask(b.key === 'cooling' ? 'How can I cool for less?' : 'When should I run my washing machine or dryer?')}>
            {b.img && <img src={b.img} alt="" />}
            <b>{b.label}</b>
            <span className="muted small">Estimated</span>
            <span className="cat-pct">
              {b.pct}% <ChevronRight size={16} />
            </span>
          </button>
        ))}
      </div>
      <Row icon={<Lightbulb size={22} strokeWidth={1.8} />} title="Lighting & always-on" sub="Estimated 18% · router, fridge, standby" right={<b>18%</b>} />

      <button className="card dark why" onClick={() => push('Bill')}>
        <Lightbulb size={26} />
        <div>
          <b>{t('whyBill')}</b>
          <p>
            Up {hkd(bill.projected - bill.lastPeriod)} vs last bill. Warmer evenings mean longer cooling.
          </p>
          <span className="btn small outline-light">
            See the breakdown <ChevronRight size={14} />
          </span>
        </div>
      </button>

      <SectionTitle>Your energy profile</SectionTitle>
      <div className="card profile-card">
        <div className="profile-tag">Evening cooler · EV at home</div>
        <p>
          Homes like yours ({state.profile.flat}, {state.profile.people} people, {state.profile.acUnits} ACs) use{' '}
          <b>11.6 kWh</b> a day. You use <b>12.8 kWh</b>, about 10% more, almost all between 7 and 10 PM.
        </p>
        <div className="compare">
          <div>
            <span style={{ width: '90%' }} />
            <small>Similar homes · 11.6</small>
          </div>
          <div className="me">
            <span style={{ width: '100%' }} />
            <small>You · 12.8</small>
          </div>
          <div className="best">
            <span style={{ width: '72%' }} />
            <small>Most efficient 20% · 9.2</small>
          </div>
        </div>
        <p className="small muted">
          <Users size={12} /> Learned from 8 weeks of your smart-meter data and your home profile.
        </p>
      </div>
    </div>
  )
}
