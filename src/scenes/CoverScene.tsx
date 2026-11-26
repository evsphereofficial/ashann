'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, type GsapTimeline } from '@/lib/gsap';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { anniversary } from '@/content/anniversary';
import { readable } from '@/content/types';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { ART, PAPER, background, element, frame } from '@/lib/art';

/**
 * Chapter 00 — the cover of the scrapbook, lying open-able on the desk.
 *
 * Composition: a full-bleed newsprint ground, a gingham swatch and a star
 * garland laid over it at different depths (`data-parallax`), and the book
 * itself carrying a real Speedwagon cut-out rising from behind a torn
 * newspaper edge — the magazine-cover treatment from the references.
 *
 * GSAP owns the choreography (settle → ribbon → cover swing). Framer Motion
 * is not used here at all, so nothing writes a transform GSAP is animating.
 * Reduced motion skips straight to the opened state with identical content.
 */
export default function CoverScene() {
  const { goToScene, reducedMotion } = useScrapbook();
  const [userOpened, setUserOpened] = useState(false);
  const open = userOpened || reducedMotion;

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const inviteRef = useRef<HTMLDivElement | null>(null);
  const inviteCtaRef = useRef<HTMLButtonElement | null>(null);
  const settleRef = useRef<GsapTimeline | null>(null);
  const openRef = useRef<GsapTimeline | null>(null);

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  /* Decorative settle: book drops in, ribbon slides across, hint pops. */
  useEffect(() => {
    if (reducedMotion || !bookRef.current) return;

    const timeline = gsap.timeline({ delay: 0.12 });
    const scope = bookRef.current;
    timeline
      .from(scope, { y: -40, rotate: -3.5, opacity: 0, duration: 0.85, ease: 'power3.out' })
      .from(
        scope.querySelectorAll('[data-ribbon]'),
        { xPercent: -160, opacity: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.45',
      )
      .from(
        scope.querySelectorAll('[data-open-hint]'),
        { scale: 0.5, opacity: 0, duration: 0.45, ease: 'back.out(2.2)' },
        '-=0.15',
      );

    settleRef.current = timeline;
    return () => {
      timeline.kill();
      gsap.set(scope, { clearProps: 'opacity,transform' });
      gsap.set(scope.querySelectorAll('[data-ribbon],[data-open-hint]'), { clearProps: 'opacity,transform' });
      settleRef.current = null;
    };
  }, [reducedMotion]);

  /* Reduced motion: write the finished geometry straight to the DOM. */
  useEffect(() => {
    if (!reducedMotion) return;
    gsap.set(stageRef.current, { x: 0 });
    gsap.set(coverRef.current, { rotateY: -170 });
  }, [reducedMotion]);

  useEffect(() => {
    return () => {
      settleRef.current?.kill();
      openRef.current?.kill();
    };
  }, []);

  const handleOpen = () => {
    if (open) return;
    setUserOpened(true);

    settleRef.current?.kill();

    const inviteItems = inviteRef.current ? Array.from(inviteRef.current.querySelectorAll('[data-invite]')) : [];

    const timeline = gsap.timeline({
      onComplete: () => inviteCtaRef.current?.focus(),
    });
    timeline
      .to(stageRef.current, { x: 0, duration: 1.05, ease: 'power3.inOut' }, 0)
      .to(coverRef.current, { rotateY: -170, duration: 1.15, ease: 'power3.inOut' }, 0);
    if (inviteItems.length > 0) {
      timeline.from(
        inviteItems,
        { y: 18, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' },
        0.55,
      );
    }

    openRef.current = timeline;
  };

  return (
    <div ref={scopeRef} className="scene-stage relative flex flex-col items-center justify-center px-4 py-16">
      <h1 id="cover-title" className="sr-only">
        {anniversary.conceptTitle} — a six-month anniversary scrapbook
      </h1>

      {/* ── Desk layers: newsprint ground, gingham, garland, scattered art ── */}
      <ArtImg
        src={background(PAPER.oldNewspaper)}
        decorative
        eager
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22] mix-blend-multiply"
      />
      <ArtImg
        src={background(PAPER.redGinghamSwatch)}
        decorative
        eager
        data-parallax="0.35"
        className="pointer-events-none absolute -left-14 top-8 w-56 -rotate-[14deg] opacity-80 lift-soft sm:w-72"
      />
      <ArtImg
        src={element(ART.starGarland)}
        decorative
        eager
        data-parallax="0.18"
        className="pointer-events-none absolute right-2 top-4 w-56 opacity-90 sm:right-8 sm:w-80"
      />
      <ArtImg
        src={element(ART.redLily)}
        decorative
        data-parallax="0.42"
        className="pointer-events-none absolute bottom-10 left-4 w-24 -rotate-[10deg] opacity-90 lift-soft sm:left-14 sm:w-32"
      />
      <ArtImg
        src={element(ART.doubleHeart)}
        decorative
        data-parallax="0.3"
        className="pointer-events-none absolute bottom-28 right-6 w-20 rotate-[8deg] opacity-90 sm:right-16 sm:w-28"
      />
      <ArtImg
        src={element(ART.cornerFlourish)}
        decorative
        data-parallax="0.22"
        className="pointer-events-none absolute left-6 top-1/3 hidden w-32 opacity-70 lg:block"
      />

      <p className="type-label relative z-10 mb-5 text-[11px] text-[var(--color-burgundy)]">
        CHAPTER 00 · AN ANNIVERSARY SCRAPBOOK
      </p>

      <div className="stage-clip relative z-10 w-full max-w-[52rem]">
        <div ref={stageRef} className="cover-stage w-full">
          <div
            ref={bookRef}
            className="book aspect-[4/5] w-full sm:aspect-[10/7]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* ── Right-hand page: the invitation ─────────────────────────── */}
            <div
              ref={inviteRef}
              className="absolute inset-y-0 left-0 right-0 overflow-hidden rounded-[10px] border border-[#d8c9a9] bg-[var(--color-cream)] px-6 py-7 shadow-[var(--shadow-lifted)] sm:left-1/2 sm:rounded-l-none sm:px-9 sm:py-10"
              style={{ visibility: open ? 'visible' : 'hidden' }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 material-lined opacity-60"
              />
              <ArtImg
                src={background(PAPER.ginghamNoteCard)}
                decorative
                className="pointer-events-none absolute -right-10 -top-8 w-44 rotate-[10deg] opacity-70"
              />
              <WashiTape variant="grid" className="absolute -left-3 top-6 z-10" rotate={-8} />

              {/* chibi stickers tucked into the invitation */}
              <ArtImg
                src={frame('okuyasu', 0)}
                alt="Okuyasu chibi cut-out, taped into the invitation."
                data-parallax="0.16"
                className="pointer-events-none absolute bottom-3 right-3 z-10 w-20 lift-soft sm:w-24"
              />
              <ArtImg
                src={frame('doppio', 1)}
                alt="Doppio chibi cut-out, taped into the invitation."
                data-parallax="0.24"
                className="pointer-events-none absolute bottom-4 right-24 z-10 w-16 lift-soft sm:right-32 sm:w-20"
              />

              <div className="relative flex h-full flex-col justify-center gap-4">
                <p data-invite className="type-label text-[11px] text-[var(--color-valentine)]">
                  CHAPTER 00 · THE INVITATION
                </p>
                <h2 data-invite className="type-serif text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.05]">
                  {anniversary.conceptTitle}
                </h2>
                <p data-invite className="type-hand text-[clamp(1.1rem,2.4vw,1.5rem)] leading-snug text-[var(--color-steel)]">
                  {anniversary.openingNote}
                </p>
                <div data-invite className="space-y-1.5">
                  <FilledOrPlaceholder
                    as="p"
                    value={anniversary.subtitle}
                    className="text-sm leading-relaxed text-[var(--color-ink-soft)]"
                  />
                  <FilledOrPlaceholder
                    as="p"
                    value={anniversary.dateLine}
                    className="type-label text-[11px] text-[var(--color-ink-faint)]"
                  />
                </div>
                <div data-invite className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    ref={inviteCtaRef}
                    type="button"
                    onClick={() => goToScene('opening')}
                    className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
                  >
                    Open the first page →
                  </button>
                  <span className="hint-dot" aria-hidden="true">
                    ↵
                  </span>
                </div>
                <p data-invite className="text-[11px] text-[var(--color-ink-faint)]">
                  Or press <kbd className="rounded border border-[#c9b79c] px-1">←</kbd>{' '}
                  <kbd className="rounded border border-[#c9b79c] px-1">→</kbd> to step through the chapters.
                </p>
              </div>
            </div>

            {/* ── The cover itself ────────────────────────────────────────── */}
            <div
              ref={coverRef}
              className="book-cover absolute inset-y-0 left-0 right-0 sm:left-1/2"
              style={{ transform: 'rotateY(0deg)' }}
            >
              {/* front */}
              <div className="book-face rounded-[10px] border border-[#3c2a17] bg-[#6b4423] shadow-[var(--shadow-lifted)]">
                <div aria-hidden="true" className="absolute inset-0 material-kraft opacity-45" />
                <ArtImg
                  src={background(PAPER.oldNewspaper)}
                  decorative
                  eager
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-multiply"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-3 rounded-[6px] border border-[#e9d7b6]/60"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(115deg, rgb(255 255 255 / 0.22), transparent 42%), radial-gradient(120% 80% at 50% 120%, rgb(0 0 0 / 0.35), transparent 60%)',
                  }}
                />

                <div className="relative flex h-full flex-col items-center gap-3 px-6 pt-8 text-center sm:pt-10">
                  <p className="type-label text-[10px] tracking-[0.3em] text-[#f3e2c4] sm:text-[11px]">
                    {anniversary.eyebrow.toUpperCase()}
                  </p>
                  <h2
                    className="type-masthead text-[clamp(2rem,7vw,4.4rem)] leading-[0.92] text-[#fbf7f1]"
                    style={{ textShadow: '0 3px 0 rgb(0 0 0 / 0.35)' }}
                  >
                    SIX
                    <br />
                    MONTHS
                  </h2>
                  <p className="type-hand text-[clamp(1rem,2.6vw,1.4rem)] text-[#f7e9cf]">
                    {readable(anniversary.recipientName)}
                  </p>
                  <p className="type-label text-[10px] text-[#e6d0aa]">
                    {readable(anniversary.dateLine)}
                  </p>

                  {/* Speedwagon rising from behind the torn newsprint edge */}
                  <ArtImg
                    src={frame('speedwagon', 0)}
                    alt="Speedwagon in a checkered top hat — supplied cut-out used as the cover portrait."
                    eager
                    className="pointer-events-none absolute -bottom-1 right-1 h-[58%] w-[46%] object-contain object-bottom drop-shadow-[0_14px_18px_rgb(0_0_0/0.5)] sm:right-3"
                  />
                  <ArtImg
                    src={element(ART.tornNewsEdge)}
                    decorative
                    eager
                    className="pointer-events-none absolute -bottom-1 left-0 h-[26%] w-full object-cover opacity-95"
                  />
                  <ArtImg
                    src={element(ART.sfxBang)}
                    decorative
                    eager
                    className="pointer-events-none absolute left-4 top-1/2 w-16 -rotate-[12deg] opacity-95 sm:w-20"
                  />
                </div>

                {/* ribbon */}
                <span
                  data-ribbon
                  aria-hidden="true"
                  className="absolute -right-6 top-0 h-full w-9 -rotate-[18deg] sm:w-11"
                  style={{
                    background:
                      'linear-gradient(90deg, #8e3e56, #c0546f 35%, #f2c9d2 50%, #c0546f 65%, #8e3e56)',
                    boxShadow: '0 4px 10px rgb(0 0 0 / 0.35)',
                  }}
                />
                <WashiTape variant="blush" className="absolute left-4 top-5 z-10" rotate={-14} width="88px" />
                <ArtImg
                  src={element(ART.redStar)}
                  decorative
                  eager
                  className="absolute right-6 top-16 z-10 w-10 lift-soft"
                />
                <ArtImg
                  src={element(ART.starCluster)}
                  decorative
                  eager
                  className="absolute bottom-24 left-5 z-10 w-16 opacity-90"
                />

                {/* the open affordance */}
                <button
                  type="button"
                  onClick={handleOpen}
                  aria-label="Open the scrapbook cover"
                  aria-expanded={open}
                  disabled={open}
                  data-open-hint
                  className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border-2 border-[#f3e2c4] bg-[#7a2128] px-6 py-3 text-[12px] font-bold tracking-[0.18em] text-[#fbf7f1] uppercase shadow-[0_10px_18px_-10px_rgb(0_0_0/0.9)] transition hover:bg-[#96293a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3e2c4] disabled:opacity-0"
                >
                  Open the cover
                </button>
              </div>

              {/* back — becomes the left-hand page once opened */}
              <div className="book-face book-face-back hidden rounded-[10px] border border-[#d8c9a9] bg-[var(--color-cream)] shadow-[var(--shadow-lifted)] sm:block">
                <div aria-hidden="true" className="absolute inset-0 material-newsprint opacity-40" />
                <ArtImg
                  src={element(ART.tornLinedCorner)}
                  decorative
                  className="pointer-events-none absolute -bottom-4 -left-4 w-32 opacity-80"
                />
                <ArtImg
                  src={element(ART.driedRoses)}
                  decorative
                  className="pointer-events-none absolute right-4 top-4 w-24 rotate-[8deg] opacity-90 lift-soft"
                />
                <div className="relative flex h-full flex-col justify-center gap-3 px-8">
                  <p className="type-label text-[11px] text-[var(--color-valentine)]">INSIDE THE COVER</p>
                  <p className="type-hand text-[clamp(1.3rem,2.6vw,2rem)] leading-tight text-[var(--color-ink)]">
                    {anniversary.coverHint}
                  </p>
                  <p className="type-serif text-sm italic text-[var(--color-ink-soft)]">
                    Tap, drag, peel, unfold — every object answers.
                  </p>
                  <span aria-hidden="true" className="mt-2 h-px w-24 bg-[#c9b79c]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
        {!open && (
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-full border border-[#8a6a3f] bg-[#3c2a17]/85 px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)] transition hover:bg-[#3c2a17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
          >
            Open the cover
          </button>
        )}
        <button
          type="button"
          onClick={() => goToScene('opening')}
          className="rounded-full border border-[#c9b79c] bg-[var(--color-cream)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
        >
          Skip to the opening spread
        </button>
      </div>
    </div>
  );
}
