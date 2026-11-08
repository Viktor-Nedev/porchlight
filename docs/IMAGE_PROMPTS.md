# Image prompts & art direction

All images below have been generated and are in use. Originals are in `images/`; the site uses cut-out, compressed copies in `assets/img/`. To regenerate one, reuse its prompt and replace the file in `images/`, then ask for it to be re-processed (checkerboard removal, resizing, WebP).

---

## 1. Visual direction

**World:** Calgary on a winter evening. The Rockies, the chinook arch, campus buildings and downtown windows lighting up one by one. The story moves from **dusk → blue hour → night**, and light is the metaphor for openness.

**Style keywords:** painterly flat illustration · gouache / risograph texture · soft paper grain · simple confident shapes · cozy, hopeful, a little magical · indie animated film background (not photoreal, not 3D, not anime).

**Palette** (keep every image inside it):

| Token | Hex | Use |
|---|---|---|
| Night indigo | `#0d0b1f` | deepest shadows, night sky |
| Dusk violet | `#3b2c6e` | upper sky, mountain shadows |
| Mauve | `#7a5f9e` | mountains, mid-tones |
| Chinook peach | `#f29e7d` | sunset light, cloud undersides |
| Lantern amber | `#ffb547` | every light source, windows, lamps |
| Warm cream | `#fff3c9` | highlights, glow cores |
| Snow lavender | `#eadff2` | snow, mist |

**Shared style block.** Paste this at the end of every prompt for consistency:

```
painterly flat illustration, gouache texture with subtle paper grain, limited palette of night indigo #0d0b1f, dusk violet #3b2c6e, mauve #7a5f9e, chinook peach #f29e7d, lantern amber #ffb547, warm cream #fff3c9 and snow lavender #eadff2, soft rim light, cozy and hopeful mood, indie animated film background art, clean shapes, no text, no logos, no watermark
```

**Negative prompt** (for tools that support it):

```
photorealistic, 3d render, anime, harsh outlines, text, letters, logo, watermark, signature, blurry, oversaturated neon, cluttered, extra limbs, distorted faces
```

### Tool tips
- **Transparent layers (hero layers 2–5, cards, mascot, token):** generate with an image model that supports a *transparent background* option (for example GPT Image in ChatGPT), or generate on a flat pure-white background and remove it afterwards (Photoshop "Remove background", remove.bg, Figma plugin, etc.).
- **Consistency:** generate the hero sky (#1) first, then feed it as a **style reference** for every other image (Midjourney `--sref <url>`, or "match the style of the attached image" in other tools).
- **Midjourney suffix:** `--ar 16:9 --style raw --stylize 250 --v 7`, with `--ar` changed per image.
- **Export:** WebP, quality 80–85. Hero layers at **3200 × 1800** (they're shown full-screen and cropped from the centre on phones, so keep important things in the middle 40 %).

---

## 2. Hero parallax: Calgary at dusk (5 layers)

Shown stacked, back to front, in the first full-screen scene. The site darkens them automatically as the user scrolls into the night, so **paint them all at dusk**.

### 2.1 `layer-1-chinook.webp`, sky and chinook arch · 16:9 · opaque
```
Wide panoramic evening sky over the Canadian prairies at dusk, a dramatic chinook arch: a smooth arching deck of lavender-violet cloud across the top of the frame with a sharp curved lower edge, below it a long luminous band of clear peach and apricot sky, fine brushed cloud streaks following the arch, a soft low sun glow in the centre near the bottom third, a few faint early stars at the very top, lots of empty sky, no land, no mountains, no buildings, [shared style block]
```

### 2.2 `layer-2-rockies.webp`, Rocky Mountains · 16:9 · transparent
```
Panoramic silhouette of the Canadian Rocky Mountains front range seen from Calgary at dusk, a continuous jagged ridge spanning the full width, sharp snow-capped peaks with lavender snow and dusty violet rock faces, peach rim light on the left-facing slopes from the setting sun, shadowed right faces, the mountains occupy only the lower half and the base is a solid flat colour to the bottom edge, transparent background above the ridge, [shared style block]
```

### 2.3 `layer-3-foothills.webp`, foothills · 16:9 · transparent
```
Two overlapping layers of soft rolling prairie foothills at dusk, smooth gentle curves spanning the full width, deep plum and violet tones with a faint peach glow on the crests, a light dusting of snow, a few tiny distant pine trees, occupying only the bottom 35 percent of the frame, solid colour to the bottom edge, transparent background above, [shared style block]
```

### 2.4 `layer-4-city.webp`, campus and downtown skyline · 16:9 · transparent
```
Silhouette skyline at dusk: on the left, low wide modern university campus buildings with a small dome and glass atrium; in the centre-right, a cluster of downtown Calgary towers and the slim Calgary Tower with its round observation pod and a small red beacon; deep indigo silhouettes with many small warm amber lit windows scattered unevenly, buildings sit on a common baseline at about 85 percent height and continue as solid colour to the bottom edge, transparent background above, [shared style block]
```

### 2.5 `layer-5-foreground.webp`, snowy foreground · 16:9 · transparent
```
Snowy foreground at the bottom of the frame: a gently curving bank of fresh lavender-white snow with soft blue shadows, dark indigo pine trees clustered at the far left and far right edges with snow on their branches, a few small footprints in the snow, the centre of the frame is open and empty snow (no people, no bench, no lamp post), occupying only the bottom 22 percent of the frame, transparent background above, [shared style block]
```
> The animated bench couple and the lamp post stay on top of this painting (they're drawn in code), so leave the centre empty.

---

## 3. Lantern cards, "three kinds of disconnection" (3 images)

Shown in the top-right corner of the three cards. Square **1024 × 1024**, transparent background.

### 3.1 `card-1-each-other.webp`, from each other
```
A single glowing paper lantern floating between two small simple figures who are turning toward each other, the lantern's warm amber light connecting them like a bridge, minimal composition centred on a transparent background, [shared style block]
```

### 3.2 `card-2-place.webp`, from a place
```
A glowing paper lantern shaped like a map pin, resting on a tiny cozy snow-covered campus building with warm lit windows, small and iconic, centred on a transparent background, [shared style block]
```

### 3.3 `card-3-self.webp`, from yourself
```
A small glowing lantern reflected in a still puddle of water, the reflection slightly brighter and warmer than the lantern itself, quiet and introspective, minimal, centred on a transparent background, [shared style block]
```

---

## 4. Mascot, "Wick" (optional, adds a lot of personality)

Wick is a small, shy paper lantern with stubby legs who glows brighter when someone says hi. Used on the prototype's welcome screen and in the deck.

### 4.1 `mascot-wick.webp`, main pose · 1:1 · transparent
```
Character design of "Wick", a cute small paper lantern creature with two stubby legs and tiny arms, a soft amber glow coming from inside its body, a warm cream face panel with two simple dot eyes and a small shy smile, a little wire handle on top like a cowlick, standing and waving shyly, full body, centred, transparent background, [shared style block]
```

### 4.2 `wick-sheet.png`, expression sheet for slides · 3:2 · white background
```
Character expression sheet of "Wick", a cute small paper lantern creature with stubby legs and an inner amber glow: six poses in a grid, (1) dim and sitting alone hugging its knees, (2) peeking from behind a coffee cup, (3) waving shyly, (4) glowing brightly and laughing with another lantern, (5) walking with a tiny backpack, (6) sleeping with its light low, consistent proportions, plain white background, [shared style block]
```

---

## 5. Lantern Table token (feasibility slide)

### 5.1 `lantern-table-token.webp`, product render · 4:3 · opaque
```
Product shot of a small tabletop sign shaped like a stylised lantern, frosted amber acrylic glowing softly from within, about 12 cm tall, with a small QR code on its base and the words left blank, standing on a long wooden university cafeteria table, blurred background of a warm busy student food court at evening, cozy, shallow depth of field, [shared style block]
```
> If you want the token to look like a real object, swap the style block for: `soft studio product photography, warm practical lighting`.

---

## 6. Presentation & social

### 6.1 `og-cover.jpg`, link preview / Devpost cover · 1200 × 630 · opaque
```
Wide cinematic illustration of a snowy university campus at blue hour with the Rocky Mountains and the Calgary Tower in the distance, most windows dark, a single window and one street lamp glowing warm amber in the centre, two small students on a bench beneath the lamp sitting close and talking, large calm empty sky in the upper-left third for a title, [shared style block]
```

### 6.2 `slide-problem.webp`, "the in-between hour" · 16:9 · opaque
```
Interior of a big busy university cafeteria in late afternoon, a long table where several students sit one empty seat apart from each other, each wearing headphones and looking down at a glowing phone, cold blue phone light on their faces, warm windows behind them, feeling of being alone in a crowd, slightly elevated side view, [shared style block]
```

### 6.3 `slide-solution.webp`, "leave a light on" · 16:9 · opaque
```
The same university cafeteria table at evening, now one student has a small glowing amber lantern on the table beside them and another student is walking over smiling with a coffee, warm light spreading across the table, other students glancing up curiously, hopeful mood, slightly elevated side view, [shared style block]
```

### 6.4 `slide-night-sky.webp`, closing slide background · 16:9 · opaque
```
A deep indigo night sky over snowy foothills, constellations drawn with thin glowing amber lines connecting stars like a network of friends, hundreds of tiny warm paper lanterns rising from a distant campus below, peaceful and celebratory, large empty space in the centre for a closing line, [shared style block]
```

---

## 7. File checklist

| File | Size | Background | Used in |
|---|---|---|---|
| `assets/img/layer-1-chinook.webp` | 3200×1800 | opaque | hero, sky |
| `assets/img/layer-2-rockies.webp` | 3200×1800 | transparent | hero |
| `assets/img/layer-3-foothills.webp` | 3200×1800 | transparent | hero |
| `assets/img/layer-4-city.webp` | 3200×1800 | transparent | hero |
| `assets/img/layer-5-foreground.webp` | 3200×1800 | transparent | hero |
| `assets/img/card-1-each-other.webp` | 1024² | transparent | section 04 |
| `assets/img/card-2-place.webp` | 1024² | transparent | section 04 |
| `assets/img/card-3-self.webp` | 1024² | transparent | section 04 |
| `assets/img/mascot-wick.webp` | 1024² | transparent | prototype welcome |
| `assets/img/og-cover.jpg` | 1200×630 | opaque | link preview, Devpost |
| `slide-*.webp`, `wick-sheet.png`, `lantern-table-token.webp` | 16:9 / 3:2 / 4:3 | n/a | presentation deck |

> **Attribution:** the handbook allows outsourced illustrations *with attribution*. When you add generated images, name the tool you used in the README's **Credits** section.
