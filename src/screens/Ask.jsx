import { Calendar, Car, ChevronRight, FileText, Info, Leaf, Mic, Send, Snowflake, WashingMachine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Mascot from '../components/Mascot'
import { evSaving, fmtRange, hkd, range, shiftSaving, TARIFF } from '../calc'
import { bill, tipLibrary, weather } from '../data'
import { LANGS, pick } from '../i18n'
import { useStore } from '../store'

const ev = evSaving({ sessionKwh: 14 })
const ac = tipLibrary.find((x) => x.id === 'ac-setpoint')

function answer(q, ctx) {
  const s = q.toLowerCase()
  const { vulnerable, profile, points } = ctx
  const setC = vulnerable ? '25°C' : '25.5°C'

  if (/bill|higher|rise|went up|go up|expensive|貴|贵|電費|电费/.test(s)) {
    return {
      text: {
        en: `Your bill is heading to ${hkd(bill.projected)}, up ${hkd(bill.projected - bill.lastPeriod)}. Warmer evenings added ${hkd(118)} of cooling, charging your EV at 6–9 PM added ${hkd(41)}, and extra dryer cycles ${hkd(15)}.`,
        hk: `今期電費預計 ${hkd(bill.projected)}，貴咗 ${hkd(bill.projected - bill.lastPeriod)}。天氣熱咗令冷氣多用 ${hkd(118)}，傍晚6至9點充電多咗 ${hkd(41)}，乾衣機多用 ${hkd(15)}。`,
        cn: `本期电费预计 ${hkd(bill.projected)}，涨了 ${hkd(bill.projected - bill.lastPeriod)}。天气变热令空调多用 ${hkd(118)}，傍晚6至9点充电多了 ${hkd(41)}，烘干机多用 ${hkd(15)}。`,
      },
      action: { label: 'See full breakdown', screen: 'Bill' },
      calc: 'Compared half-hourly meter data across the two bill periods, priced at the pilot tariff.',
    }
  }
  if (/\bev\b|charg|\bcar\b|e-bike|scooter|充電|充电|電車|电车/.test(s)) {
    return {
      text: {
        en: `Plug in as usual, but schedule the start for 11 PM. You'll be at 80% by 7 AM and save about ${fmtRange(range(ev.hkd))} per session, roughly ${hkd(ev.hkd * 3.2)} a month. It also takes ${ev.kwh} kWh off the evening peak.`,
        hk: `照常插電，但預約晚上11點先開始充。朝早7點已經有80%，每次慳大約 ${fmtRange(range(ev.hkd))}，每月約 ${hkd(ev.hkd * 3.2)}，仲幫電網減輕傍晚高峰。`,
        cn: `照常插电，但预约晚上11点开始充。早上7点已有80%，每次省约 ${fmtRange(range(ev.hkd))}，每月约 ${hkd(ev.hkd * 3.2)}，还帮电网减轻傍晚高峰。`,
      },
      plan: [{ icon: Car, title: 'EV charging', sub: '11:00 PM – 7:00 AM · 80% target' }],
      calc: `${ev.kwh} kWh × (HK$${TARIFF.peak} peak − HK$${TARIFF.offPeak} off-peak) = ${hkd(ev.hkd, 2)} per session.`,
    }
  }
  if (/wash|dry|laundry|洗衣|乾衣|烘/.test(s)) {
    const w = shiftSaving(1.6)
    return {
      text: {
        en: `Use the delay timer so it runs after 11 PM and finishes by 7 AM. Same clean clothes, about ${fmtRange(range(w), 2)} less per load. On humid days, a heat-pump dryer uses about half the energy of yours.`,
        hk: `用預約功能，11點後先開始，7點前洗完。每次慳約 ${fmtRange(range(w), 2)}。潮濕天用熱泵乾衣機可以慳一半電。`,
        cn: `用预约功能，11点后开始，7点前洗完。每次省约 ${fmtRange(range(w), 2)}。潮湿天用热泵烘干机可省一半电。`,
      },
      plan: [{ icon: WashingMachine, title: 'Washer-dryer', sub: 'Start 11:30 PM · done by 6:30 AM' }],
      calc: `1.6 kWh × HK$${(TARIFF.peak - TARIFF.offPeak).toFixed(2)} peak/off-peak difference.`,
    }
  }
  if (/cool|\bac\b|air ?con|hot|tonight|plan|6 ?pm|home at|冷氣|空调|熱|热/.test(s)) {
    return {
      text: vulnerable
        ? {
            en: `It's ${weather.tempC}°C and a hot-weather warning is on, so comfort and safety come first. Keep the AC at ${setC} and use Dry mode for the first hour. That saves energy without making the room warmer.`,
            hk: `今日${weather.tempC}°C，酷熱天氣警告生效，安全第一。冷氣保持${setC}，首小時用抽濕模式，慳電之餘唔會熱。`,
            cn: `今天${weather.tempC}°C，酷热天气警告生效，安全第一。空调保持${setC}，首小时用除湿模式，省电又不会热。`,
          }
        : {
            en: `Of course. Start cooling when you arrive. Try ${setC} and a fan if it feels comfortable. At ${weather.humidity}% humidity, Dry mode for the first 30 minutes helps too.`,
            hk: `當然可以！返到屋企先開冷氣，試吓${setC}加風扇。濕度${weather.humidity}%，頭30分鐘用抽濕模式更舒服。`,
            cn: `当然可以！到家再开空调，试试${setC}加风扇。湿度${weather.humidity}%，前30分钟用除湿模式更舒服。`,
          },
      img: '/img/fan.jpg',
      plan: [
        { icon: Snowflake, title: 'Cooling', sub: `6:00 PM – ${setC}` },
        ...(profile.ev ? [{ icon: Car, title: 'EV charging', sub: '11:00 PM · 80% target' }] : []),
      ],
      calc: vulnerable
        ? 'Cooling is never reduced during hot-weather warnings or for vulnerable households.'
        : `${ac.why} EV: ${ev.kwh} kWh moved to off-peak saves ${hkd(ev.hkd, 2)}.`,
    }
  }
  if (/save|comfort|tip|cheap|慳|省/.test(s)) {
    return {
      text: {
        en: `Three moves that fit your home today: cool at ${setC} with a fan, charge the EV after 11 PM, and run the washer late. Together about ${hkd(1.2 + ev.hkd + shiftSaving(1.6), 1)} today, with no loss of comfort.`,
        hk: `今日最啱你嘅三件事：冷氣${setC}加風扇、11點後充電、夜晚先洗衫。今日合共慳約 ${hkd(1.2 + ev.hkd + shiftSaving(1.6), 1)}，一樣咁舒服。`,
        cn: `今天最适合你的三件事：空调${setC}加风扇、11点后充电、晚上再洗衣。今天合计省约 ${hkd(1.2 + ev.hkd + shiftSaving(1.6), 1)}，一样舒服。`,
      },
      action: { label: "See today's moves", tab: 'home' },
    }
  }
  if (/point|reward|coffee|voucher|積分|积分|獎|奖/.test(s)) {
    return {
      text: {
        en: `You have ${points} EcoPoints (worth ${hkd(points / 10)}). Pacific Coffee is 180 m away: 100 points gets HK$10 off an iced drink between 6 and 9 PM, perfect while your AC rests.`,
        hk: `你有 ${points} 環保積分（值 ${hkd(points / 10)}）。180米外嘅 Pacific Coffee，晚上6至9點用100分換HK$10凍飲折扣。`,
        cn: `你有 ${points} 环保积分（值 ${hkd(points / 10)}）。180米外的 Pacific Coffee，晚上6至9点用100分换HK$10冷饮折扣。`,
      },
      action: { label: 'Explore rewards', tab: 'rewards' },
    }
  }
  if (/invest|stock|fund|green|投資|投资|股/.test(s)) {
    return {
      text: {
        en: 'You can put spare EcoPoints into illustrative clean-energy portfolios, from HK rooftop solar to Asia wind. Start from 100 points.',
        hk: '你可以將積分投資喺潔淨能源組合，例如香港天台太陽能、亞洲風電，100分起。',
        cn: '你可以把积分投资到清洁能源组合，例如香港屋顶太阳能、亚洲风电，100分起。',
      },
      action: { label: 'Open Green Growth', screen: 'Invest' },
    }
  }
  if (/estate|neighbou?r|block|building|community|屋苑|鄰居|邻居/.test(s)) {
    return {
      text: {
        en: `${profile.estate} has saved 3,420 kWh of its 5,000 kWh summer goal, and that has already funded 68 fans for elderly neighbours. ${profile.block} is in 2nd place.`,
        hk: `${profile.estate} 今個夏天已慳 3,420 度電（目標5,000度），已資助68把風扇送畀長者街坊。`,
        cn: `${profile.estate} 今年夏天已节省 3,420 度电（目标5,000度），已资助68台风扇送给长者邻居。`,
      },
      action: { label: 'See estate', tab: 'community' },
    }
  }
  if (/mum|mom|mother|parent|elderly|媽|妈|老人|長者|长者/.test(s)) {
    return {
      text: {
        en: "Mum's home looks normal today: the AC is on at 26°C and her morning routine was detected at 8:12 AM. I'll alert you if there's no activity by 10 AM or her AC is off during a heat warning.",
        hk: '媽媽屋企今日一切正常：冷氣26°C開緊，朝早8:12有活動。如果10點前冇活動，或者酷熱時冷氣熄咗，我會通知你。',
        cn: '妈妈家今天一切正常：空调26°C开着，早上8:12有活动。如果10点前没有活动，或酷热时空调关了，我会通知你。',
      },
      action: { label: 'Open caregiver view', screen: 'Caregiver' },
    }
  }
  return {
    text: {
      en: 'I can explain your bill, plan cooling and charging, or find rewards nearby. Try "Why is my bill higher?" or "Plan tonight".',
      hk: '我可以解釋電費、安排冷氣同充電時間，或者搵附近獎賞。試吓問「點解電費貴咗？」',
      cn: '我可以解释电费、安排空调和充电时间，或者找附近奖赏。试试问「为什么电费涨了？」',
    },
  }
}

const SUGGESTIONS = [
  { icon: FileText, label: { en: 'Why is my bill higher?', hk: '點解電費貴咗？', cn: '为什么电费涨了？' } },
  { icon: Leaf, label: { en: 'Save without losing comfort', hk: '點樣慳電又舒服？', cn: '怎样省电又舒服？' } },
  { icon: Calendar, label: { en: 'Plan tonight', hk: '安排今晚', cn: '安排今晚' } },
]

let history = []

function PlanCard({ msg }) {
  const { dispatch, showToast, t } = useStore()
  const [open, setOpen] = useState(false)
  const [used, setUsed] = useState(false)
  return (
    <div className="card plan">
      <b>A plan that fits you</b>
      {msg.plan.map((p) => (
        <div className="plan-row" key={p.title}>
          <p.icon size={22} strokeWidth={1.8} />
          <span>
            <b>{p.title}</b>
            <small>{p.sub}</small>
          </span>
          <ChevronRight size={16} className="muted" />
        </div>
      ))}
      {msg.calc && (
        <button className="calc-link" onClick={() => setOpen(!open)}>
          <Info size={14} /> How this plan was calculated <ChevronRight size={14} className={`chev ${open ? 'open' : ''}`} />
        </button>
      )}
      {open && <p className="small muted calc">{msg.calc}</p>}
      <button
        className="btn primary block"
        disabled={used}
        onClick={() => {
          dispatch({ type: 'applyPlan', plan: { items: msg.plan.map((p) => p.title) } })
          setUsed(true)
          showToast('Plan scheduled · +20 EcoPoints')
        }}
      >
        {used ? 'Scheduled ✓' : t('usePlan')}
      </button>
    </div>
  )
}

export default function Ask() {
  const { state, t, lang, push, go, vulnerable, pendingQ, setPendingQ } = useStore()
  const [msgs, setMsgs] = useState(history)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    history = msgs
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs, typing])

  const send = (q) => {
    if (!q.trim()) return
    setMsgs((m) => [...m, { from: 'me', text: q }])
    setInput('')
    setTyping(true)
    const a = answer(q, { vulnerable, profile: state.profile, points: state.points })
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', ...a }])
    }, 750)
  }

  useEffect(() => {
    if (pendingQ) {
      send(pendingQ.q)
      setPendingQ(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQ])

  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  const listen = () => {
    if (!SR) {
      send(pick(lang, SUGGESTIONS[2].label))
      return
    }
    const r = new SR()
    r.lang = LANGS.find((l) => l.id === lang).speech
    r.onresult = (e) => send(e.results[0][0].transcript)
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    setListening(true)
    r.start()
  }

  return (
    <div className="ask">
      <header className="ask-head">
        <Mascot size={44} />
        <div>
          <b>{t('askCS')}</b>
          <span className="badge soft">Watt-son · your energy assistant</span>
        </div>
      </header>

      {msgs.length === 0 && <h1 className="title">{t('makeItWork')}</h1>}

      <div className="suggest">
        {SUGGESTIONS.map((s) => (
          <button key={s.label.en} className="card" onClick={() => send(pick(lang, s.label))}>
            <s.icon size={20} strokeWidth={1.7} />
            <span>{pick(lang, s.label)}</span>
          </button>
        ))}
      </div>

      <div className="chat">
        {msgs.map((m, i) =>
          m.from === 'me' ? (
            <div key={i} className="msg me">
              <span>{m.text}</span>
            </div>
          ) : (
            <div key={i} className="msg bot">
              <Mascot size={30} />
              <div className="bot-col">
                <div className={`bot-bubble ${m.img ? 'with-img' : ''}`}>
                  <span>{pick(lang, m.text)}</span>
                  {m.img && <img src={m.img} alt="" />}
                </div>
                {m.plan && <PlanCard msg={m} />}
                {!m.plan && m.calc && <p className="small muted calc">ⓘ {m.calc}</p>}
                {m.action && (
                  <button
                    className="btn small ghost"
                    onClick={() => (m.action.screen ? push(m.action.screen) : go(m.action.tab))}
                  >
                    {m.action.label} <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ),
        )}
        {typing && (
          <div className="msg bot">
            <Mascot size={30} />
            <div className="typing">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('askPlaceholder')} />
        <button type="button" className={`icon-btn ${listening ? 'listening' : ''}`} onClick={listen} aria-label="Voice input">
          <Mic size={20} />
        </button>
        <button type="submit" className="send" aria-label="Send">
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
