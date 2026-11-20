# Scene & Interaction Map

Eight scenes, one emotional arc: **invitation → awakening → time → memory →
obsession → play → words → keepsake.**

Navigation is a paper ribbon index. No conventional navbar. The visitor is
never trapped: every scene has back/forward, a direct index, and keyboard
control.

---

## Scene 0 — Cover / Invitation

**Visual mode:** kraft + blush lace (supplied 154802/154950, Pinterest `3a/8c/0c`)

**Composition:** Full-bleed paper cover. Layered stock, corner photo mounts,
lace strip, a tied ribbon across the vertical axis, wax-sealed tag, title in
editorial serif, placeholder date/name plate.

**Choreography (GSAP):**
1. Initial: cover closed, ribbon taut, decorations resting.
2. Trigger: pointer hover/tap or the *Open* control.
3. Staging: ribbon bow loosens → tails fall → tag swings.
4. Assembly: cover lifts on a rotateX hinge, decorations shift with the page.
5. Settle: Scene 1 revealed beneath.
6. Interaction state: Scene 1 objects become interactive.
7. Exit: cover unmounts via `AnimatePresence`.
8. Reduced motion: immediate state swap, cover simply fades.

**Interactions**

| Control | Input | Result |
| --- | --- | --- |
| Cover surface | hover / focus | parallax tilt + ribbon shimmer |
| `Open the scrapbook` button | click / Enter / Space | GSAP open timeline → Scene 1 |
| Wax tag | click | swings + reveals a one-line hint |

**Fallbacks:** the open action is a real `<button>`; hover is decorative only.

---

## Scene 1 — The scrapbook comes alive

**Visual mode:** kawaii pastel dense collage (154806/154908/154912)

**Composition:** Objects fly in from off-canvas and **assemble** into a
finished collage: paper ground → lace → photo → tape → stickers → handwritten
caption → character cutout. Ends with a small note explaining that objects are
interactive, plus the ribbon navigation.

**Choreography (GSAP timeline, staggered):** ground → lace → photo → tape →
stickers → caption write-on → cutout slide. Then subtle idle settle.

**Interactions**

| Control | Input | Result |
| --- | --- | --- |
| `Replay assembly` | click | timeline replays from 0 |
| Each sticker | click / Enter | spring pop + hidden caption reveals |
| Photo | click | lifts and opens the Scene 3 lightbox preview |
| Ribbon index | click / arrow keys | direct scene navigation |

---

## Scene 2 — Six months / timeline

**Visual mode:** soft blush + powder blue, quieter editorial

**Composition:** A ribbon/thread runs across the page with six keepsake
tokens threaded on it — one per month. Deliberately **not** six full pages.

**Choreography (GSAP):** ribbon draws left→right, then tokens drop and settle
onto it with stagger, each with a small rotation settle.

**Interactions**

| Control | Input | Result |
| --- | --- | --- |
| Each of 6 tokens | click / Enter | token lifts; memory card unfolds with date + note |
| Selected token again | click | card folds shut |
| `Close card` | Escape | closes open card |

**Content rule:** all dates and notes are `[PLACEHOLDER: …]`. Nothing invented.

---

## Scene 3 — Memories & photographs

**Visual mode:** warm corkboard/cream editorial (154802/154950, Pinterest `70/45/f7`, `96/86/b7`)

**Composition:** Asymmetric editorial spread — one large polaroid, a film
strip, a postcard, a ticket stub, a handwritten caption. Different
composition per memory (no repeated card grid).

**Choreography (GSAP):** film strip slides in horizontally, polaroid rotates
and lands with bounce, tape strips pin down in sequence, caption writes on.

**Interactions**

| Control | Input | Result |
| --- | --- | --- |
| Any photo | click / Enter | opens lightbox (enlarged + caption) |
| Lightbox next/prev | buttons, ← → keys, swipe | navigates memories |
| Lightbox close | Esc, button, backdrop | returns to same scene + scroll position |
| Film strip frame | click | selects that memory in the lightbox |
| Photo back-face (postcard) | click / drag / `Flip` button | flips to reveal note |

**Fallbacks:** every drag has a button equivalent; lightbox is a focus-trapped
dialog.

---

## Scene 4 — JoJo fan magazine

**Visual mode:** dark dramatic manga + blue Steel Ball Run + vintage newsprint
(154915, blue set, 154946) — a distinct chapter folded into the scrapbook.

**Composition:** Magazine chrome (masthead, issue line, `To Be Continued`
arrow). A manga panel grid with varied panel sizes, halftone stars, speed-line
dividers. Six character stickers in **different frames and scales**: Speedwagon,
Wamuu, Jean Pierre Polnareff, Okuyasu Nijimura, Vinegar Doppio, Enrico Pucci.

**Choreography (GSAP):** masthead slams in → panels tear/slide open one by one
→ speed-line sweep → stickers pop with spring → star motifs scatter.

**Interactions**

| Control | Input | Result |
| --- | --- | --- |
| Character sticker | click / Enter | sticker reacts (spring + rotate), manga panel reveals a caption card |
| `To Be Continued` arrow | click | plays the panel-reveal transition across the spread |
| Blue sub-spread toggle | click | switches manga palette pink→blue (echoes Steel Ball Run refs) |
| Replay | click | replays the panel assembly |

**Content rule:** captions are **creator-supplied placeholders only**. No canon
quotes are invented or attributed. Each sticker declares `quote: null` until
the creator fills it in; the UI shows `[PLACEHOLDER: add a quote]`.

**Assets:** `src/content/characters.ts` maps id → image path → alt. Drop real
licensed art into `public/assets/characters/` and update the path; layout and
animation code never changes.

---

## Scene 5 — Interactive keepsakes

**Visual mode:** Valentine flipbook red/cream + pastel (154905, Pinterest `88/1d/4a`)

**Composition:** A corkboard of six distinct keepsake objects, each a
different interaction type. Deliberately varied object scale and rotation.

**Choreography (GSAP):** board arrives, objects drop in one at a time with
paper weight, tape pins last.

**Interactions — every one has a clear affordance, a discoverable result and a
keyboard/touch fallback**

| Object | Gesture | Click/tap + keyboard equivalent | Result |
| --- | --- | --- | --- |
| Ribbon-pull drawer | drag tab right | `Pull` button / Enter | drawer slides open, photo reveals |
| Paper sleeve | swipe card out | `Slide` button / Enter | sleeve slides, message reveals |
| Polaroid | drag/fling | `Turn over` button / Enter | flips to handwritten back |
| Film strip | drag horizontally | `Next frame` button / Enter | frames advance, frame caption reveals |
| Gift box | — | `Open` button / Enter | lid lifts, paper confetti bursts |
| Hidden sticker | — | found by clicking the star | secret note appears |

Drag thresholds + snap points prevent half-states. No precision dragging on
small screens: all drags ≥ 96px travel with generous hit areas.

---

## Scene 6 — The letter

**Visual mode:** quiet burgundy + cream, negative space (Pinterest `df/04/6c`)

**Composition:** A single sealed envelope centred on calm paper. Nothing else
competes.

**Choreography (GSAP):** envelope settles → seal glints → on break: seal
cracks into two halves → flap opens → letter sheet slides up → unfolds in
stages → text reveals calmly (line by line, readable pacing).

**Interactions**

| Control | Input | Result |
| --- | --- | --- |
| Wax seal | click / Enter | crack + open + unfold sequence |
| `Re-fold` button | click | returns to sealed state for replay |

**Content rule:** letter body is `[PLACEHOLDER: …]`, supplied only by the
creator.

---

## Scene 7 — Closing / final keepsake

**Visual mode:** warm ivory + gold, composed and calm

**Composition:** Final anniversary message, a small 3D keepsake star (Three.js,
lazy-loaded, isolated, reduced-motion static fallback), and controls to
revisit any scene or replay the experience.

**Choreography (GSAP):** message assembles word by word → star settles →
controls arrive last.

**Interactions**

| Control | Input | Result |
| --- | --- | --- |
| `Replay from the top` | click | returns to Scene 0, resets state |
| Scene index chips | click / arrow keys | jump to any scene |
| 3D keepsake | drag / pointer | rotates (decorative; static under reduced motion) |

---

## Global interaction contract

- **Every** interactive element is a semantic `<button>` or `<a>` with a
  visible focus ring.
- Every drag/swipe has a labelled click/tap/keyboard alternative.
- Arrow keys move between scenes when no overlay is open; `Esc` closes overlays
  and preserves the current scene and scroll position.
- Ordinary scrolling never changes scenes — navigation is explicit only.
- `prefers-reduced-motion` removes transforms/timelines but keeps every outcome.
- No autoplay audio anywhere; no audio asset ships by default.

## Animation ownership (no property is fought over)

| System | Owns |
| --- | --- |
| **Framer Motion** | component enter/exit, `AnimatePresence` scene transitions, hover/tap feedback, layout shifts, modal/lightbox motion, state-driven interaction animation |
| **GSAP** | multi-step assembly timelines, cover opening, ribbon drawing, panel reveals, letter unfolding, confetti |
| **Three.js** | Scene 7 keepsake star only (dynamic import, budgeted, offscreen-paused) |
