import { Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import Mascot from '../components/Mascot'
import { Toggle } from '../components/ui'
import { LANGS } from '../i18n'
import { useStore } from '../store'

function Choice({ options, value, onChange }) {
  return (
    <div className="seg wrap">
      {options.map((o) => (
        <button key={String(o.v)} className={o.v === value ? 'on' : ''} onClick={() => onChange(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  )
}

export default function Onboarding() {
  const { state, dispatch } = useStore()
  const [step, setStep] = useState(0)
  const [p, setP] = useState(state.profile)
  const set = (k) => (v) => setP((x) => ({ ...x, [k]: v }))
  const c = state.settings.consent

  return (
    <div className="onboard">
      <div className="dots">
        {[0, 1, 2].map((i) => (
          <i key={i} className={i <= step ? 'on' : ''} />
        ))}
      </div>

      {step === 0 && (
        <div className="onboard-step center">
          <Mascot mood="wave" size={150} className="bob" />
          <p className="eyebrow brand-eyebrow">
            Cool Shift <small>by CLP</small>
          </p>
          <h1>Hi, I'm Watt-son.</h1>
          <p className="lead">
            節能仔 · Your energy buddy. I read your smart meter, then give you three simple moves a day to stay cool, pay
            less and earn rewards around your neighbourhood.
          </p>
          <div className="seg">
            {LANGS.map((l) => (
              <button
                key={l.id}
                className={state.settings.lang === l.id ? 'on' : ''}
                onClick={() => dispatch({ type: 'setting', key: 'lang', value: l.id })}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="btn primary block lg" onClick={() => setStep(1)}>
            Let's start
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="onboard-step">
          <h2>Tell me about your home</h2>
          <p className="muted">Four quick questions so my tips fit your flat, not a generic one.</p>
          <label className="field">
            <span>Your name</span>
            <input value={p.name} onChange={(e) => set('name')(e.target.value)} />
          </label>
          <div className="field">
            <span>Flat size</span>
            <Choice
              value={p.flat}
              onChange={set('flat')}
              options={['< 300 sq ft', '450 sq ft', '700 sq ft', '1,000+ sq ft'].map((v) => ({ v, l: v }))}
            />
          </div>
          <div className="field">
            <span>People at home</span>
            <Choice value={p.people} onChange={set('people')} options={[1, 2, 3, 4, 5].map((v) => ({ v, l: v === 5 ? '5+' : v }))} />
          </div>
          <div className="field">
            <span>Air conditioners</span>
            <Choice value={p.acUnits} onChange={set('acUnits')} options={[1, 2, 3, 4].map((v) => ({ v, l: v === 4 ? '4+' : v }))} />
          </div>
          <div className="field toggles">
            <label>
              <span>I charge an EV at home</span>
              <Toggle checked={p.ev} onChange={set('ev')} />
            </label>
            <label>
              <span>I charge an e-bike or scooter</span>
              <Toggle checked={p.ebike} onChange={set('ebike')} />
            </label>
            <label>
              <span>Someone elderly or unwell lives here</span>
              <Toggle checked={p.elderly} onChange={set('elderly')} />
            </label>
            <label>
              <span>I look after a relative's home</span>
              <Toggle checked={p.caregiver} onChange={set('caregiver')} />
            </label>
          </div>
          <button className="btn primary block lg" onClick={() => setStep(2)}>
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="onboard-step">
          <ShieldCheck size={40} />
          <h2>You stay in control</h2>
          <p className="muted">Everything is opt-in. You can change this any time in Settings.</p>
          <div className="field toggles">
            <label>
              <span>
                Use my smart-meter data for tips
                <small>Half-hourly readings, kept by CLP only</small>
              </span>
              <Toggle checked={c.meter} onChange={(v) => dispatch({ type: 'consent', key: 'meter', value: v })} />
            </label>
            <label>
              <span>
                Join my estate's saving challenge
                <small>Only anonymous block totals are shown</small>
              </span>
              <Toggle checked={c.community} onChange={(v) => dispatch({ type: 'consent', key: 'community', value: v })} />
            </label>
            <label>
              <span>
                Show partner offers relevant to my home
                <small>Matching happens inside CLP</small>
              </span>
              <Toggle
                checked={c.personalisedOffers}
                onChange={(v) => dispatch({ type: 'consent', key: 'personalisedOffers', value: v })}
              />
            </label>
          </div>
          <div className="note">
            <Lock size={16} />
            <span>No household data is ever shared with partners. They only see that a voucher was redeemed.</span>
          </div>
          <button className="btn primary block lg" onClick={() => dispatch({ type: 'onboard', profile: p })}>
            Meet my home
          </button>
        </div>
      )}
    </div>
  )
}
