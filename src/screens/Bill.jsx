import { Calculator, MessageSquare } from 'lucide-react'
import { Bubble, Icon, Page } from '../components/ui'
import { hkd, TARIFF } from '../calc'
import { bill } from '../data'
import { useStore } from '../store'

export default function Bill() {
  const { ask, t } = useStore()
  const diff = bill.projected - bill.lastPeriod
  const max = bill.projected
  let running = bill.lastPeriod

  return (
    <Page title={t('whyBill')}>
      <p className="eyebrow">Bill period {bill.period}</p>
      <h1 className="title">
        Up {hkd(diff)}, <br />
        mostly from the heat.
      </h1>
      <Bubble>
        Your bill is heading to {hkd(bill.projected)} vs {hkd(bill.lastPeriod)} last time. About two-thirds is warmer
        evenings. The EV part is the easiest to fix: just charge after 11 PM.
      </Bubble>

      <div className="card waterfall">
        <div className="wf-row">
          <span>Last bill</span>
          <div className="wf-track">
            <div className="wf-bar base" style={{ width: `${(bill.lastPeriod / max) * 100}%` }} />
          </div>
          <b>{hkd(bill.lastPeriod)}</b>
        </div>
        {bill.drivers.map((d) => {
          const left = (running / max) * 100
          running += d.hkd
          return (
            <div className="wf-row" key={d.key}>
              <span>{d.label}</span>
              <div className="wf-track">
                <div className="wf-bar up" style={{ marginLeft: `${left}%`, width: `${(d.hkd / max) * 100}%` }} />
              </div>
              <b>+{hkd(d.hkd)}</b>
            </div>
          )
        })}
        <div className="wf-row total">
          <span>This bill (projected)</span>
          <div className="wf-track">
            <div className="wf-bar base dark" style={{ width: '100%' }} />
          </div>
          <b>{hkd(bill.projected)}</b>
        </div>
      </div>

      <div className="stack">
        {bill.drivers.map((d) => (
          <div className="card driver" key={d.key}>
            <span className="row-icon">
              <Icon name={d.icon} size={22} />
            </span>
            <div>
              <b>
                {d.label} · +{hkd(d.hkd)}
              </b>
              <p className="small muted">{d.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card how">
        <Calculator size={20} />
        <div className="small">
          <b>How this was calculated</b>
          <p className="muted">
            We compared your half-hourly smart-meter readings for this period with the last one, matched each change to
            appliance signatures and Hong Kong Observatory temperatures, then priced it at the pilot tariff (peak HK$
            {TARIFF.peak}, off-peak HK${TARIFF.offPeak} per kWh). The assistant only explains these numbers; it never
            invents them.
          </p>
        </div>
      </div>

      <button className="btn primary block" onClick={() => ask('How can I charge my EV without adding to the peak?')}>
        <MessageSquare size={18} /> Fix the EV part with Watt-son
      </button>
    </Page>
  )
}
