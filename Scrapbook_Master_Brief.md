# Six-Month Anniversary Scrapbook --- Master Project Brief

> **Purpose:** Single source of truth for product requirements, visual
> design, implementation direction, animation language, and the coding
> agent's operating rules.
>
> **Project type:** Highly animated, interactive romantic scrapbook /
> JoJo-inspired digital magazine.
>
> **Primary stack:** Next.js, TypeScript, Framer Motion, GSAP, Three.js.
> Remotion and HeyGen are optional specialist tools, not default
> dependencies.

------------------------------------------------------------------------

# 1. Product Requirements Document (PRD)

## 1.1 Product vision

Create a highly personalized digital gift for a couple celebrating their
six-month anniversary. The recipient loves *JoJo's Bizarre Adventure*.
The experience should feel like opening and exploring a lovingly
assembled physical scrapbook that has come alive: photographs, letters,
paper scraps, stickers, manga panels, ribbons, film strips, flowers, and
keepsakes move, assemble, unfold, react, and reveal further scenes.

This is **not** a conventional anniversary landing page, a static
gallery, or a generic flipbook template. It is an animated, interactive
visual experience with a clear emotional progression.

The experience combines: - Romantic scrapbook craft: layered paper,
lace, bows, flowers, washi tape, handwritten notes, postcards,
polaroids, vintage cameras, music players, ticket stubs, buttons,
pearls, and film. - JoJo fan-magazine language: manga panels, character
cutouts, dramatic typography, graphic frames, expressive compositions,
manga sound-effect motifs, and character stickers. - Cinematic motion:
scrapbook objects enter the scene, arrange themselves into compositions,
respond to touch, and transition into new scenes. - Personal
storytelling: the couple's real memories, photographs, dates, inside
jokes, and letters are the emotional core.

## 1.2 Goals

1.  Deliver a memorable, emotionally resonant six-month anniversary
    experience.
2.  Make exploration playful: interactions should reveal content or
    trigger a meaningful animation.
3.  Make the visual composition feel handcrafted and editorial rather
    than component-library-driven.
4.  Make JoJo references recognizable and integrated, without allowing
    them to overwhelm the romantic story.
5.  Make content and assets easy to replace without rewriting layout or
    animation code.
6.  Deliver a polished responsive experience, especially on mobile
    portrait screens.

## 1.3 Non-goals

-   A public social network, account system, CMS, or analytics
    dashboard.
-   A generic e-commerce or SaaS interface.
-   An endless website just for length. A concise sequence of strong
    scenes is preferred.
-   Random animation with no narrative or interaction purpose.
-   Reproducing any Pinterest pin or supplied reference image
    pixel-for-pixel.
-   Generating or fabricating personal relationship facts, names, dates,
    photos, or private messages.

## 1.4 Audience and use case

**Primary visitor:** The boyfriend receiving the anniversary gift.

**Primary creator/editor:** The friend preparing the gift.

**Primary use case:** The recipient opens a private link on a phone or
desktop, enters the scrapbook, explores animated scenes and interactive
keepsakes, and reaches a personal anniversary letter.

The site should not require a login. Keep the experience straightforward
to open and share.

## 1.5 Core experience principles

-   **Every interaction has a consequence.** A gesture should open,
    reveal, assemble, transform, play, navigate, or otherwise change
    something.
-   **Animation is part of the storytelling.** Do not add motion only as
    decoration.
-   **Composition before widgets.** Build each scene as an art-directed
    collage, not a grid of generic cards.
-   **Variation is essential.** Alternate dense collage scenes, quieter
    letter scenes, manga-led spreads, photo-led scenes, and playful
    interactive scenes.
-   **Personal content leads.** JoJo details enrich the gift; the
    couple's story remains central.
-   **Respect the visitor.** No forced audio, no punishing gestures, no
    inaccessible tiny controls, and no motion that blocks reading.

## 1.6 Proposed information architecture / scene sequence

The exact number of scenes is flexible. Use the smallest sequence that
delivers a complete emotional arc.

### Scene 0 --- The invitation / cover

-   Full-screen scrapbook cover, like a physical journal or
    special-edition magazine.
-   Anniversary title and optional date/name placeholders.
-   Layers of paper, ribbon, sticker, photo corners, lace, and character
    cutouts.
-   A clear invitation to open the scrapbook.
-   The cover should visually react to hover/touch.
-   Opening interaction triggers a composed animation: ribbon loosens,
    cover lifts/slides/turns, decorative elements shift, and the first
    scene is revealed.

### Scene 1 --- The scrapbook comes alive

-   Establish the visual world.
-   Objects can fly, slide, rotate, pin, tape, or settle into place to
    form a collage.
-   Introduce a simple navigation affordance without looking like a
    conventional navbar.
-   A small note can explain that objects are interactive.

### Scene 2 --- Six months / timeline

-   A visual timeline or six keepsake markers.
-   Each marker opens a memory, date, note, photo, or small scene.
-   Do not invent dates or events. Use clearly marked editable
    placeholders until supplied.
-   Consider six visual tokens representing the six months, rather than
    forcing six full pages.

### Scene 3 --- Memories and photographs

-   Editorial photo spreads, polaroids, film strips, contact sheets,
    handwritten captions, ticket stubs, postcards, and layered notes.
-   Clicking/tapping a photo can enlarge it, flip it, reveal a caption,
    or open a small memory card.
-   Support a lightbox with keyboard and touch controls.
-   Allow different compositions for different memories.

### Scene 4 --- JoJo fan-magazine / character collage

-   A distinct visual chapter that feels like a JoJo-inspired fan
    magazine folded into the scrapbook.
-   Use manga panels, character stickers/cutouts, dramatic type, graphic
    dividers, star motifs, and comic-style motion.
-   Specifically requested characters: **Speedwagon, Wamuu, Jean Pierre
    Polnareff, Okuyasu Nijimura, Vinegar Doppio, and Enrico Pucci.**
-   Treat this list as required characters, not necessarily the only
    characters.
-   Character assets should be replaceable. Do not use low-resolution
    stretched images.
-   A character sticker can trigger a short reaction, a manga-panel
    reveal, a quote supplied by the creator, or a playful transition. Do
    not invent canon quotes or attribute invented lines to characters.

### Scene 5 --- Interactive keepsakes / surprises

Possible interactions: - Pull a ribbon or tab to slide open a hidden
compartment. - Drag or swipe a paper sleeve to reveal a photo or
message. - Tap an envelope seal to break it and unfold a letter. - Turn
a polaroid over to reveal a note. - Slide a film strip to reveal
frames. - Tap a sticker to trigger a character reaction or scene
transformation. - Open a small gift box to reveal a surprise. - Explore
a small bingo / memory challenge if the creator supplies content. -
Discover one or more hidden messages behind decorative elements.

Every interaction must have a clear affordance, a discoverable result,
and a usable fallback for keyboard and touch.

### Scene 6 --- The letter

-   A quieter, emotionally focused scene after the busier collage and
    character chapter.
-   Present the letter as a physical sheet, postcard, folded note, or
    envelope.
-   Reveal the letter through a deliberate interaction.
-   Use creator-provided text only. Keep placeholders clearly
    identifiable during development.

### Scene 7 --- Closing / final keepsake

-   A final composed scene with the anniversary message.
-   A memorable but not overwhelming closing animation.
-   Optionally let the visitor revisit scenes or replay the experience.
-   Do not trap the visitor in a one-way sequence.

## 1.7 Functional requirements

### Navigation and scene progression

-   Provide clear next/back navigation that fits the scrapbook visual
    language.
-   Support direct scene navigation or a discreet scene index if useful.
-   Preserve the visitor's current scene when opening and closing an
    overlay.
-   Support reduced-motion navigation without requiring complex
    gestures.
-   Avoid accidental page changes from ordinary scrolling.

### Gesture and object interactions

-   Support tap/click, keyboard activation, and touch gestures.
-   Swipe/drag interactions must have visible hints or labels.
-   Provide click/tap alternatives for every drag-only interaction.
-   Use thresholds and snap points so objects do not get stuck halfway.
-   Prevent browser navigation gestures from being hijacked
    unnecessarily.
-   Do not require precision dragging on small mobile screens.

### Content management

-   Store names, dates, memory text, image paths, character asset paths,
    captions, and letter text in structured content files.
-   Keep personal content separate from components and animation
    timelines.
-   Support missing optional images gracefully.
-   Use placeholders that are unmistakably placeholders.
-   Never fabricate relationship history.

### Media

-   Images should be locally hosted where possible, optimized, and sized
    appropriately.
-   Preserve transparent edges for sticker/cutout PNG or WebP assets.
-   Provide descriptive alt text for meaningful images.
-   Optional audio must be user-initiated, with visible play/pause/mute
    controls.
-   No autoplaying music or sound.

### Accessibility

-   Keyboard-operable controls.
-   Visible focus styles.
-   Semantic buttons and links.
-   Adequate contrast for text.
-   Useful alt text.
-   Respect `prefers-reduced-motion`.
-   Do not communicate state through color alone.
-   Ensure letter and caption text remain readable over textures.

### Responsive behavior

-   Design mobile-first for portrait screens, while creating a richer
    desktop composition.
-   Recompose scenes on mobile; do not merely scale down desktop
    collages.
-   Prevent horizontal overflow.
-   Keep touch targets comfortably sized.
-   Use mobile-friendly alternatives for dragging and page-turn
    gestures.
-   Verify common narrow widths and landscape orientation.

## 1.8 Acceptance criteria

The project is ready when: - The opening cover works and its interaction
reveals the first scene. - The experience contains a coherent beginning,
middle, and ending. - At least several meaningful interactions reveal
content or trigger scene changes. - The animation system includes object
assembly, transitions, reveals, and interaction feedback. - The required
JoJo characters can be placed and replaced through the asset/content
system. - The visual design consistently reflects the supplied
references and Pinterest research. - Desktop and mobile layouts are
art-directed separately. - All primary interactions work with mouse,
touch, and keyboard equivalents. - Reduced-motion mode remains
understandable and usable. - No personal details are invented. - No
broken image assets, dead controls, placeholder links, or console errors
remain. - Performance is acceptable on mid-range mobile hardware.

------------------------------------------------------------------------

# 2. Design Direction

## 2.1 Creative concept

**Working concept: "Six Months, One Little Universe"**

A personal keepsake universe assembled from fragments: photographs,
handwritten notes, manga panels, flowers, paper scraps, ribbons, and
tiny objects. The visitor does not simply scroll through content; they
discover and manipulate a collection of memories.

The art direction should combine: - A pastel romantic scrapbook. - A
handmade editorial / zine / magazine. - A JoJo fan collage. - A tactile,
animated paper theatre.

The concept name is provisional and editable.

## 2.2 Reference hierarchy

Use sources in this order:

1.  **User-provided screenshots and images in this conversation:**
    primary reference for the requested aesthetic and specific
    interaction examples.
2.  **The connected Pinterest MCP:** use it to research and collect
    additional visual references before finalizing compositions.
3.  **Implementation judgment:** use only to fill gaps, not to override
    the references.

The supplied references show several distinct visual modes: - Dense
pastel scrapbook collages with flowers, lace, buttons, decorative
borders, kawaii objects, cameras, music players, and character images. -
JoJo-heavy collages combining manga panels, cutout characters, stickers,
comic typography, and decorative objects. - Cleaner romantic editorial
pages with polaroids, handwritten notes, film strips, postcards, and
red/pink accents. - Blue-toned Johnny Joestar / Steel Ball Run collages
using manga art, stars, horseshoe motifs, paper textures, and
monochrome/blue compositions. - A vintage scrapbook / corkboard
composition with a camera, music player, film strip, receipts, postcard,
drinks, stickers, and photographs. - A chat requirement that it should
feel "like magazine sorta," that it need not be extremely long, and that
interactions should trigger scrapbook animations.

Do not flatten all these modes into one palette or one repetitive
template. Use controlled variation between scenes.

## 2.3 Pinterest MCP research --- mandatory workflow

The coding agent must use the **already-connected Pinterest MCP** if it
is available in the agent's tool environment.

Before implementing the visual system: 1. Inspect the available MCP
server/tool list and identify the Pinterest server and its actual tool
names/schemas. 2. Search Pinterest for reference clusters, not one broad
generic query. Suggested searches: -
`romantic digital scrapbook collage aesthetic` -
`pink lace scrapbook magazine layout` -
`JoJo Bizarre Adventure scrapbook collage` -
`Steel Ball Run Johnny Joestar blue collage` -
`interactive scrapbook website motion design` -
`vintage camera film strip scrapbook layout` -
`paper craft stop motion collage animation` -
`kawaii pastel sticker journal composition` 3. Open relevant boards/pins
and inspect full images where the connector permits. 4. Save the best
references into a local research note with: - Pin/board title - Source
URL or identifier returned by Pinterest - What visual feature is
useful - Which scene or component it informs - Any license/usage note
exposed by the source 5. Build a reference matrix mapping each scene to
2--5 useful references. 6. Use Pinterest for **research and
inspiration**, not as a source for hotlinking or copying images. 7. Do
not scrape, download, or reuse copyrighted pin images as production
assets unless the creator has rights or permission. 8. If Pinterest MCP
is unavailable in the current agent runtime, report that fact clearly
and ask for the connection to be exposed; do not pretend it was used or
silently substitute an unrelated source.

The agent must not assume tool names or schemas. Discover them from the
connected MCP environment and follow the actual tool documentation.

## 2.4 Visual system

### Palette direction

Use a flexible palette, not one flat pink theme.

-   Warm paper / ivory: `#F7F1E9` range.
-   Soft blush: `#F2C9D2` range.
-   Dusty rose / raspberry accents: `#B85E75` range.
-   Powder blue: `#C7D9E8` range.
-   Soft mint: `#C9E4D9` range.
-   Ink / charcoal: `#242326` range.
-   Occasional saturated JoJo accent colors should be sampled from the
    actual character art and used sparingly.

These are starting suggestions, not fixed final tokens. Validate against
the reference research.

### Materials and textures

-   Paper grain and lightly aged paper.
-   Torn paper edges.
-   Lace and crochet trims.
-   Washi tape and masking tape.
-   Glossy stickers and die-cut borders.
-   Transparent film and photo sleeves.
-   Corkboard or notebook paper where relevant.
-   Halftone and manga screentone.
-   Printed ink imperfections.
-   Subtle drop shadows that imply physical layering.

Avoid excessive blur, glassmorphism, neon gradients, and generic glossy
UI.

### Typography

Use a deliberate combination: - Expressive editorial serif for romantic
headings. - Clean sans-serif for labels and body copy. -
Handwritten/script accent for notes, signatures, and annotations. - Bold
condensed or manga-inspired display type for JoJo chapter moments.

Maintain readability. Script fonts should never be used for long
paragraphs.

### Composition

-   Overlap and depth are intentional.
-   Use asymmetric editorial layouts.
-   Vary object scale and rotation slightly.
-   Let some elements bleed beyond page edges.
-   Use negative space strategically in quieter scenes.
-   Avoid evenly spaced card grids unless the specific composition calls
    for a contact sheet.
-   Keep text and important controls unobstructed.

### JoJo integration

-   Use character art as cutouts, panels, sticker clusters, or editorial
    anchors.
-   Use a distinct visual treatment for the JoJo chapter, then echo
    smaller references elsewhere.
-   Character assets should not all be the same size or placed in
    identical frames.
-   Avoid inventing quotes or misleading character dialogue.
-   Prefer user-provided or properly licensed assets.

## 2.5 Component language

Build reusable primitives, but compose them differently per scene: -
`PaperLayer` - `TornPaper` - `WashiTape` - `LaceTrim` - `Sticker` -
`CharacterCutout` - `Polaroid` - `PhotoStrip` - `MangaPanel` -
`HandwrittenNote` - `Postcard` - `Envelope` - `WaxSeal` - `RibbonTab` -
`SlidingSleeve` - `FilmFrame` - `KeepsakeObject` - `SceneTransition` -
`SoundToggle` (only if audio exists)

These components should expose animation variants and interaction
callbacks without forcing every scene into the same layout.

------------------------------------------------------------------------

# 3. Animation Direction and Concept

## 3.1 Overall animation ambition

The user explicitly wants a **highly animated** experience. Treat
animation as a core product feature, not final polish.

The site should feel as though a scrapbook is being assembled and
manipulated in front of the visitor. Objects should move with intention:
photographs slide out of sleeves, paper pieces rotate into position,
stickers peel or pop into place, ribbons loosen, pages turn, notes
unfold, and collaged fragments combine to form complete scenes.

The motion language is tactile, expressive, layered, and cinematic. It
should not feel like a generic website with fade-in-on-scroll effects.

## 3.2 Signature concept: objects form scenes

Create several sequences where individual scrapbook objects enter from
different directions and **form a complete composition**.

Examples: - A blank paper background arrives first; lace trims slide
into place; a photo rotates and lands; tape strips pin it down; stickers
pop in; a handwritten caption writes on; a character cutout slides into
the composition. - Loose photographs and film frames fly in and align
into a memory wall. - A manga panel tears or slides open, revealing a
character collage beneath. - A ribbon travels across the screen, wraps
around a paper bundle, and settles into a bow. - A set of keepsakes
gathers around a central postcard to form a scene. - At the end of a
scene, the assembled pieces rearrange or sweep away to become the next
scene.

These should be designed as choreographed sequences with clear staging,
timing, easing, and a final resting composition.

## 3.3 Interaction-to-animation examples

Every interactive object should trigger a meaningful response.

  -----------------------------------------------------------------------
  User action                         Animation / resulting scene
  ----------------------------------- -----------------------------------
  Pull a ribbon tab                   A paper sleeve slides open and
                                      reveals a photograph or note

  Swipe a postcard                    The postcard flips over to reveal a
                                      handwritten message

  Drag a photo corner                 A photograph lifts from the page
                                      and expands into a memory view

  Tap a wax seal                      The seal cracks or lifts; the
                                      envelope opens and the letter
                                      unfolds

  Slide a film strip                  Frames move horizontally; selecting
                                      a frame reveals its memory

  Tap a character sticker             The sticker reacts, enlarges, or
                                      triggers a manga-panel transition

  Turn a page                         Paper curls/rotates; loose
                                      decorations shift with the page

  Open a gift box                     Lid lifts; paper confetti or
                                      keepsake elements reveal the
                                      surprise

  Tap a hidden sticker                A secret note or miniature scene
                                      appears

  Swipe across a collage              Elements rearrange into a new
                                      composition

  Hold a keepsake                     A short secondary animation or
                                      detail view appears

  Tap a replay control                The current scene's assembly
                                      animation plays again
  -----------------------------------------------------------------------

Do not implement all ideas automatically. Select the strongest
interactions that fit the supplied content and are reliable on mobile.

## 3.4 Motion qualities

-   **Paper:** slight weight, inertia, flex, curl, and settle.
-   **Photographs:** quick slide/rotation, gentle bounce, physical
    landing.
-   **Stickers:** peel, pop, wobble, scale, or spring.
-   **Ribbons:** flowing curved motion, wrap, loosen, and settle.
-   **Letters:** unfold in stages; text reveal should be calm and
    readable.
-   **Manga elements:** sharp cuts, panel reveals, impact frames, speed
    lines, and bold directional motion.
-   **Decorations:** subtle idle movement only when it adds life; avoid
    constant distracting motion.

Use spring motion for tactile objects, deliberate easing for scene
choreography, and restrained transitions for reading-focused content.

## 3.5 Animation choreography structure

For each major sequence, define: 1. **Initial state:** where objects
begin and what is visible. 2. **Trigger:** page entry, click, tap,
swipe, drag, or scroll. 3. **Staging:** which object moves first,
second, and third. 4. **Assembly:** how objects align, overlap, and form
the final composition. 5. **Settle:** the final resting state and any
subtle idle motion. 6. **Interaction state:** what can be clicked or
manipulated after assembly. 7. **Exit:** how the scene transitions to
the next one. 8. **Reduced-motion alternative:** an immediate or
simplified state change with no essential information lost.

Avoid animating every object simultaneously. Use stagger, hierarchy,
pauses, and anticipation.

## 3.6 Recommended technical division

### Framer Motion

Use for: - React component enter/exit. - Layout transitions. - Hover/tap
feedback. - Spring-based object movement. - Modal and overlay
transitions. - State-driven interaction animations. - Simple scene
transitions.

### GSAP

Use for: - Complex multi-step timelines. - Coordinated object
assembly. - Scroll-linked sequences where appropriate. - SVG path/ribbon
motion. - Scrubbed scene transitions. - Complex sequences that need
precise sequencing and timeline control.

Do not let Framer Motion and GSAP animate the same property on the same
element at the same time. Assign clear ownership per element/sequence.

### Three.js

Use selectively for: - A 3D page, book, or paper theatre effect if it
materially improves the experience. - Depth/parallax scenes. - A small
3D keepsake or stylized object. - Layered spatial transitions.

Do not use Three.js for ordinary 2D sticker movement. Keep the 3D layer
optional and performance-budgeted.

### Remotion

Use only if a scene genuinely needs a rendered video sequence, a
pre-rendered animated visual, or a reusable video composition. It is not
a replacement for live interactions.

### HeyGen

Optional and only if the creator explicitly wants a generated
talking-avatar/video message and provides the intended script/assets. It
is not required for the scrapbook and should not be added just because
it was mentioned as a possible tool.

## 3.7 Performance and accessibility rules

-   Aim for smooth 60fps where practical, especially for primary
    interactions.
-   Prefer transform and opacity animations.
-   Avoid animating expensive layout properties continuously.
-   Lazy-load non-critical media and 3D scenes.
-   Use dynamic imports for heavy Three.js or video components.
-   Pause or simplify idle animations when offscreen.
-   Provide `prefers-reduced-motion` behavior.
-   Reduced motion must preserve interaction outcomes and information.
-   Do not make a required action depend on a complex gesture.
-   Avoid excessive parallax, motion sickness triggers, and continuous
    background movement.
-   Provide a replay option for meaningful one-time sequences.

------------------------------------------------------------------------

# 4. Technical Architecture and Stack

## 4.1 Required stack

-   **Next.js** --- application framework; use the App Router unless the
    existing repository dictates otherwise.
-   **TypeScript** --- strict typing for content, scenes, and
    interaction state.
-   **Framer Motion** --- component and interaction animation.
-   **GSAP** --- orchestrated timelines and complex choreographed
    sequences.
-   **Three.js** --- selective 3D scenes and spatial effects.
-   **Remotion** --- optional rendered video compositions, only when
    justified.
-   **HeyGen** --- optional generated video/avatar content, only if
    explicitly required.

## 4.2 Suggested supporting tools

Choose based on the existing repository and actual needs: - Tailwind CSS
or CSS Modules for styling; do not introduce both without a clear
reason. - `next/image` for image optimization where compatible with the
asset type. - Zod for validating structured content if useful. - Lucide
or custom SVG for functional controls only; decorative scrapbook objects
should use designed assets. - A small state-management solution only if
React state/context is insufficient. Avoid adding a global store
prematurely.

## 4.3 Suggested project organization

Adapt this to the existing repository; do not blindly restructure it.

``` text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    scrapbook/
      ScrapbookShell.tsx
      SceneHost.tsx
      SceneNavigation.tsx
      PaperLayer.tsx
      Sticker.tsx
      Polaroid.tsx
      Envelope.tsx
      SlidingSleeve.tsx
      CharacterCutout.tsx
      MangaPanel.tsx
    motion/
      MotionProvider.tsx
      SceneTimeline.tsx
      ReducedMotion.tsx
  scenes/
    cover/
    opening/
    timeline/
    memories/
    jojo/
    keepsakes/
    letter/
    finale/
  content/
    anniversary.ts
    memories.ts
    characters.ts
    letters.ts
  hooks/
  lib/
    motion/
    assets/
    accessibility/
  styles/
public/
  assets/
    paper/
    textures/
    stickers/
    characters/
    photos/
    typography/
    audio/
docs/
  ...
```

## 4.4 Content model

Keep content data separate from visual components. A memory should be
expressible as data, not hardcoded JSX.

Example conceptual shape:

``` ts
type Memory = {
  id: string;
  title: string;
  date?: string;
  caption: string;
  image: string;
  alt: string;
  layout?: "polaroid" | "filmstrip" | "postcard" | "editorial";
  note?: string;
};

type CharacterAsset = {
  id: string;
  name: string;
  image: string;
  alt: string;
  role?: "sticker" | "cutout" | "panel";
  interaction?: string;
};
```

Do not fill real names, dates, relationship events, or personal messages
without creator-provided content.

## 4.5 State and interaction architecture

-   Model each scene as a component with a clear entry, active, and exit
    lifecycle.
-   Use explicit interaction state for envelopes, sleeves, polaroids,
    film strips, and hidden reveals.
-   Avoid deeply nested boolean state when a small state machine or
    discriminated union is clearer.
-   Ensure repeated triggers do not create overlapping broken timelines.
-   Kill or clean up GSAP timelines and event listeners on unmount.
-   Keep interaction state local to the component unless it genuinely
    spans scenes.

------------------------------------------------------------------------

# 5. Implementation Prompt for the Coding Agent

You are implementing a highly animated, interactive six-month
anniversary scrapbook website. Treat this document, the supplied
reference images, the supplied chat screenshots, and the Pinterest MCP
research as the project's source of truth.

## First: inspect, research, and plan

1.  Inspect the existing repository before editing. Identify the
    framework, package manager, current dependencies, app structure,
    styling system, and available assets.
2.  Inspect every supplied reference image and chat screenshot. Treat
    them as visual and requirement references, not assets to copy
    blindly.
3.  Discover and use the connected Pinterest MCP. Inspect its available
    tools and schemas, search relevant visual references, inspect
    pins/boards, and record the references that inform the art
    direction. Do not invent MCP tool names. If the Pinterest MCP is
    unavailable in your environment, state that clearly.
4.  Create a short reference matrix mapping visual references to scenes
    and design decisions.
5.  Create an implementation plan with scene sequence, component system,
    asset needs, interaction map, and animation choreography.
6.  Do not start by building a generic landing page.

## Then implement

Build the experience in the existing repository using: - Next.js -
TypeScript - Framer Motion - GSAP - Three.js where justified - Remotion
only if a rendered video composition is useful - HeyGen only if a
generated avatar/video message is explicitly required

The result should feel like a physical scrapbook transformed into an
animated digital magazine.

### Visual requirements

-   Layered paper, lace, flowers, ribbons, washi tape, polaroids,
    postcards, buttons, film strips, handwritten notes, cameras, music
    players, and sticker-like objects.
-   Pastel romantic scenes balanced with JoJo manga/fan-magazine scenes.
-   Dense collage compositions mixed with quieter editorial letter/photo
    scenes.
-   Asymmetric layouts, overlapping objects, paper depth, subtle
    texture, and deliberate negative space.
-   No generic SaaS layout, no repeated card grid, no generic
    gradient-heavy visual language.

### Animation requirements

This must be highly animated. Build choreographed sequences where
individual scrapbook elements move into the viewport and form complete
compositions. Use staged entrance, object assembly, tactile settling,
interactive manipulation, and animated scene transitions.

Implement meaningful interactions such as pulling a tab to slide open a
compartment, swiping a postcard to flip it, opening a sealed envelope,
lifting a photograph, moving a film strip, tapping character stickers,
and revealing hidden messages. Select the interactions that fit the
content; make each one reliable on touch, mouse, and keyboard.

### Content requirements

Use editable placeholders for missing names, dates, photographs,
memories, captions, and letter copy. Do not invent personal history.
Include the requested JoJo characters as replaceable assets: Speedwagon,
Wamuu, Jean Pierre Polnareff, Okuyasu Nijimura, Vinegar Doppio, and
Enrico Pucci.

### Quality requirements

-   Art-direct mobile and desktop layouts separately.
-   Make all controls functional.
-   Support reduced motion.
-   Avoid forced audio.
-   Optimize images and lazy-load heavy scenes.
-   Keep Three.js optional and isolated.
-   Avoid competing animation libraries controlling the same element.
-   Test every interaction and navigation path.
-   Do not leave placeholder controls that appear functional but do
    nothing.

## Deliverables

-   A complete working implementation in the existing repository.
-   A clean asset and content organization system.
-   A reference research note documenting Pinterest MCP sources and
    design decisions.
-   A scene/interaction map.
-   A brief implementation summary listing completed scenes,
    interactions, and any missing creator-provided assets/content.

Do not stop at a static mockup. The core deliverable is the working,
highly animated, interactive experience.

------------------------------------------------------------------------

# 6. AGENTS.md --- Repository Operating Instructions

## Project identity

This repository contains a personal six-month anniversary scrapbook
website. It is a cinematic, interactive, romantic scrapbook with
JoJo-inspired fan-magazine elements.

## Source of truth

Follow this order: 1. Explicit user requirements and raw requirement
document. 2. This master project brief. 3. Supplied reference images and
chat screenshots. 4. Pinterest MCP research documented by the agent. 5.
Existing repository conventions and technical judgment.

If sources conflict, do not silently discard a user requirement.
Document the conflict and choose the interpretation that best preserves
the user's explicit intent.

## Required workflow

-   Inspect before editing.
-   Reuse the existing stack and conventions when sensible.
-   Discover Pinterest MCP tools and schemas before using them.
-   Never claim Pinterest research was completed unless it was actually
    performed.
-   Plan scene structure and motion choreography before implementing
    complex animation.
-   Implement in small, verifiable stages.
-   Run lint, typecheck, and build commands that exist in the
    repository.
-   Test primary interactions on desktop and mobile breakpoints.

## Design rules

-   This must look like a crafted scrapbook / magazine, not a SaaS
    dashboard.
-   Do not use repeated generic cards as the primary visual language.
-   Vary scene composition and density.
-   Use paper, lace, tape, stickers, photos, film, handwritten notes,
    manga panels, and character cutouts as compositional materials.
-   Preserve readability and visual hierarchy.
-   Avoid random decoration that obscures content or controls.
-   Do not copy Pinterest images or supplied references as finished
    layouts.

## Animation rules

-   Animation is a core feature.
-   Build scenes from choreographed object movement and assembly.
-   Every interactive element must produce a meaningful result.
-   Use Framer Motion for component/state motion and GSAP for complex
    timelines; define ownership clearly.
-   Use Three.js only for effects that benefit from actual 3D.
-   Remotion and HeyGen are optional, not mandatory.
-   Respect reduced motion.
-   Clean up timelines, listeners, observers, and animation contexts.
-   Avoid animation jank and excessive simultaneous movement.

## Content and privacy rules

-   Never invent names, dates, memories, quotes, relationship events, or
    personal messages.
-   Use clearly marked placeholders when content has not been supplied.
-   Keep content separate from presentation.
-   Do not expose private assets or content in public source locations
    unless intended by the creator.

## Engineering rules

-   TypeScript first.
-   Prefer small reusable primitives and scene-specific compositions.
-   Avoid premature global state.
-   Use semantic, accessible controls.
-   All drag/swipe actions need click/tap alternatives.
-   All meaningful images need appropriate alt text.
-   No forced autoplay audio.
-   Optimize images and lazy-load expensive content.
-   Avoid unnecessary dependencies.
-   Do not let multiple animation systems control the same property on
    the same element.
-   Do not leave dead buttons, TODO interactions, or fake navigation in
    the finished experience.

## Definition of done

A change is not complete until: - It matches the visual direction. - It
works on mobile and desktop. - Its interactions work with pointer,
touch, and keyboard as appropriate. - It respects reduced motion. - It
passes available typecheck/lint/build checks. - Any missing content or
asset is clearly documented.
