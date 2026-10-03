import { Info, Sun, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Bubble, Page, Sparkline } from '../components/ui'
import { hkd } from '../calc'
import { funds } from '../data'
import { useStore } from '../store'

const AMOUNTS = [100, 200, 500]

export default function Invest() {
  const { state, dispatch, showToast } = useStore()
  const [fundId, setFundId] = useState(funds[0].id)
  const [amt, setAmt] = useState(100)
  const fund = funds.find((f) => f.id === fundId)

  const holdings = funds
    .filter((f) => state.holdings[f.id])
    .map((f) => {
      const pts = state.holdings[f.id]
      const growth = f.series[f.series.length - 1] / f.series[f.series.length - 4]
      return { f, pts, value: (pts / 10) * growth }
    })
  const totalHkd = holdings.reduce((a, h) => a + h.value, 0)
  const watts = Math.round(totalHkd * 0.9)

  return (
    <Page title="Green Growth">
      <p className="eyebrow">Invest your EcoPoints</p>
      <h1 className="title">Grow points in clean energy.</h1>

      <div className="card dark invest-sum">
        <span>Your green portfolio</span>
        <b>{hkd(totalHkd, 2)}</b>
        <small>
          <Sun size={14} /> Helps fund ~{watts} W of new solar & wind capacity
        </small>
      </div>

      {holdings.length > 0 && (
        <div className="card ledger">
          {holdings.map((h) => (
            <div className="ledger-row" key={h.f.id}>
              <span>
                <b>{h.f.name}</b>
                <small className="muted">{h.pts} pts invested</small>
              </span>
              <b className="pos">{hkd(h.value, 2)}</b>
            </div>
          ))}
        </div>
      )}

      <div className="stack">
        {funds.map((f) => (
          <button key={f.id} className={`card fund ${fundId === f.id ? 'on' : ''}`} onClick={() => setFundId(f.id)}>
            <div className="fund-top">
              <span>
                <b>{f.name}</b>
                <small className="muted">
                  {f.tag} · {f.risk} risk
                </small>
              </span>
              <span className="fund-ret">
                <TrendingUp size={14} /> {f.ret}%
              </span>
            </div>
            <Sparkline data={f.series} color={f.color} height={44} />
          </button>
        ))}
      </div>

      <div className="card">
        <b>Invest in {fund.name}</b>
        <div className="seg">
          {AMOUNTS.map((a) => (
            <button key={a} className={amt === a ? 'on' : ''} onClick={() => setAmt(a)}>
              {a} pts
            </button>
          ))}
        </div>
        <p className="small muted">
          {amt} pts = {hkd(amt / 10)} · You have {state.points} pts
        </p>
        <button
          className="btn primary block"
          disabled={state.points < amt}
          onClick={() => {
            dispatch({ type: 'invest', fundId, fundName: fund.name, points: amt })
            showToast(`Invested ${amt} pts in ${fund.name}`)
          }}
        >
          {state.points < amt ? 'Not enough points' : `Invest ${amt} points`}
        </button>
      </div>

      <Bubble>Saving energy at home and backing clean power: that's a double win for Hong Kong.</Bubble>

      <div className="note">
        <Info size={16} />
        <span>
          Demo only. Portfolios and returns are illustrative, not investment advice. A live version would be run with an
          SFC-licensed partner, with clear risk disclosures.
        </span>
      </div>
    </Page>
  )
}
