import { CheckCircle2, ShieldAlert } from 'lucide-react'
import { Page, Progress, SectionTitle } from '../components/ui'
import { hkd } from '../calc'
import { partners, pilot } from '../data'

function PeakChart() {
  const all = [...pilot.peakTreatment, ...pilot.peakControl]
  const min = Math.min(...all) - 0.2
  const max = Math.max(...all) + 0.1
  const w = 300
  const h = 120
  const line = (arr) =>
    arr.map((v, i) => `${i ? 'L' : 'M'}${(i / (arr.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="line-chart" preserveAspectRatio="none">
      <path d={line(pilot.peakControl)} stroke="#a3a8b0" strokeWidth="2.5" fill="none" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
      <path d={line(pilot.peakTreatment)} stroke="#12329a" strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

const RISKS = [
  ['Privacy', 'Opt-in consent, data minimisation, no household data shared with partners.'],
  ['Wrong advice', 'Deterministic savings shown as ranges; human-reviewed tip library.'],
  ['Health', 'No cooling reductions during hot-weather warnings or for vulnerable users.'],
  ['Low engagement', 'Missions and a three-tip daily limit.'],
  ['Trust', 'Offers clearly labelled; none that increase energy use.'],
]

export default function Pilot() {
  const totalRev = pilot.partnerRevenue.reduce((a, r) => a + r.revenue, 0)
  const last = pilot.peakTreatment.length - 1
  return (
    <Page title="CLP pilot dashboard">
      <p className="eyebrow">
        Week {pilot.week} of {pilot.weeks} · Sha Tin pilot
      </p>
      <h1 className="title">Pilot on track.</h1>
      <Progress value={pilot.week} max={pilot.weeks} dark />
      <p className="small muted">
        {pilot.households.toLocaleString()} smart-meter households vs {pilot.control.toLocaleString()} matched control ·
        104 EV owners · 162 elderly residents · 11 partners
      </p>

      <div className="kpis">
        {pilot.kpis.map((k) => (
          <div key={k.id} className="card kpi">
            <span className="kpi-val">{k.value}</span>
            <span className="kpi-label">{k.label}</span>
            <small className="muted">
              <CheckCircle2 size={12} /> {k.target}
            </small>
          </div>
        ))}
      </div>

      <SectionTitle>Evening peak (4–11 PM) per household</SectionTitle>
      <div className="card">
        <PeakChart />
        <div className="pill-row">
          <span className="legend">
            <i className="peak" /> Cool Shift {pilot.peakTreatment[last]} kWh
          </span>
          <span className="legend">
            <i className="ctrl" /> Control {pilot.peakControl[last]} kWh
          </span>
        </div>
      </div>

      <SectionTitle>EV charging start time</SectionTitle>
      <div className="card ev-shift">
        {pilot.evByHour.map((r) => (
          <div key={r.h} className="ev-row">
            <span>{r.h}</span>
            <div className="ev-bars">
              <span className="before" style={{ width: `${r.before}%` }} />
              <span className="now" style={{ width: `${r.now}%` }} />
            </div>
            <b>{r.now}%</b>
          </div>
        ))}
        <p className="small muted">Grey: before pilot · Black: week {pilot.week}</p>
      </div>

      <SectionTitle>Cohorts</SectionTitle>
      <div className="card ledger">
        {pilot.cohorts.map((c) => (
          <div key={c.label} className="ledger-row">
            <span>
              <b>{c.label}</b>
              {c.note && <small className="muted">{c.note}</small>}
            </span>
            <b>{c.peak}</b>
          </div>
        ))}
      </div>

      <SectionTitle>Partner revenue to date</SectionTitle>
      <div className="card ledger">
        {pilot.partnerRevenue.map((r) => (
          <div key={r.tier} className="ledger-row">
            <span>
              <b>{r.tier}</b>
              <small className="muted">
                {r.partners} partners · {r.redemptions.toLocaleString()} redemptions
              </small>
            </span>
            <b>{hkd(r.revenue)}</b>
          </div>
        ))}
        <div className="ledger-row total">
          <span>
            <b>Total commission</b>
          </span>
          <b>{hkd(totalRev)}</b>
        </div>
      </div>

      <SectionTitle>Commission model (CLP internal)</SectionTitle>
      <div className="card ledger">
        {partners.map((p) => (
          <div key={p.id} className="ledger-row">
            <span>
              <b>{p.name}</b>
              <small className="muted">
                Tier {p.tier} · {p.offer}
              </small>
            </span>
            <small className="right">{p.commission}</small>
          </div>
        ))}
      </div>

      <SectionTitle>Risks & mitigations</SectionTitle>
      <div className="stack">
        {RISKS.map(([k, v]) => (
          <div key={k} className="card driver">
            <ShieldAlert size={20} />
            <div>
              <b>{k}</b>
              <p className="small muted">{v}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Route to scale</SectionTitle>
      <div className="timeline">
        {pilot.roadmap.map((r, i) => (
          <div key={r.phase} className={`tl ${i === 0 ? 'now' : ''}`}>
            <i />
            <div>
              <b>
                {r.phase} <small className="muted">· {r.when}</small>
              </b>
              <p className="small muted">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Page>
  )
}
