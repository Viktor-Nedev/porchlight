# Pitch & submission

**Beginner track:** about 6 minutes in total: **4-minute presentation**, then **2 minutes of Q&A**. No video is required.
**Deadline:** Devpost + Google Form, **Sunday Nov 8, 12:00 PM**.

## Slide plan (4:00)

The deck is the Slides artifact “Porchlight — Leave a light on” (14 slides, speaker notes on every slide). Word-for-word script: [`submission/SCRIPT.md`](../submission/SCRIPT.md).

| # | Time | Slide | Key line |
|---|---|---|---|
| 1 | 0:00 | Cover | “Raise your hand if you’ve spent two hours on campus between classes, alone, in a room full of people.” |
| 2 | 0:15 | The moment | 4:10 pm at MacHall: forty people, zero conversations. |
| 3 | 0:35 | Research | 69.6% of Canadian students felt very lonely last year; 65% at UCalgary. |
| 4 | 0:55 | Competitive analysis | Nothing is right now, in person and no-commitment. |
| 5 | 1:10 | Key insights | No signal → light; liking gap → forecast; first 30 s → Spark. |
| 6 | 1:30 | Persona: Sam | Low effort, low risk, no commitment, now. |
| 7 | 1:45 | The idea | “Leave a light on.” Pause. |
| 8 | 2:05 | User flow: joining a light | Map → Maya → private guess → Spark → compare. |
| 9 | 2:30 | User flow: after + hosting | Night sky; light your own lamp in 4 taps. |
| 10 | 2:55 | One light, three ways back | Others / a place / yourself. |
| 11 | 3:15 | Key design decisions | Expiring lights, public spots, private forecast. |
| 12 | 3:30 | Feasibility | Web app + free tier + lantern tokens. |
| 13 | 3:45 | Impact & roadmap | Pilot in January; loneliness score as the main metric. |
| 14 | 3:55 | Close | “Someone in this room is hoping you’ll say hi.” |

## Optional extra: prototype walkthrough video

Not required for the Beginner track. A silent 1:50 recording is in `submission/porchlight-demo.mp4`, with timed narration in [`submission/VOICEOVER.md`](../submission/VOICEOVER.md), if you want to add it to the Drive folder.

## Devpost text (draft)

**Inspiration:** 69.6% of Canadian post-secondary students felt “very lonely” in the past year (ACHA-NCHA II, 2019, n = 55,284), and 65% at the University of Calgary. Most UCalgary students commute, so they spend long gaps between classes alone in rooms full of people. Research on the *liking gap* shows we consistently underestimate how much strangers enjoy talking to us, so everyone waits for someone else to go first.

**What it does:** Porchlight lets students switch on a time-limited "light" at a public campus spot to show they're open to company. Others see lights on an illustrated campus map, walk over with a shared conversation starter, and afterwards compare their private forecast with how it actually went, a personal way to shrink the liking gap.

**How we built it:** Desk research across Canadian and UCalgary surveys, a literature review, a competitive analysis of five alternatives → insights and a proto-persona → a coded prototype in HTML/CSS/JS with GSAP for motion → a cognitive walkthrough at three screen sizes, with eight design changes from it. The story site uses scroll-driven animation (dusk to night over Calgary) to tell the problem and solution.

**Challenges:** Designing a signal that feels warm but never exposed: no photos, public spots only, auto-expiring lights, a graceful "I have to run" exit.

**Accomplishments:** A complete, clickable flow from lighting a lamp to a growing night sky, and a feature (forecast vs. reality) that turns a psychology finding into a habit.

**What we learned:** The hardest part of connection isn’t the conversation, it’s the first step. Designing for that moment (a signal, a private guess, a shared opener and a graceful exit) mattered more than any social feature.

**What's next:** Club pilot in January, Lantern Table tokens with the Students' Union, and measuring the effect with the 3-item UCLA Loneliness Scale.

**Built with:** html, css, javascript, gsap, lenis, figma
