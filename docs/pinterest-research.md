# Pinterest MCP Research Note

Research performed with the connected **Pinterest MCP** before any visual
system was implemented. Tools discovered from the live MCP catalog (not
assumed):

| Tool | Purpose used for |
| --- | --- |
| `pinterest_search` | Cluster searches across 9 targeted queries |
| `pinterest_preview_images` | Visual inspection of 12 shortlisted pins |
| `pinterest_get_pin` | Available for detail lookup (not required) |
| `pinterest_related_pins` | Available for expansion (not required) |
| `pinterest_board_pins` | Available for board mining (not required) |
| `pinterest_download` | **Deliberately not used** — see license note |

## Searches executed

1. `romantic digital scrapbook collage aesthetic`
2. `JoJo Bizarre Adventure scrapbook collage`
3. `pink lace scrapbook magazine layout`
4. `Steel Ball Run Johnny Joestar blue collage`
5. `interactive scrapbook website motion design`
6. `vintage camera film strip scrapbook layout`
7. `paper craft stop motion collage animation`
8. `kawaii pastel sticker journal composition`
9. `manga magazine layout scrapbook page`
10. `JoJo character stickers printable kawaii`
11. `anniversary love letter envelope wax seal scrapbook`
12. `romantic polaroid film strip photo collage red`

## Reference matrix — cluster to scene

| # | Cluster | Useful visual feature | Informs scene / component |
| --- | --- | --- | --- |
| A | **Romantic scrapbook collage** (14 pins) | Layered paper scraps, torn edges, dried flowers, butterflies, vinyl, handwriting on cream stock | Scene 1 assembly, `PaperLayer`, `HandwrittenNote`, `Postcard` |
| B | **JoJo scrapbook collage** (14 pins) | Spiral-notebook spreads, halftone stars, manga panels taped over polka-dot paper, `To Be Continued` arrow | Scene 4 `MangaPanel`, `CharacterCutout`, sound-effect motifs |
| C | **Pink lace / magazine layout** (14 pins) | Lace borders, checkered ground, pearls, film strips with florals, soft blush palette | Scene 0 cover, Scene 3 `PhotoStrip`, `LaceTrim` |
| D | **Steel Ball Run / Johnny blue** (14 pins) | Blue-monochrome newsprint collage, horseshoe + star motifs, torn newspaper typography | Scene 4 blue sub-spread, `TornPaper`, star motifs |
| E | **Interactive scrapbook websites** (14 pins) | Notebook + polaroid + pinned manifesto + little radio; "live prototype, real scroll and interactions" | Scene shell, `SceneNavigation`, `RibbonTab`, motion pacing |
| F | **Vintage camera / film strip** (14 pins) | 35mm sprocket strips, DSLR + point-and-shoot cutouts, red alphabet stickers, clapperboard | Scene 3 `FilmFrame`, Scene 5 `SlidingSleeve` |
| G | **Paper-craft stop motion** (12 pins) | Layered cardstock cut-outs with visible depth shadows, single-object hero on flat colour | GSAP staging language: weight, settle, layered shadow |
| H | **Kawaii pastel sticker journal** (12 pins) | Sticker sheets, bunny/bear die-cuts, pastel labels, planner spreads | Scene 1 decorative `Sticker`, Scene 5 hidden sticker |
| I | **Manga magazine layout** (12 pins) | Editorial manga spreads with ribbon, mixed panel grids, altered-book collage | Scene 4 magazine chrome, panel grid variation |
| J | **Wax seal / love letter** (12 pins) | Burgundy envelope, embossed wax disc, lace-edged doily letter sheet | Scene 6 `Envelope` + `WaxSeal` |
| K | **Polaroid / film strip romance** (12 pins) | Red film strip over script paper, heart clips, sepia contact sheets | Scene 3 `Polaroid`, lightbox |

## Pins visually inspected (474px previews)

- `05/22/eb` — *Playful scrapbook website in motion · Mend* (behance) — **most
  useful single reference**: confirms a scrapbook site can be quiet, paper-led
  and still feel alive; informs Scene 1 pacing and the "no conventional navbar"
  rule.
- `26/21/01` — *jjba collage* — spiral notebook, polka-dot ground, halftone
  stars, `To Be Continued` arrow. Informs Scene 4 chrome.
- `53/cc/6f` — *jjba vintage collage* — cut-out figure over torn classical
  newsprint + florals. Informs Scene 4 character cutout treatment.
- `7e/51/49` — *johnny wallpaper (Blue Period)* — blue newsprint collage with
  script overlays. Informs Scene 4 blue panel.
- `96/86/b7` — *vintage camera + film strip* — sprocket strips, red alphabet.
  Informs Scene 3 contact sheet.
- `70/45/f7` — *film strip love* — red strip over handwritten script paper.
  Informs Scene 3 editorial spread.
- `df/04/6c` — *wax seal envelope* — burgundy + lace doily. Informs Scene 6.
- `88/1d/4a` — *pink notebook anime stickers* — die-cut kawaii stickers over
  photo panels. Informs Scene 1 + Scene 5 stickers.
- `48/0a/7b` — *manga journal with blue ribbon* — taped panels, grid paper,
  marginalia. Informs Scene 4 magazine spread.
- `67/c3/aa` — *paper stop-motion origami heart* — layered cardstock depth.
  Informs GSAP settle/shadow language globally.
- `9c/b2/db` — *jjba sticker sheet* — die-cut character stickers with white
  borders + `To Be Continued`. Informs Scene 4 sticker set.
- `3a/8c/0c` — *scrapbooking pink vibe (kraft journal)* — kraft + blush lace
  layering. Informs Scene 0 cover materials.

## Supplied reference images — 6 distinct visual modes

The 18 supplied screenshots in `RefrenceImages/` were inspected in full. They
are **not** one palette; the brief requires controlled variation:

| Mode | Supplied screenshots | Treatment |
| --- | --- | --- |
| 1. Corkboard / vintage keepsake (warm cream + cork) | 154802, 154950 | Scene 3 warm base |
| 2. Kawaii pastel dense collage (mint + blush) | 154806, 154908, 154912 | Scene 1 + Scene 5 |
| 3. Blue Johnny Joestar / Steel Ball Run | 154810, 154815, 154943, 155120, 155125, 155133, 155140, 155158, 155209 | Scene 4 blue sub-spread |
| 4. Dark dramatic manga (B&W, torn paper, halftone) | 154915 | Scene 4 impact frames |
| 5. Vintage newspaper / rock collage (eagle, flag, Caesar) | 154946, 155151 | Scene 4 editorial divider |
| 6. Valentine flipbook (red/cream, film strips, bingo) | 154905 | Scene 5 + Scene 6 red accents |

## Licence / usage notes

- Pinterest is used **for research and inspiration only**. No pin image is
  hotlinked, downloaded, or shipped as a production asset. `pinterest_download`
  was intentionally not called.
- Supplied reference screenshots remain the creator's material and are not
  copied pixel-for-pixel (per master brief §1.3 non-goals).
- No JoJo character art is bundled. Scene 4 ships **original placeholder
  cut-outs** that are clearly marked, plus a documented drop-in path so the
  creator can add art they hold rights to (`src/content/characters.ts`).
- All decorative texture (paper grain, halftone, lace, sprockets, stars) is
  generated as local SVG/CSS in the repository — no third-party image rights
  involved.

## Design decisions taken from this research

1. **Vary density per scene** — alternating dense collage (1, 4, 5) with quiet
   editorial (2, 6, 7) rather than one repeated card grid.
2. **Six visual modes, not one palette** — each scene picks a mode from the
   table above; shared tokens keep them related.
3. **Paper weight is the motion default** — from cluster G: layered cardstock
   with settle + shadow, never floaty fades.
4. **Manga moments are sharp** — from clusters B/D/I: hard cuts, speed lines,
   impact frames, in contrast to the romantic easing elsewhere.
5. **Navigation must read as stationery** — from cluster E: ribbon tabs and
   paper index rather than a navbar.
