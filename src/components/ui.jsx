import {
  AirVent,
  Blinds,
  Building2,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  CloudSun,
  Coffee,
  Droplets,
  LayoutGrid,
  Leaf,
  Plug,
  Shield,
  Shirt,
  Snowflake,
  Sun,
  Thermometer,
  Ticket,
  Timer,
  Utensils,
  WashingMachine,
  Wrench,
  Zap,
} from 'lucide-react'
import { useStore } from '../store'
import Mascot from './Mascot'

const ICONS = {
  'air-vent': AirVent,
  blinds: Blinds,
  building: Building2,
  calendar: Calendar,
  car: Car,
  rain: CloudRain,
  'cloud-sun': CloudSun,
  coffee: Coffee,
  droplets: Droplets,
  grid: LayoutGrid,
  leaf: Leaf,
  plug: Plug,
  shield: Shield,
  shirt: Shirt,
  snowflake: Snowflake,
  sun: Sun,
  thermometer: Thermometer,
  ticket: Ticket,
  timer: Timer,
  utensils: Utensils,
  washing: WashingMachine,
  wrench: Wrench,
  zap: Zap,
}

export function Icon({ name, size = 20, ...rest }) {
  const C = ICONS[name] || Zap
  return <C size={size} strokeWidth={1.8} {...rest} />
}

export function Row({ icon, title, sub, right, onClick, className = '' }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`row card ${className}`} onClick={onClick}>
      {icon && <span className="row-icon">{typeof icon === 'string' ? <Icon name={icon} size={22} /> : icon}</span>}
      <span className="row-body">
        <span className="row-title">{title}</span>
        {sub && <span className="row-sub">{sub}</span>}
      </span>
      {right !== undefined ? right : onClick && <ChevronRight size={18} className="muted" />}
    </Tag>
  )
}

export function SectionTitle({ children, action, onAction }) {
  return (
    <div className="section-title">
      <h3>{children}</h3>
      {action && (
        <button className="link" onClick={onAction}>
          {action} <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

export function Page({ title, children, right }) {
  const { pop, t } = useStore()
  return (
    <div className="page">
      <header className="page-head">
        <button className="icon-btn" onClick={pop} aria-label={t('back')}>
          <ChevronLeft size={22} />
        </button>
        <span className="page-head-title">{title}</span>
        <span className="page-head-right">{right}</span>
      </header>
      <div className="page-body">{children}</div>
    </div>
  )
}

export function Progress({ value, max, dark }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={`progress ${dark ? 'dark' : ''}`}>
      <div style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  )
}

export function Bubble({ children, mood = 'happy', size = 56 }) {
  return (
    <div className="bubble-wrap">
      <Mascot mood={mood} size={size} className="bob" />
      <div className="bubble">{children}</div>
    </div>
  )
}

export function Sparkline({ data, color = '#12329a', height = 60, fill = true }) {
  const w = 300
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, height - 4 - ((v - min) / (max - min || 1)) * (height - 8)])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="sparkline" style={{ height }}>
      {fill && <path d={`${d} L${w},${height} L0,${height} Z`} fill={color} opacity="0.08" />}
      <path d={d} stroke={color} strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
