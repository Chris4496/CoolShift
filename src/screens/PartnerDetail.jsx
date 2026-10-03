import { Clock, Lock, MapPin, Sparkles } from 'lucide-react'
import { Bubble, Icon, Page } from '../components/ui'
import { hkd } from '../calc'
import { partners } from '../data'
import { useStore } from '../store'

export default function PartnerDetail({ id }) {
  const { state, dispatch, t, pop, push, showToast } = useStore()
  const p = partners.find((x) => x.id === id)
  const enough = state.points >= p.points

  return (
    <Page title={p.name}>
      <div className="partner-hero">
        {p.img ? <img src={p.img} alt="" /> : <Icon name={p.icon} size={64} />}
        <span className="badge">{p.cofunded ? 'Partner co-funded offer' : 'Partner offer'}</span>
      </div>
      <h1 className="title">{p.offer}</h1>
      <div className="meta-list">
        <span>
          <MapPin size={16} /> {p.distance} away
        </span>
        <span>
          <Clock size={16} /> {p.window}
        </span>
        <span>
          <Sparkles size={16} /> Worth {hkd(p.value)}
        </span>
      </div>

      {p.hint && <Bubble>{p.hint}</Bubble>}

      <div className="card redeem-box">
        <div className="redeem-line">
          <span>Cost</span>
          <b>{p.points} EcoPoints</b>
        </div>
        <div className="redeem-line">
          <span>Your balance</span>
          <b>{state.points}</b>
        </div>
        {p.cofunded && (
          <p className="small muted">
            {p.name} tops up the difference: you pay {p.points} points ({hkd(p.points / 10)}) for a {hkd(p.value)} reward.
          </p>
        )}
        <button
          className="btn primary block"
          disabled={!enough}
          onClick={() => {
            dispatch({ type: 'redeem', partner: p })
            showToast(`Voucher added · ${p.name}`)
            pop()
            push('Vouchers')
          }}
        >
          {enough ? `${t('redeem')} for ${p.points} points` : `Need ${p.points - state.points} more points`}
        </button>
      </div>

      <div className="note">
        <Lock size={16} />
        <span>{p.name} only sees that a Cool Shift voucher was redeemed. Your usage data stays with CLP.</span>
      </div>
    </Page>
  )
}
