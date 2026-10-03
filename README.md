# Cool Shift · CLP concept demo

An installable React PWA showing how CLP could connect smart-meter insights, daily tips, missions, local partner rewards and community saving into one customer journey. All data is illustrative; nothing connects to real meters.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (also exposed on your LAN for phones)
npm run build      # production build with service worker
npm run preview    # serve the build at http://localhost:4173
```

To install on a phone, open the preview URL over HTTPS (for example via a tunnel or any static host such as Vercel or Netlify) and choose "Add to Home Screen" / "Install app".

## What's in the demo

| Tab / screen | Shows |
| --- | --- |
| Onboarding | Watt-son (節能仔) intro, language choice, 4-question home profile, opt-in consent |
| Home | Weather and humidity, three daily tips with HKD ranges and points, smart AC-efficiency alert linked to a partner, impact (kWh, HKD, CO₂, trees), bill budget, caregiver card |
| Insights | Hourly smart-meter chart with the 4–11 PM peak, 14-day view against temperature, appliance breakdown, energy profile against similar homes |
| Bill explanation | Waterfall of why the bill rose, with "how this was calculated" |
| Budget | Set a bi-monthly limit, daily allowance, alerts |
| Ask | Watt-son chat (bill, cooling, EV, laundry, rewards, estate, invest, caregiver), plan cards, voice input in EN / 粵 / 普 |
| Rewards | EcoPoints (100 pts = HK$10), weekly missions, earning rules, partner map and list across 4 tiers, vouchers with QR |
| Green Growth | Invest points in illustrative clean-energy portfolios |
| Estate | Building savings goal, fans funded for elderly neighbours, block challenge, neighbour cheers |
| Caregiver | Elderly relative's home status and alerts |
| CLP pilot dashboard | Pilot KPIs against control group, EV shift, cohorts, partner revenue, commission model, risks, roadmap |

Settings (tap the avatar) has language, large-text simple mode, home profile, consent and demo controls, including **Simulate Very Hot Weather Warning**, which pauses any tip that reduces cooling.

## Design principles in code

- Every HKD figure comes from `src/calc.js` (deterministic, pilot tariff). The chat only phrases those numbers.
- Tips come from a reviewed library in `src/data.js`; `heatSafe: false` tips never show during heat warnings or for vulnerable households.
- At most three tips a day.
- Partner commission data is only shown in the CLP dashboard, never to customers.
