export const LANGS = [
  { id: 'en', label: 'English', short: 'EN', speech: 'en-HK' },
  { id: 'hk', label: '廣東話', short: '粵', speech: 'zh-HK' },
  { id: 'cn', label: '普通话', short: '普', speech: 'zh-CN' },
]

const dict = {
  home: { en: 'Home', hk: '主頁', cn: '主页' },
  insights: { en: 'Insights', hk: '用電分析', cn: '用电分析' },
  ask: { en: 'Ask', hk: '問我', cn: '问我' },
  rewards: { en: 'Rewards', hk: '獎賞', cn: '奖赏' },
  community: { en: 'Estate', hk: '屋苑', cn: '屋苑' },
  hi: { en: 'Hi', hk: '你好', cn: '你好' },
  tagline: { en: "Let's make today feel better.", hk: '今日都要舒舒服服。', cn: '今天也要舒舒服服。' },
  humidity: { en: 'Humidity', hk: '濕度', cn: '湿度' },
  comfort: { en: 'Comfort,', hk: '舒適，', cn: '舒适，' },
  lessEnergy: { en: 'with less energy', hk: '更慳電', cn: '更省电' },
  suggested: { en: 'Your suggested setting', hk: '建議設定', cn: '建议设定' },
  nextMoves: { en: 'Your next moves', hk: '今日三件事', cn: '今日三件事' },
  tipsLeft: { en: 'tips today', hk: '個貼士', cn: '个建议' },
  done: { en: 'Done', hk: '完成', cn: '完成' },
  doIt: { en: "I'll do it", hk: '我會做', cn: '我会做' },
  impact: { en: 'Your impact this summer', hk: '今個夏天你的貢獻', cn: '今年夏天你的贡献' },
  saved: { en: 'shifted or saved', hk: '已轉移或節省', cn: '已转移或节省' },
  budget: { en: 'Bill budget', hk: '電費預算', cn: '电费预算' },
  yesterday: { en: "Yesterday's electricity use", hk: '昨日用電量', cn: '昨日用电量' },
  seeWhere: { en: 'See where it goes.', hk: '電用咗去邊？', cn: '电用到哪里？' },
  whyBill: { en: 'Why did my bill rise?', hk: '點解電費貴咗？', cn: '为什么电费涨了？' },
  askCS: { en: 'Ask Cool Shift', hk: '問 Cool Shift', cn: '问 Cool Shift' },
  makeItWork: { en: "Let's make it work for you.", hk: '一齊搵最適合你嘅方法。', cn: '一起找最适合你的方法。' },
  askPlaceholder: { en: 'Ask about your home…', hk: '問吓你屋企用電…', cn: '问问你家的用电…' },
  goodHabits: { en: 'Good habits, rewarded.', hk: '好習慣，有獎賞。', cn: '好习惯，有奖赏。' },
  pointsAvail: { en: 'EcoPoints available', hk: '可用環保積分', cn: '可用环保积分' },
  mission: { en: "This week's missions", hk: '本週任務', cn: '本周任务' },
  nearYou: { en: 'Rewards near you', hk: '附近獎賞', cn: '附近奖赏' },
  myVouchers: { en: 'My vouchers', hk: '我的禮券', cn: '我的礼券' },
  invest: { en: 'Grow points in clean energy', hk: '用積分投資潔淨能源', cn: '用积分投资清洁能源' },
  viewReward: { en: 'View reward', hk: '查看獎賞', cn: '查看奖赏' },
  redeem: { en: 'Redeem', hk: '換領', cn: '兑换' },
  settings: { en: 'Settings', hk: '設定', cn: '设置' },
  language: { en: 'Language', hk: '語言', cn: '语言' },
  simpleMode: { en: 'Large text simple mode', hk: '大字簡易模式', cn: '大字简易模式' },
  caregiver: { en: 'Caregiver view', hk: '照顧者模式', cn: '照顾者模式' },
  heatWarning: { en: 'Very Hot Weather Warning', hk: '酷熱天氣警告', cn: '酷热天气警告' },
  usePlan: { en: 'Use this plan', hk: '用呢個計劃', cn: '使用这个计划' },
  together: { en: 'Saving together', hk: '一齊慳電', cn: '一起节电' },
  greatJob: { en: 'Nice one!', hk: '做得好！', cn: '做得好！' },
  close: { en: 'Close', hk: '關閉', cn: '关闭' },
  back: { en: 'Back', hk: '返回', cn: '返回' },
  simpleCool: { en: 'Stay cool', hk: '保持涼快', cn: '保持凉快' },
  simpleBill: { en: 'My bill', hk: '我的電費', cn: '我的电费' },
  simpleHelp: { en: 'Call family', hk: '致電家人', cn: '致电家人' },
}

export function translate(lang, key) {
  const e = dict[key]
  if (!e) return key
  return e[lang] || e.en
}

export const pick = (lang, v) => (v && typeof v === 'object' ? v[lang] || v.en : v)

export const mascotLines = {
  morning: {
    en: "It's hot outside! Shift your AC to 7:30 PM, pop down to Pacific Coffee and use 100 EcoPoints for a HK$10 iced drink.",
    hk: '出面好熱呀！冷氣延到7:30先開，落樓下 Pacific Coffee 用100積分換杯HK$10凍飲啦！',
    cn: '外面好热！空调推迟到7:30再开，下楼去 Pacific Coffee 用100积分换一杯HK$10冷饮吧！',
  },
  heat: {
    en: 'Very hot today. Please keep your AC on and drink water. I paused any tip that reduces cooling.',
    hk: '今日酷熱，記得開冷氣同飲水。我已暫停所有減少冷氣嘅建議。',
    cn: '今天酷热，记得开空调和多喝水。我已暂停所有减少空调的建议。',
  },
  allDone: {
    en: "All three done today. You're a Peak Hero! Your block thanks you.",
    hk: '今日三件事全部完成，你係用電高峰英雄！全座街坊多謝你。',
    cn: '今天三件事全部完成，你是用电高峰英雄！整栋邻居谢谢你。',
  },
}
