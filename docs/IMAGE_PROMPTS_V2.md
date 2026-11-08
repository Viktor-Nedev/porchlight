# Image prompts, round 2

These are optional extra images. The site and the app already work without them, and each image below has a slot ready for it. Keep the same **shared style block** from [`IMAGE_PROMPTS.md`](IMAGE_PROMPTS.md#1-visual-direction) at the end of every prompt so everything matches.

**Important for every image with a "transparent" background:** most generators fake transparency with a grey checkerboard. Ask for a flat background instead, and it can be removed cleanly:

```
on a solid flat pure white background (#FFFFFF), no checkerboard, no transparency pattern, no shadow on the background
```

Put the files into `images/v2/` with the exact names below and push them. They'll be cut out, compressed and wired in.

---

## 1. Student portraits for the app (6 images)

Used as round avatars on the map pins, the light cards, the detail sheet and the night sky. Square **1024 × 1024**, white background, head and shoulders, centred, looking slightly toward the camera. Keep all six in one consistent style (generate them in one session, reusing the first as a style reference).

Common ending for all six:

```
head-and-shoulders portrait, friendly warm expression, soft amber rim light from the left as if from a lantern, simple shapes, centred, on a solid flat pure white background (#FFFFFF), no checkerboard, [shared style block]
```

| File | Prompt start |
|---|---|
| `avatar-maya.png` | `A cheerful 20-year-old nursing student with curly dark hair in a loose bun, rose-pink winter scarf, small gold hoop earrings,` |
| `avatar-dev.png` | `A relaxed 21-year-old software engineering student with short black hair and round glasses, lavender hoodie with headphones around his neck,` |
| `avatar-amira.png` | `A sporty 19-year-old kinesiology student wearing a teal hijab and a cozy fleece jacket, bright smile,` |
| `avatar-lucas.png` | `A tall 22-year-old geology student with messy light-brown hair and a short beard, mustard-orange toque and a flannel shirt,` |
| `avatar-sofia.png` | `A creative 20-year-old fine-arts student with a dark bob haircut and freckles, purple beret, paint smudge on her cheek,` |
| `avatar-alex.png` | `A friendly 20-year-old student with short wavy auburn hair, oversized cream knit sweater, gender-neutral look,` |

---

## 2. Onboarding (3 images, portrait)

Shown full-bleed at the top of the app's welcome flow, behind Wick. **1080 × 1350 (4:5)**, opaque. Leave the **bottom 40 % calm and dark**, because text sits there.

### 2.1 `onboard-1-alone.webp`
```
Vertical illustration, interior of a large university food court at blue hour seen through tall windows, many small tables with students sitting alone with headphones, cool blue light from phones, snowy campus and mountains visible outside, one small unlit paper lantern on an empty table in the foreground, lower 40 percent fades into deep indigo shadow, [shared style block]
```

### 2.2 `onboard-2-light.webp`
```
Vertical illustration, the same food court, now one table in the middle has a glowing paper lantern on it, warm amber light spilling across the table and two empty chairs, a student looking up hopefully, other students noticing, lower 40 percent fades into deep indigo shadow, [shared style block]
```

### 2.3 `onboard-3-together.webp`
```
Vertical illustration, three students laughing together around a small cafe table with a glowing paper lantern and mugs of hot chocolate, cozy warm light, snowy night campus through the window behind them, lower 40 percent fades into deep indigo shadow, [shared style block]
```

---

## 3. Empty and success states (3 images, transparent)

Square **1024 × 1024**, flat white background (removed afterwards).

### 3.1 `state-empty.png`, shown when a filter has no lights
```
Wick, a small cute paper lantern character with stubby legs, sitting on a snowy bench at night holding a tiny thermos, looking around patiently, a few snowflakes, centred, on a solid flat pure white background (#FFFFFF), no checkerboard, [shared style block]
```

### 3.2 `state-kindled.png`, the "Kindled" moment
```
Two small cute paper lantern characters high-fiving, their glows merging into one bright warm burst between their hands, tiny sparks around them, joyful, centred, on a solid flat pure white background (#FFFFFF), no checkerboard, [shared style block]
```

### 3.3 `state-ember.png`, "you both kept the ember"
```
A single glowing ember shaped like a small star cupped in two mittened hands, warm amber light on the mittens, tiny sparkles, centred, on a solid flat pure white background (#FFFFFF), no checkerboard, [shared style block]
```

---

## 4. Higher-resolution campus panorama (optional)

The "03 The idea" section now uses `og-cover`, which is sharper than `Visual direction`. If your generator can upscale or make larger images, this gives the best result:

### 4.1 `campus-panorama-hd.webp`, **2560 × 1440 or larger**, opaque
```
Wide cinematic panorama of a snowy university campus at blue hour on a winter evening in Calgary, the Rocky Mountains on the horizon with a peach and lavender sunset sky, downtown towers and the slim Calgary Tower in the distance, modern brick and glass campus buildings with warm lit windows, winding snowy paths lined with glowing street lamps, two students talking on a bench under one lamp in the lower middle, calm open sky in the upper third, highly detailed, crisp edges, [shared style block]
```

---

## 5. Checklist

| File | Size | Background | Where it goes |
|---|---|---|---|
| `images/v2/avatar-maya.png` … `avatar-alex.png` | 1024² | white | app: pins, cards, sheet, night sky |
| `images/v2/onboard-1-alone.webp` … `onboard-3-together.webp` | 1080×1350 | opaque | app: welcome carousel |
| `images/v2/state-empty.png` | 1024² | white | app: empty filter |
| `images/v2/state-kindled.png` | 1024² | white | app: "Kindled" screen |
| `images/v2/state-ember.png` | 1024² | white | app: "kept the ember" toast |
| `images/v2/campus-panorama-hd.webp` | ≥ 2560×1440 | opaque | site: section 03 |
