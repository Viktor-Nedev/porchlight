# Submission pack — Experienced track

**Deadline: Sunday Nov 8, 12:00 PM.** Two things must both be done before then:
1. Submit on **Devpost** (UXDC Devpost page).
2. Fill in the organisers’ **Google Form**, with the Google Drive link below. Without the form the project is not judged.

Presentations: Experienced track starts **1:50 PM**. You get ~9 minutes: **6 min of slides including the 2-min demo video**, then **3 min Q&A**. Winners must be there in person (3:15 PM).

---

## 1. Requirements check (from the handbook)

| Handbook requirement (Experienced) | Status | Where |
|---|---|---|
| Presentation: problem, **research methods**, key insights, solution, key design decisions | ✅ done, fill in your numbers | Slides deck (13 slides), slides 3–4 hold `[__]` placeholders |
| Interactive prototype showing how the solution works | ✅ | `prototype/` → viktor-nedev.github.io/porchlight/prototype/ |
| Demo video ≈ 2–3 min walking through the prototype | ⚠️ recorded, **needs your voice-over** | `submission/porchlight-demo.mp4` (1:50, silent) |
| Codebase link | ✅ | github.com/Viktor-Nedev/porchlight |
| Link to all design files | ✅ | `submission/porchlight-design-file.pdf` + `assets/img/` + `images/` |
| User research that validates the problem (scored /10) | ❌ **still to do** | Run `docs/RESEARCH_KIT.md` now: survey + 3–5 interviews + 10-min observation |
| Theme: disconnected from others, a place, or yourself | ✅ | Lights / Warm spots / Forecast vs. reality |
| Core feature + thought process (not a full app) | ✅ | Prototype + case study `docs/CONCEPT.md` |
| Originality: made during the event | ✅ | All commits are from Nov 7–8 |
| Outsourced illustrations credited | ⚠️ **name the tool** | README “Credits”, design file p. 9, Devpost “Built with” |
| Submitted via Devpost + Google Form by 12:00 PM | ⏳ you | Section 3 below |

**The only real gap is your own research.** In the Experienced rubric, “no research, problem based on assumptions” scores 0–2/10, while “problem and solution validated by descriptive evidence, numerical data, or both” scores 9–10. Even a 15-person survey and three quotes move this from the bottom band to the top. Put the numbers in:
- slide 3 (`[__]` boxes) and the persona quote on slide 5,
- `js/data.js → research.survey` (the site shows a “What we heard on campus” block automatically),
- `docs/CONCEPT.md` section 2.

Never present the `[__]` placeholders, and don’t invent numbers.

---

## 2. Google Drive folder (what the handbook asks for)

Create a folder **“Porchlight — UXDC Designathon 2.0”**, set sharing to **“Anyone with the link can view”**, and put in it:

| File | From |
|---|---|
| `Porchlight-presentation.pdf` (and/or `.pptx`) | Slides deck → Share › Export (PDF or PowerPoint) |
| `Porchlight-demo.mp4` | `submission/porchlight-demo.mp4` after adding your voice-over |
| `Porchlight-design-file.pdf` | `submission/porchlight-design-file.pdf` |
| `Links.txt` | live site, prototype, GitHub (below) |
| `illustrations/` (optional) | the `images/` folder |

```
Live story site:   https://viktor-nedev.github.io/porchlight/
Prototype:         https://viktor-nedev.github.io/porchlight/prototype/
Codebase:          https://github.com/Viktor-Nedev/porchlight
Case study:        https://github.com/Viktor-Nedev/porchlight/blob/main/docs/CONCEPT.md
```

> GitHub Pages must be switched on (repo Settings → Pages → Deploy from branch → main / root) or the first two links won’t work.

---

## 3. Devpost

- **Name:** Porchlight
- **Tagline:** Leave a light on. A quiet way to say “I’m open to company,” so nobody has to be the first to say hi.
- **Track:** Experienced
- **Story:** paste from `docs/PITCH.md` → “Devpost text”, then add one line with your research numbers under Inspiration.
- **Built with:** html, css, javascript, gsap, lenis, figma (if used), [AI image tool]
- **Links:** live site, prototype, GitHub, Google Drive folder
- **Video:** upload the voiced demo to YouTube (unlisted) and paste the link
- **Images:** `docs/screens/*.jpg` and `assets/img/og-cover.jpg` as the cover

---

## 4. Demo video: adding the voice-over (10 minutes)

The silent recording follows the script in `docs/PITCH.md` (story site → sign-in → filter → Maya’s light → forecast → Spark → kindled → reality → keep the ember → night sky → light your own lamp).

Fastest options:
- **Clipchamp / CapCut / iMovie:** import `porchlight-demo.mp4`, record narration over it, export 1080p.
- **Or record it live:** open the prototype, start OBS / Win+G Game Bar / QuickTime screen recording, and follow the script while talking. Aim for 2:00–2:30.

---

## 5. On the day

- Open the deck in Present mode, the prototype in a second tab as a backup, and the video downloaded locally (don’t rely on the venue Wi-Fi).
- Rehearse once with a timer: 4 minutes of talking + 2-minute video = 6 minutes.
- Q&A answers are in the speaker notes of the last slide.
