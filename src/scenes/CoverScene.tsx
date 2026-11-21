'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, type GsapTimeline } from '@/lib/gsap';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { anniversary } from '@/content/anniversary';
import { readable } from '@/content/types';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { HeartSticker, StarSticker } from '@/components/scrapbook/Deco';

/**
 * Scene 1 — the closed scrapbook on the desk.
 *
 * GSAP owns the whole choreography: the book settling, the ribbon sliding in,
 * and the cover swinging open (stage shift + cover rotation on two different
 * elements, so no property is ever written by two systems).
 *
 * The cover is a real button, there is always a visible skip control, and
 * reduced motion starts the book already open with the same end state.
 */
export default function CoverScene() {
  const { goToScene, reducedMotion } = useScrapbook();
  const [userOpened, setUserOpened] = useState(false);
  /**
   * Reduced motion never plays the opening — the book is simply already open,
   * with the identical finished composition.
   */
  const open = userOpened || reducedMotion;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const inviteRef = useRef<HTMLDivElement | null>(null);
  const inviteCtaRef = useRef<HTMLButtonElement | null>(null);
  const settleRef = useRef<GsapTimeline | null>(null);
  const openRef = useRef<GsapTimeline | null>(null);

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
    <section aria-labelledby="cover-title" className="scene-stage flex flex-col items-center justify-center px-4 py-14">
      <h1 id="cover-title" className="sr-only">
        {anniversary.conceptTitle} — a six-month anniversary scrapbook
      </h1>

      <p className="type-label mb-4 text-[11px] text-[var(--color-cream)]/85">
        CHAPTER 00 · AN ANNIVERSARY SCRAPBOOK
      </p>

      <div className="stage-clip w-full max-w-[52rem]">
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
              <WashiTape variant="grid" className="absolute -left-3 top-6 z-10" rotate={-8} />

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

                <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
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
                <span className="absolute bottom-5 left-5 z-10">
                  <HeartSticker size={38} />
                </span>
                <span className="absolute right-5 top-16 z-10">
                  <StarSticker size={34} color="#f2c9d2" />
                </span>

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

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {!open && (
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-full border border-[#e9d7b6] bg-[#3c2a17]/70 px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)] transition hover:bg-[#3c2a17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cream)]"
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
    </section>
  );
}
