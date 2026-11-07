# Porchlight: case study

> **Leave a light on.** A campus app for the in-between hours: a quiet way to say "I'm open to company", so nobody has to be the first to say hi.

UXDC Designathon 2.0 · Theme: **Human Connection**

---

## 1. The moment

**4:10 pm, MacHall.** Your last class ended at 3:50 and the next one starts at 6:00. Home is a 45-minute C-Train ride away, so you stay. You find a seat at a long table, put your headphones in and open your phone. The table fills up, one empty seat between each person. Forty people in the room, zero conversations.

This is the **in-between hour**: gaps between classes that commuter-heavy campuses are full of. It's the moment we chose because:

- It happens **every week, to almost everyone**, not only to students who already identify as lonely.
- It's **physical and in-person**. The people who could connect are already sitting within a few metres of each other.
- It's **low-stakes and time-boxed**. Nobody is asking for a best friend, only for the next 30 minutes to feel less alone.

## 2. Why it happens

| Insight | Evidence |
|---|---|
| **The liking gap.** After talking to a stranger, people consistently underestimate how much the other person liked them. | Boothby, Cooney, Sandstrom & Clark (2018), *Psychological Science*, "The Liking Gap in Conversations: Do People Like Us More Than We Think?" |
| **Mistakenly seeking solitude.** Commuters predicted that talking to a stranger would be unpleasant; those asked to do it reported a *more* positive trip than those who sat alone. | Epley & Schroeder (2014), *Journal of Experimental Psychology: General* |
| **No signal.** In a public space there is no socially safe way to say "I'm open to company". Headphones and phones send the opposite signal, even when we don't mean it. | Design insight, *to be validated in our interviews and survey* (see `RESEARCH_KIT.md`) |
| **It's widespread.** 55–67 % of U.S. undergraduates reported feeling "very lonely" at some point in the previous 12 months across survey waves from 2008 to 2019. | American College Health Association, National College Health Assessment II (U.S. undergraduates) |

**Root cause:** students don't lack the *desire* to connect; they lack a **signal**. Everyone is waiting for someone else to go first, and everyone underestimates how welcome they'd be. This is pluralistic ignorance plus the liking gap.

### Our own research
*Fill this in after running the kit in `RESEARCH_KIT.md`, and add the same numbers to `js/data.js` so they appear on the site.*

- Survey: n = __ students
- Interviews: __ students (programs: __)
- Observation: __ minutes at __ (count of people sitting alone vs in groups)

## 3. Who we designed for

**Sam, 2nd-year, commuter.** Takes the C-Train 45 minutes each way. Has two or three long gaps a week. Friendly but quiet; joined a club in first year but the meetings clash with the train schedule. "I don't want to *make friends*, I just don't want to sit alone for two hours."

**Needs:** low effort, low risk of rejection, no commitment, in person, right now.

## 4. The solution

**Porchlight lets you switch on a light at your table**: a quiet, time-limited signal that you're open to company. Anyone nearby can see it on an illustrated campus map, walk over, and break the ice with a shared conversation starter. When the timer ends, the light goes out.

### Core flow

1. **Light your lamp.** Three taps: *where* (one of about 40 public spots), *what* ("Eating lunch, two free seats 🍜"), and *how long* (15–90 min).
2. **See who's open.** A night-time campus map glows with every light that's on right now. No feeds, no profiles to scroll, no swiping.
3. **Make a private guess.** Before walking over, one tap: *how do you think this will go?* Only you ever see it.
4. **Walk over with a Spark.** You both get the same conversation starter ("What's the most Calgary thing that happened to you this week?"), so the first 30 seconds aren't awkward.
5. **Kindle, then compare.** After the light fades: *how did it actually go?* Porchlight shows "you guessed 2, it was 4". Repeated over a semester, that is a personal, evidence-based way to shrink your own liking gap.
6. **Grow your night sky.** If both people "keep the ember", they appear in each other's constellation. Over time your campus fills with warm places and familiar faces.

### One light, three disconnections

| Disconnected from… | Porchlight feature |
|---|---|
| **each other** | **Lights.** A low-stakes, opt-in signal that turns a room of strangers into a room of possible conversations. |
| **a place** | **Warm spots.** Each kindle warms the spot where it happened. Your map fills in with places that now mean something, and the campus learns where people actually gather. |
| **yourself** | **Forecast vs. reality.** A private record of what you feared and what really happened. You start trusting yourself again because the evidence is your own. |

## 5. Key design decisions

| Decision | Why |
|---|---|
| **Lights expire** (15–90 min) | Removes commitment and lingering location data, and gives a natural exit. |
| **Public spots only, never GPS** | Safety; no residences; makes the map legible ("MacHall food court", not a dot). |
| **No photos, no follower counts** | Avoids the dating-app and social-media dynamic; first name + program + "ask me about…" is enough to start. |
| **The forecast is private** | Being honest about fear only works if no one else sees it. |
| **"I have to run" exit** | A graceful way out lowers the cost of trying. |
| **Mutual "keep the ember"** | Nobody is notified of a one-sided keep, so there is no rejection signal. |
| **Physical Lantern Table tokens** | The signal works without the app too, which helps adoption and inclusion. |
| **Night-sky visual language** | Light = openness. The whole brand is "warm windows in the dark": calm, not gamified. |

## 6. Safety & inclusion

- Sign-in with a verified campus email (students & staff only).
- Lights snap to ~40 mapped public spots: never residences, never exact location.
- Block, report and "I have to run" are always one tap away.
- First name only, with optional pronouns. No photo required.
- Accessible spots are flagged (step-free, quiet areas) so students with disabilities can filter.
- Reduced-motion and screen-reader friendly prototype; colour contrast checked on dark backgrounds.

## 7. Feasibility

| Piece | Plan |
|---|---|
| App | Progressive web app (installable, no app-store review). |
| Backend | Real-time database + auth on a free or low tier (e.g. Supabase / Firebase): roughly $0–25/month for a pilot. |
| Sign-in | Magic link restricted to the university email domain. |
| Map | Illustrated SVG map with ~40 hand-placed public spots, so no paid maps API. |
| Lantern Tables | ~30 acrylic tokens with QR codes, partnering with the Students' Union for placement in food courts. |
| Team to pilot | 2 developers + 1 designer + club partners for seeding the first lights. |

**Cold start:** partner clubs commit to "first light" hours, keeping 3–5 lights on at peak gap times (11:00–14:00) during the first weeks, so the map is never empty.

## 8. Impact & how we'd measure it

- **Primary:** change in the 3-item UCLA Loneliness Scale score of pilot users (pre vs. 6 weeks).
- **Behaviour:** lights per week, join rate (lights that receive at least one visitor), repeat kindles, kept embers.
- **Liking gap:** average (reality − forecast) per user over time. We expect it to start positive and shrink as forecasts become more accurate.
- **Place:** number of distinct warm spots per user (belonging to campus).

## 9. Roadmap

| When | Milestone |
|---|---|
| Nov 2026 | Concept, research and interactive prototype (this weekend). |
| Jan 2027 | Club pilot: PWA, campus sign-in, 40 spots, 2 partner clubs. |
| Feb 2027 | Lantern Tables with the Students' Union. |
| Mar 2027 | Measure: loneliness score, kindles, liking-gap trend. |
| Fall 2027 | Open to other Calgary campuses; orientation-week "first light" events. |

## 10. References

- Boothby, E. J., Cooney, G., Sandstrom, G. M., & Clark, M. S. (2018). The liking gap in conversations: Do people like us more than we think? *Psychological Science, 29*(11), 1742–1756.
- Epley, N., & Schroeder, J. (2014). Mistakenly seeking solitude. *Journal of Experimental Psychology: General, 143*(5), 1980–1999.
- American College Health Association. *National College Health Assessment II*, reference group reports, 2008–2019.
- Russell, D. W. (1996). UCLA Loneliness Scale (Version 3). *Journal of Personality Assessment, 66*(1), 20–40. (3-item short form: Hughes et al., 2004, *Research on Aging*.)
