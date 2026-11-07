# Pitch & submission

**Experienced track:** 6-minute presentation including a ~2-minute demo video, then 3 minutes of Q&A.
**Deadline:** Devpost + Google Form, **Sunday Nov 8, 12:00 PM**.

## Slide plan (6:00 total)

| # | Time | Slide | What to say |
|---|---|---|---|
| 1 | 0:00 | **Title**: "porchlight · Leave a light on." (`og-cover` art) | "Raise your hand if you've ever spent two hours on campus between classes, alone, in a room full of people." |
| 2 | 0:20 | **The moment**: the in-between hour (`slide-problem` art + observation counts) | Describe 4:10 pm at MacHall. One real quote from an interview. |
| 3 | 0:50 | **Research**: survey numbers + the liking gap + mistakenly seeking solitude | "It's not that students don't want to connect. It's that nobody can tell who does." |
| 4 | 1:30 | **Insight → opportunity** | "There's no safe signal for 'I'm open to company'. So we designed one." |
| 5 | 1:45 | **Demo video** (2:00) | See the script below. |
| 6 | 3:45 | **One light, three disconnections**: Lights / Warm spots / Forecast vs. reality | Tie each feature back to the theme's three disconnections. |
| 7 | 4:20 | **Safety & key decisions** | Lights expire, public spots only, first name only, "I have to run". |
| 8 | 4:50 | **Feasibility**: PWA + real-time DB + Lantern Table tokens (`lantern-table-token` art) | Cost ~$0–25/month, Students' Union partnership, cold-start plan. |
| 9 | 5:20 | **Impact & roadmap**: the C-Train line | How we'd measure it: UCLA loneliness score, kindles, liking-gap trend. |
| 10 | 5:45 | **Close**: "Someone in this room is hoping you'll say hi." | Point to the live site and repo. |

## Demo video script (≈ 2:00)

Record `prototype/` full-screen in a desktop browser (the phone frame looks great on video) or on a real phone.

| Time | On screen | Voice-over |
|---|---|---|
| 0:00 | Story site preloader → pull the chain → dusk-to-night hero scroll | "Porchlight starts from one idea: leave a light on." |
| 0:15 | Prototype welcome → "Continue with your campus email" | "Sign in with your campus email. First name only, no photos." |
| 0:25 | Map with five glowing lights; tap the 🍜 filter, then All | "It's 4 pm. Five people near you are open to company right now." |
| 0:40 | Tap Maya's card → detail sheet | "Maya is eating lunch with two free seats. Ask her about her failed sourdough era." |
| 0:55 | "I'm coming over" → forecast: tap 😐 Meh | "Before you go, a private guess: how will this go? Most of us guess low." |
| 1:05 | On-the-way screen → flip the Spark card → shuffle once | "You both get the same Spark, so the first 30 seconds aren't awkward." |
| 1:20 | "I'm here" → Kindled animation → reality: tap 😊 Good | "You found each other. Later, how did it actually go?" |
| 1:30 | Result: Meh → Good, +2 → Keep the ember | "You guessed 2, it was 4. That's the liking gap, and you just closed it a little." |
| 1:40 | Night sky: new star, KPIs, dumbbell chart, warm spots | "Your night sky grows with every kindle, and your campus fills with warm spots." |
| 1:50 | Tap the lamp → light your own → "Your light is on" → Dev is coming | "And when you're the one who's open, just leave a light on." |

## Devpost text (draft)

**Inspiration:** Every week, thousands of students spend hours on campus between classes, alone in rooms full of people. Research on the *liking gap* shows we consistently underestimate how much strangers enjoy talking to us, so everyone waits for someone else to go first.

**What it does:** Porchlight lets students switch on a time-limited "light" at a public campus spot to show they're open to company. Others see lights on an illustrated campus map, walk over with a shared conversation starter, and afterwards compare their private forecast with how it actually went, a personal way to shrink the liking gap.

**How we built it:** Research (survey, intercept interviews, observation) → journey mapping → prototype in HTML/CSS/JS with GSAP for motion. The story site uses scroll-driven animation (dusk to night over Calgary) to tell the problem and solution.

**Challenges:** Designing a signal that feels warm but never exposed: no photos, public spots only, auto-expiring lights, a graceful "I have to run" exit.

**Accomplishments:** A complete, clickable flow from lighting a lamp to a growing night sky, and a feature (forecast vs. reality) that turns a psychology finding into a habit.

**What we learned:** *(fill in from your testing)*

**What's next:** Club pilot in January, Lantern Table tokens with the Students' Union, and measuring the effect with the 3-item UCLA Loneliness Scale.

**Built with:** html, css, javascript, gsap, lenis, figma
