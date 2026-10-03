# ⚡ Cool Shift · Powered by CLP

**Small actions. Everyday value.**
A hackathon MVP for CLP: a personal AI energy assistant for Hong Kong households.
Branded in CLP blue / navy / orange with the ⚡ lockup and “Powered by CLP” endorsement.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000        → the app (renders as a phone, max-width 430px)
# open http://localhost:3000/pitch  → the pitch deck (12 slides, ← → keys)
```

Production check: `npm run build` (passes clean, fully static).

## What's inside

| Route | Feature | Brief area |
|---|---|---|
| `/` | Home — greeting, weather/humidity, 3 daily tips with HK$ savings | Energy insights |
| `/insights` | Yesterday's kWh, hourly chart vs peak tariff, breakdown, bill explainer, budget pace, peer comparison | Energy insights |
| `/ask` | Chat assistant — bill breakdown card, tonight's plan with "how this was calculated", **live mission/challenge check-ins** (reads real app state), quick chips, voice affordance | Energy insights / Dialogue |
| `/cooling` | 25.5°C comfort-first plan, safety guardrails, transparent reasoning | Smart home |
| `/charging` | **EV car infographic** (58 kWh sedan, cable + wallbox), target slider, off-peak schedule 11 PM–7 AM, per-charge saving | E-mobility |
| `/budget` | Monthly budget slider, pace bar, 50/80/100% alerts, daily allowance | Inclusive journeys |
| `/impact` | Personal impact, Block 7 community goal, anonymised leaderboard, group challenge | Social harmony |
| `/rewards` | Points, missions with check-ins, partner offer map/list, redeem flow, **clean-energy point investing** | Partner platforms |
| `/pitch` | 12-slide pitch deck (business value, pilot, risks, scale) | Presentation |

## The five customer questions (acceptance criteria)

1. *Why is my bill increasing?* → `/insights` + `/ask` (HK$124 decomposed line-by-line)
2. *When should I run appliances?* → 3 daily tips with exact times and tariff logic
3. *How do I charge an EV off-peak?* → `/charging` (11 PM–7 AM, HK$16–18/charge)
4. *Savings without losing comfort?* → comfort-first missions + hot-weather guardrails
5. *Which action fits my home?* → personal profile drives every recommendation

## Architecture

```
lib/data.ts     Mock layer: smart meter, TOU tariff, weather, bill, missions,
                partners, green funds, building community — internally consistent
lib/engine.ts   Deterministic rules engine: every HK$ figure is COMPUTED here.
                This is the LLM integration point — the model explains, never invents.
lib/store.tsx   Global state (points, budget, missions, portfolio, vouchers) +
                localStorage persistence + toasts
components/     Monochrome design system (cards, nav, SVG charts, faux Sha Tin map)
app/            9 routes, mobile-first, 430px phone shell
```

**Purposeful AI principle:** savings are calculated from meter data and tariffs;
the language layer only explains them. Success = kWh shifted & HK$ saved, not chat volume.

## Docs

- `docs/PROPOSAL.md` — full business proposal (problem, five questions, value, pilot, risks, scale)
- `docs/PITCH.md` — slide-by-slide speaker notes + 2-minute live demo script

## Reset demo state

State persists in `localStorage` (`coolshift-v1`). Clear it in DevTools → Application → Local Storage to reset points/missions/budget.

*All data is illustrative. Concept design for hackathon purposes.*
