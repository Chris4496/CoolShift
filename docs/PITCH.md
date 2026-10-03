# Cool Shift — Pitch script & demo guide

**Deck:** run the app and open **`/pitch`** (12 slides, ← → arrow keys).
**Live demo:** open **`/`** on a phone-sized window (or desktop — it renders as a phone app, max-width 430 px).

Total time: **5 minutes** (3 min pitch + 2 min demo) or 8 min with Q&A buffer.

---

## Slide-by-slide speaker notes

### 1 · Title
> "Cool Shift — small actions, everyday value. It's a personal AI assistant that turns everything CLP already has — smart meters, tariffs, rewards, partners — into one proactive journey. It moves CLP from electricity supplier to trusted energy and lifestyle partner."

### 2 · The problem
> "Hong Kong homes are compact, summers are humid, and cooling plus EVs push demand up every year. But customers experience electricity as a monthly bill — nothing they can act on. Meanwhile CLP owns all the right assets; they just sit as separate features."

### 3 · Five questions
> "Everything starts from five questions real customers ask — from 'why is my bill up' to 'which action fits *my* home'. Each one has a concrete answer inside the product. This is our spec."

### 4 · The product
> "Three tips a day. Each tip is one specific action with a HK$ figure — 'cool at 7:30 at 25.5 degrees, save 26 to 34 dollars a month'. No charts to decode, no guilt."

### 5 · Purposeful AI
> "Here's the discipline: **savings are calculated from meter data and published tariffs — the language model only explains them.** Personalisation, optimisation, explanation, dialogue. We judge success by kWh shifted and dollars saved, not chat volume."

### 6 · Live tour — switch to the app
> "Let me show you." → Demo flow below.

### 7 · Budget control
> "New: set a monthly budget, get paced against it, alerts at 50, 80 and 100 percent. This is inclusion — low-income households get protection from bill shock; elderly users get large text and Cantonese voice. No smart-home hardware required."

### 8 · Social harmony
> "New: electricity for social harmony. You see your own 18 kWh shifted — and your building's 412 kWh toward a group goal with a shared reward. Neighbours shift together; the grid breathes. Behaviour, not infrastructure."

### 9 · Green points investing
> "New: mission points can be invested into clean-energy portfolios — solar, offshore wind, grid innovators. Saving the planet becomes funding the planet. Clearly labelled loyalty mechanics, never securities advice."

### 10 · Value — four winners
> "Users save money without losing comfort. CLP gets a lower evening peak, daily engagement and partnership revenue. Partners reach customers at the moment of need and pay only for results. Hong Kong gets less peak strain with zero new infrastructure."

### 11 · Pilot
> "Twelve weeks, this summer: 1,000 smart-meter households in one or two estates, 100 EV owners, an elderly cohort, matched control group, inside the existing CLP app. Success: 5–8% evening-peak reduction, 60% of EV charging off-peak, 40% weekly actives, 30% of tips acted on, verified HK$ savings, redemption and partner repeat rates."

### 12 · Risks & scale + the ask
> "Privacy is opt-in with data minimisation. Advice is deterministic ranges, human-reviewed. We never touch cooling during hot-weather warnings. Then scale: all smart-meter users, device control and an open partner API, automated demand response. **The ask: approval to run the pilot this summer.**"

---

## Live demo flow (2 minutes)

1. **Home** (`/`) — "Hi Alex, 29°C and 82% humidity. Three moves for today, each with dollars attached."
2. **Insights** (`/insights`) — point at dark bars: "6–11 PM is 44% of the day — the most expensive hours. Bill explained: HK$124 up, HK$86 of it cooling."
3. **Ask** (`/ask`) — tap chip **"Why is my bill higher?"** → breakdown card. Then **"Plan tonight"** → expand *"How this plan was calculated"* → **Use this plan** (+20 pts toast).
4. **Cooling** (`/cooling`) — "25.5°C with a fan feels like 23°C. Safety rule: never reduce cooling during hot-weather warnings."
5. **Charging** (`/charging`) — slide target to 80% → **Confirm schedule** → "HK$16–18 saved every charge."
6. **Budget** (`/budget`) — drag the budget slider; show pace bar and daily allowance.
7. **Impact** (`/impact`) — "18.2 kWh shifted, top 15% of Block 7. Join the block challenge."
8. **Rewards** (`/rewards`) — check in a mission (+points toast), redeem the coffee voucher, then **invest 50 points** into the solar basket.

## Backup Q&A

- **Data privacy?** Opt-in, minimisation, nothing shared with partners; community data anonymised by default.
- **What if the AI gives wrong advice?** It can't invent numbers — savings are deterministic from meter + tariff; the language layer sits on top; tip library human-reviewed.
- **Why will people keep using it?** Three-tip limit avoids fatigue; missions, group challenges, budgets and point-investing give four distinct return loops.
- **Cost to build the pilot?** Runs inside the existing CLP app; MVP proves the journey with a rules engine — the LLM layer is an API integration, not new infrastructure.
