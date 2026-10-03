import { Page } from '../components/ui'
import { useStore } from '../store'

export default function Ledger() {
  const { state } = useStore()
  return (
    <Page title="Points history">
      <p className="big-num">
        {state.points} <small>EcoPoints</small>
      </p>
      <div className="card ledger">
        {state.ledger.map((l) => (
          <div key={l.id} className="ledger-row">
            <span>
              <b>{l.label}</b>
              <small className="muted">{l.when}</small>
            </span>
            <b className={l.pts > 0 ? 'pos' : ''}>
              {l.pts > 0 ? '+' : ''}
              {l.pts}
            </b>
          </div>
        ))}
      </div>
    </Page>
  )
}
