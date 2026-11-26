'use client';

import { useEffect, useRef } from 'react';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { blueSubspreadIds, characters } from '@/content/characters';
import type { CharacterAsset } from '@/content/types';
import { characterPalette, paletteVars, CHARACTER_ORDER } from '@/content/palettes';
import { PlaceholderTag } from '@/components/scrapbook/PlaceholderTag';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { gsap } from '@/lib/gsap';
import { ART, element } from '@/lib/art';

/**
 * Chapter 04 — the JoJo fan magazine, one spread per character.
 *
 * This is the chapter the redesign is built around:
 *
 *  - **six full-bleed spreads**, contiguous, each printed on its character's
 *    own stock — scrolling from Wamuu's ice-blue to Doppio's blush is a torn
 *    paper edge and a gingham band away, never a hard colour switch;
 *  - **the hero cut-out** rises from behind the torn edge on scroll
 *    (parallax + scrubbed reveal), oversized and breaking its frame;
 *  - **editorial furniture**: part number, name, palette swatch, a
 *    deliberately empty quote slot, and one manga SFX sticker per spread;
 *  - every cut-out is a real `<button>` that opens the bio dialog — click,
 *    tap and Enter all work, and the quote slot stays an explicit
 *    `[PLACEHOLDER …]` until a line can actually be attributed.
 *
 * Framer Motion is not used here: all motion is scroll-shaped, so GSAP owns
 * it end to end.
 */

const SPREAD_LAYOUT = ['lg:grid-cols-[1.05fr_1fr]', 'lg:grid-cols-[1fr_1.05fr]'] as const;
const HERO_ALIGN = ['object-right-bottom', 'object-left-bottom'] as const;

function ginghamStyle(color: string): React.CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 14px, transparent 14px 28px), repeating-linear-gradient(0deg, ${color} 0 14px, transparent 14px 28px)`,
    opacity: 0.3,
  };
}

function CharacterSpread({
  character,
  index,
  onOpen,
}: {
  character: CharacterAsset;
  index: number;
  onOpen: (id: string) => void;
}) {
  const palette = characterPalette(character.id);
  const spreadRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLImageElement | null>(null);

  const hero = character.gallery[character.heroIndex] ?? character.gallery[0];
  const supporting = character.gallery.filter((_, i) => i !== character.heroIndex).slice(0, 2);
  const even = index % 2 === 0;

  /* The cut-out climbs out of the torn edge as the spread is scrolled. */
  useEffect(() => {
    const node = spreadRef.current;
    const heroImg = heroRef.current;
    if (!node || !heroImg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.fromTo(
      heroImg,
      { yPercent: 14, scale: 0.96 },
      {
        yPercent: -6,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(heroImg, { clearProps: 'transform' });
    };
  }, []);

  /* The gingham hand-over band wipes across as the spread arrives. */
  useEffect(() => {
    const node = spreadRef.current;
    if (!node) return;
    const band = node.querySelector<HTMLElement>('[data-spread-band]');
    if (!band) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.fromTo(
      band,
      { xPercent: -100 },
      {
        xPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: node, start: 'top bottom', end: 'top 60%', scrub: 0.4 },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(band, { clearProps: 'transform' });
    };
  }, []);

  return (
    <div
      ref={spreadRef}
      data-spread={character.id}
      className="relative isolate"
      style={paletteVars(palette) as React.CSSProperties}
    >
      {/* This character's stock, edge to edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, ${palette.bg} 0%, ${palette.bgDeep}33 45%, ${palette.bg} 100%)`,
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 material-halftone-lg opacity-[0.06]" />

      {/* The tear that hands over to this palette. */}
      <div
        aria-hidden="true"
        className="edge-torn-top pointer-events-none absolute inset-x-0 top-[-30px] z-20 h-[44px] sm:top-[-40px] sm:h-[56px]"
        style={{ background: palette.bg, filter: 'drop-shadow(0 5px 5px rgb(30 18 8 / 0.25))' }}
      />
      {/* Gingham band, scrubbed by scroll. */}
      <div
        aria-hidden="true"
        data-spread-band
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-8 sm:h-11"
        style={ginghamStyle(palette.gingham)}
      />

      <div
        className={[
          'relative z-10 mx-auto grid max-w-6xl items-center gap-6 px-4 py-20 sm:px-6 sm:py-24 lg:gap-10',
          SPREAD_LAYOUT[index % 2],
        ].join(' ')}
      >
        {/* ── editorial column ─────────────────────────────────────────── */}
        <div data-reveal className={even ? '' : 'lg:order-2'}>
          <p
            className="type-label text-[11px]"
            style={{ color: palette.accent }}
          >
            {character.part.toUpperCase()} · SPREAD {String(index + 1).padStart(2, '0')} OF{' '}
            {String(CHARACTER_ORDER.length).padStart(2, '0')}
          </p>

          <h3
            className="type-masthead mt-2 text-[clamp(2.2rem,7vw,4.6rem)] leading-[0.9]"
            style={{ color: palette.ink }}
          >
            {character.name}
          </h3>

          <p className="type-hand mt-2 text-[clamp(1.15rem,2.6vw,1.7rem)]" style={{ color: palette.accent }}>
            {palette.label}
          </p>

          {/* Palette swatches — the actual colours this spread is printed in. */}
          <div className="mt-4 flex items-center gap-2" aria-hidden="true">
            {[palette.bg, palette.bgDeep, palette.accent, palette.gingham].map((swatch) => (
              <span
                key={swatch}
                className="h-6 w-6 rounded-full border-2 border-white shadow-[0_2px_6px_rgb(0_0_0/0.25)]"
                style={{ background: swatch }}
              />
            ))}
          </div>

          {/* The quote slot: empty on purpose, and marked as such. */}
          <blockquote className="mt-5 max-w-md border-l-4 pl-4" style={{ borderColor: palette.accent }}>
            <p className="type-serif text-[clamp(1rem,2vw,1.2rem)] italic" style={{ color: palette.ink }}>
              [PLACEHOLDER: add a quote]
            </p>
            <footer className="type-label mt-1 text-[10px]" style={{ color: palette.ink, opacity: 0.7 }}>
              {character.name} · {character.part}
            </footer>
          </blockquote>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpen(character.id)}
              className="object-interactive rounded-full border-2 px-6 py-3 text-sm font-bold tracking-[0.12em] uppercase transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: palette.ink,
                background: palette.accent,
                color: palette.paper,
              }}
            >
              Read the bio →
            </button>
            <span className="type-label text-[10px]" style={{ color: palette.ink, opacity: 0.65 }}>
              TAP THE CUT-OUT TOO
            </span>
          </div>
        </div>

        {/* ── the cut-out, breaking its frame ──────────────────────────── */}
        <div data-reveal className={['relative', even ? '' : 'lg:order-1'].join(' ')}>
          {/* torn paper the hero rises from behind */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[-8%] bottom-[-6%] top-[18%] rounded-[14px] border-[6px] border-white shadow-[var(--shadow-lifted)]"
            style={{ background: palette.paper, rotate: even ? '-2.5deg' : '2.5deg' }}
          >
            <div className="absolute inset-0 material-paper opacity-70" />
          </div>

          <button
            type="button"
            onClick={() => onOpen(character.id)}
            aria-label={`Open the bio for ${character.name}`}
            className="group relative block w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-valentine)]"
          >
            <ArtImg
              ref={heroRef}
              src={hero?.src ?? ''}
              alt={character.alt}
              className={[
                'relative z-10 mx-auto h-[clamp(300px,52vw,560px)] w-full object-contain transition-[filter] duration-300',
                HERO_ALIGN[index % 2],
                'drop-shadow-[0_22px_26px_rgb(0_0_0/0.35)] group-hover:drop-shadow-[0_26px_30px_rgb(0_0_0/0.45)]',
              ].join(' ')}
            />
            <span
              aria-hidden="true"
              className="absolute -right-1 bottom-2 z-20 rounded-full border-2 px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{ background: palette.accent, color: palette.paper, borderColor: palette.ink }}
            >
              Open bio
            </span>
          </button>

          {/* supporting frames, taped beside the hero */}
          <div className="relative z-20 mt-4 flex justify-center gap-3 sm:gap-4">
            {supporting.map((art, i) => (
              <button
                key={art.src}
                type="button"
                onClick={() => onOpen(character.id)}
                aria-label={`Open the bio for ${character.name} — frame ${i + 2}`}
                className="w-24 border-[5px] border-white bg-white shadow-[var(--shadow-object)] transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)] sm:w-32"
                style={{ rotate: i % 2 === 0 ? '-4deg' : '5deg' }}
              >
                <ArtImg
                  src={art.src}
                  alt={`${character.name} — ${art.note}`}
                  className="block h-24 w-full object-cover object-top sm:h-32"
                />
              </button>
            ))}
          </div>

          {/* one manga SFX sticker per spread, used sparingly */}
          <ArtImg
            src={element(ART.sfxBang)}
            decorative
            data-parallax="0.3"
            className="pointer-events-none absolute -left-4 top-4 z-20 w-16 -rotate-[14deg] opacity-95 sm:w-20"
          />
          <ArtImg
            src={element(index % 2 === 0 ? ART.starCluster : ART.sparkles)}
            decorative
            data-parallax="0.22"
            className="pointer-events-none absolute -right-3 top-10 z-20 w-20 opacity-90"
          />
        </div>
      </div>
    </div>
  );
}

export default function JoJoScene() {
  const { goToScene, openOverlay, reducedMotion } = useScrapbook();
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  const blue = characters.filter((character) => blueSubspreadIds.includes(character.id));

  return (
    <div ref={scopeRef} className="relative">
      {/* ── Chapter masthead, printed on the chapter's own stock ─────────── */}
      <header className="relative mx-auto max-w-6xl px-4 pb-4 pt-16 sm:px-6 sm:pt-20">
        <ArtImg
          src={element(ART.tornNewsCaption)}
          decorative
          data-parallax="0.2"
          className="pointer-events-none absolute right-2 top-8 w-40 rotate-[6deg] opacity-90 sm:w-56"
        />
        <ArtImg
          src={element(ART.redStar)}
          decorative
          className="pointer-events-none absolute left-2 top-10 w-12 -rotate-[12deg]"
        />
        <p className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 04 · THE MAGAZINE</p>
        <h2 id="jojo-title" className="type-masthead mt-2 max-w-3xl text-[clamp(2.2rem,7vw,4.6rem)] leading-[0.9]">
          They keep turning up
        </h2>
        <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
          Six recurring faces, cut out and taped in — one full-page spread each, printed in that
          character&apos;s own colours. Tap a cut-out for the bio; every quote slot is empty on
          purpose until there is a line you can actually attribute.
        </p>
      </header>

      {/* ── Six contiguous full-bleed spreads ────────────────────────────── */}
      {characters.map((character, index) => (
        <CharacterSpread
          key={character.id}
          character={character}
          index={index}
          onOpen={(id) => openOverlay({ type: 'character', id })}
        />
      ))}

      {/* ── The blue sub-spread note ─────────────────────────────────────── */}
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="relative max-w-2xl rounded-[10px] border border-[#b9cbe0] bg-[#e7eff7] p-5 shadow-[var(--shadow-paper)]">
          <ArtImg
            src={element(ART.cornerFlourish)}
            decorative
            className="pointer-events-none absolute -right-4 -top-6 w-28 opacity-80"
          />
          <p className="type-label text-[10px] text-[var(--color-steel)]">THE BLUE SUB-SPREAD</p>
          <h3 className="type-serif mt-1 text-2xl text-[#26364a]">Inked in blue</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#3d5069]">
            A quieter page folded in behind the loud one — the cut-outs chosen for blue ink sit here
            instead of on the main spread.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {blue.map((character) => (
              <li key={character.id}>
                <button
                  type="button"
                  onClick={() => openOverlay({ type: 'character', id: character.id })}
                  className="flex items-center gap-2 rounded-full border border-white bg-white/80 py-1 pl-1 pr-3 text-left transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-steel)]"
                >
                  <ArtImg
                    src={character.image}
                    alt=""
                    decorative
                    className="h-8 w-8 rounded-full object-cover object-top"
                  />
                  <span className="text-sm font-semibold text-[#26364a]">{character.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <PlaceholderTag value="[PLACEHOLDER: confirm which characters are drawn in blue]" />
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goToScene('keepsakes')}
            className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
          >
            Next: the keepsakes →
          </button>
          <button
            type="button"
            onClick={() => goToScene('memories')}
            className="rounded-full border border-[#c9b79c] bg-[var(--color-cream)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
