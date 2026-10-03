import { BellRing, HandCoins } from 'lucide-react'
import { useState } from 'react'
import { Bubble, Page, Progress, Toggle } from '../components/ui'
import { hkd } from '../calc'
import { bill } from '../data'
import { useStore } from '../store'

export default function Budget() {
  const { state, dispatch, t, showToast } = useStore()
  const [value, setValue] = useState(state.budget)
  const [at80, setAt80] = useState(true)
  const daysLeft = bill.daysTotal - bill.daysElapsed
  const remaining = value - bill.spentSoFar
  const perDay = remaining / daysLeft
  const over = bill.projected > value

  return (
    <Page title={t('budget')}>
      <p className="eyebrow">Bill period {bill.period}</p>
      <h1 className="title">Set a limit that helps you.</h1>

      <div className="card budget-set">
        <div className="budget-value">{hkd(value)}</div>
        <span className="muted small">per bi-monthly bill</span>
        <input
          type="range"
          min={500}
          max={2000}
          step={50}
          value={value}
          onChange={(e) => setValue(+e.target.value)}
          aria-label="Budget"
        />
        <div className="budget-line">
          <span>Spent so far {hkd(bill.spentSoFar)}</span>
          <span>{daysLeft} days left</span>
        </div>
        <Progress value={bill.spentSoFar} max={value} />
        <div className="budget-split">
          <div>
            <b>{hkd(bill.projected)}</b>
            <span>projected</span>
          </div>
          <div>
            <b className={remaining < 0 ? 'warn' : ''}>{remaining > 0 ? hkd(perDay, 1) : 'HK$0'}</b>
            <span>per day to stay on budget</span>
          </div>
        </div>
        <button
          className="btn primary block"
          onClick={() => {
            dispatch({ type: 'budget', value })
            showToast(`Budget saved: ${hkd(value)}`)
          }}
        >
          Save budget
        </button>
      </div>

      <Bubble mood={over ? 'hot' : 'happy'}>
        {over
          ? `At this pace you'll be ${hkd(bill.projected - value)} over. Charging the EV after 11 PM and using the washer late closes about ${hkd(38)} of that gap.`
          : `Nice, you're on track with ${hkd(value - bill.projected)} to spare. I'll nudge you if a hot spell changes that.`}
      </Bubble>

      <div className="card toggles">
        <label>
          <span>
            <BellRing size={16} /> Alert me at 80% of budget
          </span>
          <Toggle checked={at80} onChange={setAt80} />
        </label>
        <label>
          <span>Weekly budget check-in</span>
          <Toggle
            checked={state.settings.budgetAlerts}
            onChange={(v) => dispatch({ type: 'setting', key: 'budgetAlerts', value: v })}
          />
        </label>
      </div>

      <div className="card how">
        <HandCoins size={20} />
        <div className="small">
          <b>Need a hand with bills?</b>
          <p className="muted">
            Households on a tight budget can check eligibility for CLP's community support schemes and government
            electricity subsidies. Cooling advice never goes below a safe comfort level to hit a budget.
          </p>
        </div>
      </div>
    </Page>
  )
}
