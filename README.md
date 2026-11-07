<div align="center">

# porchl<sup>●</sup>ght

### Leave a light on.

A campus app for the in-between hours: a quiet way to say *“I’m open to company”*, so nobody has to be the first to say hi.

**UXDC Designathon 2.0 · Theme: Human Connection**

[**Live story site**](https://viktor-nedev.github.io/porchlight/) · [**Interactive prototype**](https://viktor-nedev.github.io/porchlight/prototype/) · [**Case study**](docs/CONCEPT.md) · [**Pitch & demo script**](docs/PITCH.md)

<img src="docs/screens/hero.jpg" alt="Porchlight story site: an illustrated Calgary skyline at dusk under a chinook arch, with the word porchlight in large letters" width="100%" />

</div>

---

## The moment

**4:10 pm, MacHall.** Two hours until your next class, too far to go home. Forty people in the room, zero conversations. Everyone has headphones in, and everyone is waiting for someone else to go first.

Research on the **liking gap** (Boothby et al., 2018) shows we consistently underestimate how much strangers enjoy talking to us, and commuters who were asked to talk to a stranger had a *better* trip than those who sat alone (Epley & Schroeder, 2014). Students don't lack the desire to connect. They lack a **signal**.

<img src="docs/screens/moment.jpg" alt="Illustration of four students at a long table, one empty seat apart, each with headphones and a thought bubble" width="100%" />

## The idea

**Porchlight lets you switch on a light at your table**: a time-limited, opt-in signal that you’re open to company.

1. **Light your lamp.** Where you are, what you’re up to, how long (15–90 min).
2. **See who’s open.** An illustrated night-time campus map glows with every light that’s on.
3. **Make a private guess.** *How do you think this will go?* Only you see it.
4. **Walk over with a Spark.** You both get the same conversation starter.
5. **Kindle, then compare.** “You guessed 2, it was 4.” Your own evidence against the fear of going first.
6. **Grow your night sky.** Mutual “keep the ember” adds people to your constellation, and your campus fills with warm spots.

| From each other | From a place | From yourself |
|---|---|---|
| **Lights:** an opt-in signal that turns a room of strangers into possible conversations | **Warm spots:** places on campus that start to mean something | **Forecast vs. reality:** a private record that rebuilds trust in yourself |

<p align="center">
  <img src="docs/screens/proto-map.jpg" alt="Prototype: campus map with glowing lights" width="32%" />
  <img src="docs/screens/proto-result.jpg" alt="Prototype: forecast versus reality result" width="32%" />
  <img src="docs/screens/proto-sky.jpg" alt="Prototype: night sky constellation of connections" width="32%" />
</p>

## What’s in this repo

```
index.html            Story site: scroll-driven case study (dusk → night over Calgary)
prototype/            Interactive mobile prototype (also embedded in the story site)
js/data.js            Editable content: team names, links, your survey numbers
js/scene.js           Procedural illustration (parallax hero layers, cafeteria scene)
js/site.js            Motion: GSAP ScrollTrigger, SplitText, Lenis, canvas scenes
docs/CONCEPT.md       Full case study: problem, research, solution, feasibility
docs/RESEARCH_KIT.md  Survey, interview script and observation plan
docs/PITCH.md         6-minute slide plan, 2-minute demo script, Devpost text
docs/IMAGE_PROMPTS.md Art direction and prompts for every custom illustration
assets/img/           Drop painted illustrations here (optional, see below)
```

## Run it locally

No build step. Any static server works:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> for the story site and <http://localhost:8000/prototype/> for the app.

## Customising

- **Team, links and research numbers:** edit `js/data.js`. The “What we heard on campus” block appears automatically once `research.survey.respondents` is set.
- **Custom illustrations:** every scene is drawn in code, so the site is complete without images. To upgrade to painted art, generate the images in [`docs/IMAGE_PROMPTS.md`](docs/IMAGE_PROMPTS.md) and save them into `assets/img/` with the listed filenames. They are picked up automatically, and the hero still fades from dusk to night.
- **Prototype deep links:** `prototype/?screen=sky` (also `map`, `detail`, `forecast`, `onway`, `kindle`, `result`, `light-where`, `light-what`, `light-time`, `lit`).

## Design notes

- **Motion:** pull-chain preloader, dusk-to-night scroll scene with parallax layers and windows lighting up, pinned storytelling for the problem, C-Train arrival boards with split-flap text, a sticky phone that drives the live prototype, an interactive constellation canvas, a horizontal “transit line” roadmap, and rising lanterns.
- **Type:** Fraunces (display), Instrument Sans (UI), Caveat (handwritten notes), DotGothic16 (transit boards).
- **Accessibility:** `prefers-reduced-motion` turns off scroll animation and smooth scrolling; keyboard-operable preloader and prototype; descriptive SVG titles.

## Credits

- Fonts: [Google Fonts](https://fonts.google.com) (SIL Open Font License).
- Motion: [GSAP](https://gsap.com) (GreenSock standard license) and [Lenis](https://github.com/darkroomengineering/lenis) (MIT), vendored in `js/vendor/`.
- Illustrations: vector scenes drawn in code. *If you add generated or outsourced artwork, credit the tool or artist here, as the event rules require.*
- Research: Boothby et al. (2018); Epley & Schroeder (2014); ACHA-NCHA II. Full references are in [`docs/CONCEPT.md`](docs/CONCEPT.md#10-references).

## License

Code is released under the [MIT License](LICENSE).
