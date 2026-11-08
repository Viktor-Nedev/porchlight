# Research

Four research methods were used during the event. Every figure below was checked against the original document; sources are linked at the end.

| Method | What we did | Output |
|---|---|---|
| 1. Desk research | Reviewed national student-health and population surveys for Canada and the University of Calgary | Scale of the problem (§1) |
| 2. Literature review | Read behavioural-science studies on talking to strangers and weak ties | Why the problem happens (§2) |
| 3. Competitive analysis | Compared 5 ways students currently try to meet people | The gap Porchlight fills (§3) |
| 4. Cognitive walkthrough + iteration | Walked through every task in the prototype at phone, laptop and desktop sizes, logged problems and fixed them | Design changes (§4) |

> Primary research with students (survey, interviews, observation) can be added with `docs/RESEARCH_KIT.md`; the site shows the results automatically once they are entered in `js/data.js`.

---

## 1. How big is the problem? (desk research)

| Finding | Figure | Source |
|---|---|---|
| Canadian post-secondary students who felt **very lonely** at some point in the past 12 months | **69.6%** (60.9% of men, 73.0% of women) | ACHA-NCHA II, Spring 2019, Canadian Reference Group: **55,284 students at 58 institutions** |
| …of whom felt it **in the last two weeks** | **31.2%** | same survey |
| University of Calgary students who felt very lonely in the past 12 months | **65%** | UCalgary 2013 student survey that led to the Campus Mental Health Strategy (cited in Stamp, 2020, University of Calgary) |
| Canadians aged **15–24** who are **always or often** lonely | **23%** (29% of women, 18% of men), the highest of any age group | Statistics Canada, Canadian Social Survey, Aug–Sep 2021 |
| People who **live alone** and are always or often lonely | **24%**, vs. 11% of people living with others | Statistics Canada, 2021 |
| UCalgary residence capacity | ≈ **3,000 beds**, full in 2023, 2024 and 2025, with 1,000+ students on the waitlist in Aug 2025 | The Gauntlet (Jan 2025); CBC (Aug 2025) |

**What this tells us:** loneliness is the norm, not the exception, among Canadian students, and it is just as present at UCalgary. With only about 3,000 residence beds, most students commute, which is exactly the group that spends long gaps on campus without a room to go back to.

## 2. Why does it happen? (literature review)

| Study | Finding | Design implication |
|---|---|---|
| Boothby, Cooney, Sandstrom & Clark (2018), *Psychological Science* — **The liking gap** | After a conversation with a stranger, people consistently underestimate how much the other person liked them. | People need **evidence** that it went better than they feared → *Forecast vs. reality* |
| Epley & Schroeder (2014), *J. of Experimental Psychology: General* — **Mistakenly seeking solitude** | Commuters expected talking to a stranger to be unpleasant; those asked to do it had a **more** positive trip than those who sat alone. | The barrier is the expectation, not the experience → make the **first step** small and safe |
| Sandstrom & Dunn (2014), *Personality and Social Psychology Bulletin* — **Weak ties** | Students felt happier and more belonging on days they had more interactions with **acquaintances**, not just close friends. | A 30-minute chat with a classmate matters → we don’t need to build friendships, just **moments** |

**Root cause:** there is no socially safe signal for “I’m open to company”. Headphones and phones send the opposite signal, everyone underestimates how welcome they’d be, so everyone waits for someone else to go first (pluralistic ignorance + the liking gap).

## 3. Competitive analysis

| Option | How it works | Right now? | In person? | Low commitment? | Built for campus gaps? |
|---|---|---|---|---|---|
| Friend-finding apps (e.g. Bumble BFF) | Browse profiles, match, chat, then plan to meet | ✗ | later | ✗ (profiles, photos) | ✗ |
| Event platforms (e.g. Meetup) | Join scheduled group events | ✗ (scheduled) | ✓ | ✗ (RSVP, travel) | ✗ |
| Dinners with strangers (e.g. Timeleft) | Book a seat at a future group dinner | ✗ (booked ahead) | ✓ | ✗ (paid, evening) | ✗ |
| Campus clubs | Join a club, attend meetings | ✗ (fixed times) | ✓ | ✗ (membership) | partly, but times clash with commutes |
| Course Discord / group chats | Online chat with classmates | ✓ | ✗ | ✓ | ✗ (stays online) |
| **Porchlight** | Switch on a light at your table; people nearby walk over | **✓** | **✓** | **✓** (15–90 min, no profile) | **✓** |

**The gap:** nothing combines *right now*, *in person*, and *no commitment*. Every alternative asks students to plan ahead, build a profile, or stay online.

## 4. Cognitive walkthrough and iteration

Tasks tested on the prototype at 390 px (phone), 1280×680 (small laptop) and 1440×900 (desktop):

| Task | Steps | Result |
|---|---|---|
| Join someone’s light, from the map to “kindled” | 4 taps (card → I’m coming over → forecast → I’m here) | Completed, no dead ends |
| Light your own lamp with the defaults | 4 taps (lamp → Next → Next → Turn on my light) | Completed |
| Leave politely mid-way | 1 tap (“I have to run”) | Completed |
| Find safety controls | Shield in the map header | Visible on every map view |

Problems found and fixed during the event:

| # | Problem found | Change made |
|---|---|---|
| 1 | Emoji icons rendered differently on each device and looked inconsistent | Drew a custom line-icon set for vibes, places and actions |
| 2 | The emoji 1–5 scale for the forecast felt generic and off-brand for an emotional question | Replaced it with five lantern faces that glow brighter with the score |
| 3 | Map header overlapped on narrow phones (≈ 340 px) | Temperature chip hides below 360 px; title tightened |
| 4 | Welcome button overlapped the privacy line during its entry animation | Animation now clears its transform when it ends |
| 5 | The prototype embedded in the story site rendered the map zoomed in | Device frame given an explicit width |
| 6 | Thought bubbles in “The moment” covered the headline on short laptop screens | Bubbles moved to their own row; the scene scales with the screen |
| 7 | Hero subtitle was hard to read over the bright sunset | Subtitle placed on a frosted glass card |
| 8 | Lights map felt flat and generic | Rebuilt as an illustrated isometric campus with lit windows, lamps and person pins |

## 5. Synthesis

| Insight | Evidence | Feature |
|---|---|---|
| There’s no safe way to say “I’m open” | Root cause from §2; no competitor offers it (§3) | **Lights**: an opt-in, time-limited signal |
| We expect it to go worse than it does | Liking gap; mistakenly seeking solitude | **Forecast vs. reality** |
| Small moments with acquaintances matter | Weak-ties study | Lights last 15–90 min; no friendship required |
| The first 30 seconds are the hardest | Fear of not knowing what to say | **Shared Spark** + “I have to run” |
| Most students have nowhere to retreat to between classes | ≈ 3,000 beds; commuters | Public campus spots only; Lantern Table tokens in food courts |

## Sources

- American College Health Association. *ACHA-NCHA II Spring 2019 Canadian Reference Group Executive Summary.* https://www.acha.org/wp-content/uploads/2024/07/NCHA-II_SPRING_2019_CANADIAN_REFERENCE_GROUP_EXECUTIVE_SUMMARY.pdf
- Stamp, J. (2020). *Campus Mental Health: How Stigma Affects Students’ Approach to Resources* (MSc thesis, University of Calgary). https://ucalgary.scholaris.ca/server/api/core/bitstreams/984eb471-e56b-4de4-845b-37580a1cced5/content
- Statistics Canada (2021, Nov 24). *Canadian Social Survey: Loneliness in Canada.* The Daily. https://www150.statcan.gc.ca/n1/daily-quotidien/211124/dq211124e-eng.htm
- The Gauntlet (2025, Jan 20). *Understanding the high demand for University of Calgary’s on-campus housing.* https://thegauntlet.ca/2025/01/20/understanding-the-high-demand-for-university-of-calgarys-on-campus-housing
- CBC News (2025, Aug). *Students express housing concerns in Calgary as campus residences reach capacity.* https://www.cbc.ca/1.7296099
- Boothby, E. J., Cooney, G., Sandstrom, G. M., & Clark, M. S. (2018). The liking gap in conversations. *Psychological Science, 29*(11), 1742–1756.
- Epley, N., & Schroeder, J. (2014). Mistakenly seeking solitude. *Journal of Experimental Psychology: General, 143*(5), 1980–1999.
- Sandstrom, G. M., & Dunn, E. W. (2014). Social interactions and well-being: The surprising power of weak ties. *Personality and Social Psychology Bulletin, 40*, 910–922.
