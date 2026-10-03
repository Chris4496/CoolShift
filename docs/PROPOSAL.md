# Cool Shift — Proposal

**Small actions. Everyday value.**
A personal AI assistant that helps Hong Kong residents make decisions about electricity *and* daily urban life — shifting CLP from electricity supplier to trusted energy & lifestyle partner.

---

## 1. A clear problem

Hong Kong residents live in compact, high-density homes, face hot and humid summers, and increasingly use electricity for cooling, appliances, digital lifestyles and e-mobility. Yet most customers experience electricity as **a monthly bill rather than something they can actively manage**.

CLP needs to manage rising and more variable electricity demand, particularly during hot-weather peak periods. It also needs stronger customer engagement as the energy system becomes more decentralised, digital and connected.

CLP already has valuable assets: **smart meters, a digital customer platform, consumption insights, rewards and energy-saving missions**. The opportunity is to connect those tools into **one proactive customer journey** rather than offering separate features.

## 2. Customer need — five questions, one assistant

Customers need help answering practical questions. Cool Shift answers each one inside the product:

| # | Customer question | How Cool Shift answers it |
|---|-------------------|---------------------------|
| 1 | **Why is my electricity bill increasing?** | *Insights + Ask.* The June bill is HK$642 vs HK$518 — the +HK$124 is decomposed line by line: +HK$86 cooling (5 extra very-hot days), +HK$18 EV charging at peak, +HK$12 water heater, +HK$8 other. Plain language, real numbers. |
| 2 | **When should I use my air conditioner, washing machine or dryer?** | *Three daily tips* with exact times and tariff logic: "Cool at 7:30 PM at 25.5°C", "Run the dryer after 9 PM" — each with a HK$ saving attached. |
| 3 | **How can I charge an EV without increasing peak demand?** | *Smart Charging.* Schedule 11 PM → 7 AM inside the off-peak window (HK$1.06 vs HK$1.87/kWh), saving HK$16–18 per charge while easing the evening peak. |
| 4 | **How can I join energy-saving programmes without losing comfort?** | *Missions with comfort-first guardrails.* Tips never ask for sacrifice ("a fan keeps 25.5°C feeling like 23°C"), and cooling is never reduced during Very Hot Weather Warnings or for vulnerable users. |
| 5 | **Which action is relevant to my home?** | *Personal energy profile.* Housing type, residents, appliances, EV/e-bike ownership, daily routine and budget drive every recommendation — no generic advice. |

## 3. Purposeful AI

AI is used for four specific functions — as an enabler of value, not a technology demo:

1. **Personalisation** — learns each household's load pattern from smart-meter data and a short profile.
2. **Optimisation** — picks the best time to cool, charge and run appliances against weather, humidity and tariff.
3. **Explanation** — turns meter data into plain language with a HK$ figure attached.
4. **Dialogue** — answers questions such as "Why did my bill go up?"

> **Savings are calculated from real meter data and published tariffs; the language model only explains them.** Every tip is one specific action with a measurable result, so success is judged by **kWh shifted and dollars saved, not by chat volume**.

In the MVP this is implemented as a deterministic rules engine (`lib/engine.ts`) — the exact integration point where an LLM would plug in to generate the natural-language layer.

## 4. Value proposition

**Users** — lower bills without losing comfort; three clear actions a day instead of charts; rewards for local services they already use; budget control that prevents bill shock.

**CLP** — a lower evening peak; daily rather than bi-monthly contact with customers; new partnership revenue; and a strategic shift from electricity supplier to **trusted energy and lifestyle partner**.

**Partners** — appliance brands, air-conditioning servicers, charging operators, property managers and local shops reach customers **at the moment of need** (e.g. an AC service offer when the unit's estimated efficiency drops) and **pay only for results**. Lifestyle city services are personalised too.

**Hong Kong** — less peak strain on the grid and lower emissions, achieved through **behaviour rather than new infrastructure**.

## 5. What the product does (MVP feature map)

| Feature | Where | Brief area |
|---|---|---|
| Personal energy profile & bill explanations in HK$ | Insights, Ask | Energy insights |
| Three daily tips, each one action with a measurable saving | Home, Ask | Energy insights |
| Humidity-tuned AC scheduling (25.5°C, comfort-first) | Cooling | Smart home |
| EV / e-bike charging shifted off-peak, ready by 7 AM | Charging | E-mobility |
| Energy missions → CLP points → local partner offers | Rewards | Partner platforms |
| **Monthly budget with pace bar and 50/80/100% alerts** | Budget | Inclusive journeys (low-income bill-shock protection) |
| **Large-text simple mode, Cantonese/English/Mandarin voice, caregiver view, no hardware required** | Throughout | Inclusive journeys |
| **Visible personal impact ("18.2 kWh shifted, 14 kg CO₂ avoided")** | Impact | Engagement / social good |
| **Building community: block goal, anonymised leaderboard, group rewards — electricity for social harmony** | Impact | Community / grid resilience |
| **Invest mission points in clean-energy portfolios (illustrative)** | Rewards | Engagement / partner platforms |

## 6. Pilot and route to scale

**Pilot:** 12 weeks over summer with **1,000 smart-meter households** in one or two estates, including ~100 EV owners and a cohort of elderly residents, plus a **matched control group**. Runs inside the existing CLP app with 5–10 local partners.

**Success measures:**

- Evening-peak (4–11 PM) consumption **5–8% below the control group**
- **≥60%** of EV charging moved to off-peak hours
- **≥40%** weekly active users and **≥30%** of tips acted on
- Average **verified saving per household, in HK$**
- Reward **redemption rate** and **partner repeat rate**

**Risks and mitigations:**

| Risk | Mitigation |
|---|---|
| Privacy | Opt-in consent, data minimisation, no household data shared with partners |
| Wrong advice | Savings shown as **ranges from deterministic calculations**, human-reviewed tip library |
| Health | **Never** advise reducing cooling during hot-weather warnings or for vulnerable users |
| Low engagement | Missions, group challenges, and a strict **three-tip daily limit** |
| Trust | Offers clearly labelled; **none that increase energy use** |

**Route to scale:** pilot → all app users with smart meters → smart-home device control and an **open partner API** → **automated demand response**.

## 7. Business model

- **Partnership revenue** — commission on redemptions and results-based offers (AC servicing, charging credit, appliance upgrades).
- **Peak-cost avoidance** — every kWh shifted off the evening peak reduces system cost; a 5–8% peak reduction across the pilot cohort is measurable against the control group.
- **Engagement value** — daily app contact opens cross-sell (tariff plans, Eco Points, solar, EV tariffs) and reduces churn in a liberalising market.
- **Data flywheel (consented)** — anonymised, aggregated shifting patterns improve forecasting and demand-response planning.

---

*All figures in the MVP are illustrative but internally consistent, computed from mock smart-meter data and a published-style time-of-use tariff — mirroring production behaviour on CLP systems.*
