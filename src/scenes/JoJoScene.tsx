'use client';

import { motion } from 'framer-motion';
import { assembleContainer, dropIn } from '@/lib/motion';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { blueSubspreadIds, characters } from '@/content/characters';
import { PlaceholderTag } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { SpeedLines, HalftoneStar, ButtonSticker, SafetyPin } from '@/components/scrapbook/Deco';

/**
 * Scene 5 — the JoJo fan-zine folded into the back of the book.
 *
 * Six cut-outs as stickers (the recurring gag: they keep turning up), a
 * manga-panel ground of halftone + speed lines, and a blue sub-spread on the
 * right. Every sticker opens a real dialog; no canon quote is ever invented.
 */
export default function JoJoScene() {
  const { goToScene, openOverlay } = useScrapbook();
  const blue = characters.filter((character) => blueSubspreadIds.includes(character.id));

  return (
    <section aria-labelledby="jojo-title" className="scene-stage px-4 py-14 sm:px-6">
      <div className="relative mx-auto w-full max-w-6xl">
        <header className="relative mb-8 max-w-2xl">
          <WashiTape variant="grid" className="absolute -top-6 left-10" rotate={-7} />
          <p className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 04 · THE MAGAZINE</p>
          <h2 id="jojo-title" className="type-masthead mt-2 text-[clamp(2rem,6vw,3.8rem)] leading-[0.95]">
            They keep turning up
          </h2>
          <p className="mt-3 text-[var(--color-ink-soft)]">
            Six recurring faces, cut out and taped in. Tap one for the bio — every quote slot is
            empty on purpose until there is a line you can actually attribute.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          {/* ── main manga spread ───────────────────────────────────────── */}
          <div className="relative">
            <SpeedLines
              className="pointer-events-none absolute -left-10 -top-12 h-[320px] w-[320px] opacity-[0.07]"
              count={24}
            />
            <PaperLayer material="halftone" rotate={-0.8} className="relative px-5 py-6 shadow-lifted sm:px-7 sm:py-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="type-label text-[10px] text-[var(--color-ink-faint)]">FAN-ZINE SPREAD</p>
                  <p className="type-display text-[clamp(1.4rem,3.4vw,2.2rem)] leading-none tracking-wide">
                    THE RECURRING CAST
                  </p>
                </div>
                <span aria-hidden="true" className="mt-1">
                  <ButtonSticker size={38} />
                </span>
              </div>

              <motion.ul
                variants={assembleContainer}
                initial="hidden"
                animate="visible"
                className="mt-6 flex flex-wrap items-end justify-center gap-4 sm:gap-5"
              >
                {characters.map((character) => (
                  <motion.li
                    key={character.id}
                    variants={dropIn({ y: 60, rotate: character.rotation - 16 }, 0)}
                  >
                    <button
                      type="button"
                      onClick={() => openOverlay({ type: 'character', id: character.id })}
                      className="object-interactive group block w-[132px] rounded-[10px] border-[3px] border-white bg-white p-2 text-left shadow-[var(--shadow-object)] transition hover:shadow-[var(--shadow-lifted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)] sm:w-[152px]"
                    >
                      <span
                        className="block origin-bottom transition-transform duration-200"
                        style={{ transform: `rotate(${character.rotation}deg) scale(${character.scale})` }}
                      >
                        <span
                          className="block overflow-hidden rounded-[6px]"
                          style={{ background: character.accent }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={character.image}
                            alt={character.alt}
                            className="h-28 w-full object-cover object-top sm:h-32"
                            loading="lazy"
                          />
                        </span>
                        <span className="type-label mt-2 block text-[9px] text-[var(--color-valentine)]">
                          {character.part.toUpperCase()}
                        </span>
                        <span className="type-serif block text-[15px] leading-tight text-[var(--color-ink)]">
                          {character.name}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[10px] font-bold tracking-[0.12em] text-[var(--color-ink-faint)] uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        Read the bio →
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>

              <p className="mt-6 border-t border-dashed border-[#c9b79c] pt-4 text-xs text-[var(--color-ink-soft)]">
                Placeholder cut-outs only — no official artwork ships with this project. Drop art you
                hold rights to over the files listed in each bio to replace them.
              </p>
            </PaperLayer>

            <span aria-hidden="true" className="absolute -bottom-6 left-8">
              <SafetyPin size={52} />
            </span>
          </div>

          {/* ── blue sub-spread ─────────────────────────────────────────── */}
          <aside aria-labelledby="blue-title" className="relative">
            <PaperLayer material="powder" rotate={1.6} className="relative h-full px-5 py-6 shadow-lifted sm:px-6">
              <span aria-hidden="true" className="absolute -right-3 -top-5">
                <HalftoneStar size={46} color="#3f6489" />
              </span>
              <p className="type-label text-[10px] text-[var(--color-steel)]">THE BLUE SUB-SPREAD</p>
              <h3 id="blue-title" className="type-serif mt-1 text-2xl text-[#26364a]">
                Inked in blue
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3d5069]">
                A quieter page folded in behind the loud one — the cut-outs chosen for blue ink sit
                here instead of on the main spread.
              </p>

              <ul className="mt-5 space-y-3">
                {blue.map((character) => (
                  <li key={character.id}>
                    <button
                      type="button"
                      onClick={() => openOverlay({ type: 'character', id: character.id })}
                      className="flex w-full items-center gap-3 rounded-[8px] border border-white/80 bg-white/75 p-2 text-left transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-steel)]"
                    >
                      <span
                        className="h-14 w-14 shrink-0 overflow-hidden rounded-[5px]"
                        style={{ background: character.accent }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={character.image}
                          alt=""
                          className="h-full w-full object-cover object-top"
                          loading="lazy"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="type-serif block truncate text-base text-[#26364a]">
                          {character.name}
                        </span>
                        <span className="type-label block text-[9px] text-[#51677f]">
                          {character.part.toUpperCase()} · BLUE INK
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <PlaceholderTag value="[PLACEHOLDER: confirm which characters are drawn in blue]" />
              </div>
            </PaperLayer>
          </aside>
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
    </section>
  );
}
