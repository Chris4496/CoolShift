import { Fan, Heart, Lock, Trophy, Users } from 'lucide-react'
import { Bubble, Progress, SectionTitle } from '../components/ui'
import { community } from '../data'
import { useStore } from '../store'

export default function Community() {
  const { state, dispatch, t } = useStore()
  const c = community
  const myShare = state.savedKwh
  const blocks = [...c.blocks].sort((a, b) => b.kwh / b.households - a.kwh / a.households)
  const maxWeek = Math.max(...c.weekly)

  if (!state.settings.consent.community) {
    return (
      <div className="empty">
        <Lock size={40} />
        <h2>{t('together')}</h2>
        <p className="muted">You've opted out of the estate challenge. Turn it on in Settings to see your building's total.</p>
        <button className="btn primary" onClick={() => dispatch({ type: 'consent', key: 'community', value: true })}>
          Join {c.estate}
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="eyebrow">{t('together')}</p>
      <h1 className="title">{c.estate}</h1>
      <p className="muted">
        <Users size={14} /> {c.participating} of {c.households} households taking part
      </p>

      <div className="card dark goal">
        <span>Summer goal</span>
        <b>
          {c.savedKwh.toLocaleString()} <small>/ {c.goalKwh.toLocaleString()} kWh</small>
        </b>
        <Progress value={c.savedKwh} max={c.goalKwh} />
        <div className="goal-foot">
          <Fan size={18} />
          <span>
            <b>{c.fansFunded} fans</b> funded for elderly neighbours so far
          </span>
        </div>
        <small className="muted-light">{c.reward}</small>
      </div>

      <div className="card mine">
        <Heart size={22} />
        <div>
          <b>Your home's share: {myShare.toFixed(1)} kWh</b>
          <p className="small muted">
            That's {((myShare / c.savedKwh) * 100).toFixed(1)}% of the estate total, from one flat. Thank you for caring.
          </p>
        </div>
      </div>

      <SectionTitle>Estate savings by week</SectionTitle>
      <div className="card">
        <div className="weekly">
          {c.weekly.map((v, i) => (
            <div key={i}>
              <span className="bar" style={{ height: `${(v / maxWeek) * 100}%` }} />
              <small>W{i + 4}</small>
            </div>
          ))}
        </div>
        <p className="small muted">The last week jumped after the Block A lobby lighting upgrade.</p>
      </div>

      <SectionTitle>Friendly block challenge</SectionTitle>
      <div className="card ledger">
        {blocks.map((b, i) => (
          <div key={b.name} className={`ledger-row ${b.mine ? 'me' : ''}`}>
            <span className="rank">{i === 0 ? <Trophy size={18} /> : i + 1}</span>
            <span>
              <b>
                {b.name} {b.mine && <small className="badge soft">You</small>}
              </b>
              <small className="muted">{b.households} homes taking part</small>
            </span>
            <b>{(b.kwh / b.households).toFixed(1)} kWh/home</b>
          </div>
        ))}
      </div>
      <p className="small muted">Ranked per home, so smaller blocks compete fairly.</p>

      <SectionTitle>Neighbourhood cheers</SectionTitle>
      <div className="stack">
        {c.feed.map((f, i) => {
          const cheered = state.cheered.includes(i)
          return (
            <div key={i} className="card feed">
              <div>
                <b>{f.who}</b> {f.what}
                <small className="muted">{f.when}</small>
              </div>
              <button
                className={`cheer ${cheered ? 'on' : ''}`}
                onClick={() => dispatch({ type: 'cheer', idx: i })}
                aria-label="Cheer"
              >
                <Heart size={16} fill={cheered ? 'currentColor' : 'none'} /> {f.cheers + (cheered ? 1 : 0)}
              </button>
            </div>
          )
        })}
      </div>

      <Bubble mood="cheer">
        Only 1,580 kWh to go! If every home in Block B charges after 11 PM this week, we'll get there by Friday.
      </Bubble>
      <p className="small muted center">
        <Lock size={12} /> Neighbours only see anonymous floor-level activity you choose to share.
      </p>
    </div>
  )
}
