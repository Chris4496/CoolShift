import { Gift } from 'lucide-react'
import Mascot from '../components/Mascot'
import { Page } from '../components/ui'
import { partners } from '../data'
import { useStore } from '../store'

function FakeQR({ seed }) {
  const cells = []
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  for (let i = 0; i < 121; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    const x = i % 11
    const y = Math.floor(i / 11)
    const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7)
    if (finder || h % 3 === 0) cells.push([x, y])
  }
  return (
    <svg viewBox="-1 -1 13 13" className="qr">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#12329a" />
      ))}
    </svg>
  )
}

export default function Vouchers() {
  const { state, dispatch, go, t } = useStore()
  return (
    <Page title={t('myVouchers')}>
      {state.vouchers.length === 0 && (
        <div className="empty">
          <Mascot mood="wave" size={100} />
          <p>No vouchers yet. Complete today's moves and treat yourself.</p>
          <button className="btn primary" onClick={() => go('rewards')}>
            <Gift size={18} /> Browse rewards
          </button>
        </div>
      )}
      <div className="stack">
        {state.vouchers.map((v) => {
          const p = partners.find((x) => x.id === v.partnerId)
          return (
            <div key={v.id} className={`card voucher ${v.used ? 'used' : ''}`}>
              <div>
                <span className="badge outline">Partner offer</span>
                <b>{p.name}</b>
                <span>{p.offer}</span>
                <small className="muted">Valid {p.window} · Code {v.code}</small>
                {!v.used ? (
                  <button className="btn small primary" onClick={() => dispatch({ type: 'useVoucher', id: v.id })}>
                    Mark as used
                  </button>
                ) : (
                  <small>Used ✓</small>
                )}
              </div>
              <FakeQR seed={v.code} />
            </div>
          )
        })}
      </div>
    </Page>
  )
}
