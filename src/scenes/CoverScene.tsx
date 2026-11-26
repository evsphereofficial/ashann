'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { gsap, type GsapTimeline } from '@/lib/gsap';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { anniversary } from '@/content/anniversary';
import { readable } from '@/content/types';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { LaceTrim } from '@/components/scrapbook/LaceTrim';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { ART, PAPER, background, element, frame } from '@/lib/art';

/**
 * Chapter 00 — the cover of the scrapbook, lying open-able on the desk.
 *
 * Drag/swipe the cover left (mouse or touch) — or tap its pull-tab — to swing
 * the cover open in 3D and reveal the invitation inside.
 */
export default function CoverScene() {
  const { reducedMotion } = useScrapbook();
  const [userOpened, setUserOpened] = useState(false);
  const open = userOpened || reducedMotion;

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const curlSheenRef = useRef<HTMLDivElement | null>(null);
  const inviteRef = useRef<HTMLDivElement | null>(null);
  const settleRef = useRef<GsapTimeline | null>(null);
  const openRef = useRef<GsapTimeline | null>(null);

  const dragSession = useRef<{
    pointerId: number;
    startX: number;
    width: number;
    progress: number;
    moved: boolean;
  } | null>(null);

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  /* Decorative settle: book drops in, ribbon slides across, hint pops. */
  useEffect(() => {
    if (reducedMotion || !bookRef.current) return;

    const timeline = gsap.timeline({ delay: 0.12 });
    const scope = bookRef.current;
    timeline
      .from(scope, { y: -36, rotate: -3, opacity: 0, duration: 0.85, ease: 'power3.out' })
      .from(
        scope.querySelectorAll('[data-ribbon]'),
        { xPercent: -150, opacity: 0, duration: 0.7, ease: 'power2.out' },
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

  const applyBend = (progress: number) => {
    // Realistic cardstock bend: peaks around mid-turn (sin(pi * p)) with subtle skew & curl sheen
    const bend = Math.sin(progress * Math.PI);
    gsap.set(coverRef.current, {
      rotateY: -170 * progress,
      skewY: -7.5 * bend,
      scaleX: 1 - 0.04 * bend,
    });
    if (curlSheenRef.current) {
      gsap.set(curlSheenRef.current, {
        opacity: 0.15 + 0.55 * bend,
        xPercent: -35 * progress,
      });
    }
    if (typeof window !== 'undefined' && window.innerWidth >= 768 && stageRef.current) {
      const baseShift = -(stageRef.current.clientWidth * 0.25);
      gsap.set(stageRef.current, { x: baseShift * (1 - progress) });
    }
  };

  const completeOpen = () => {
    if (open) return;
    setUserOpened(true);
    settleRef.current?.kill();

    const inviteItems = inviteRef.current ? Array.from(inviteRef.current.querySelectorAll('[data-invite]')) : [];
    const state = { p: dragSession.current?.progress ?? 0 };

    const timeline = gsap.timeline();
    timeline.to(state, {
      p: 1,
      duration: 1.05,
      ease: 'power3.inOut',
      onUpdate: () => applyBend(state.p),
    }, 0);
    if (inviteItems.length > 0) {
      timeline.from(
        inviteItems,
        { y: 18, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' },
        0.5,
      );
    }

    openRef.current = timeline;
  };

  const snapClosed = () => {
    if (open) return;
    const state = { p: dragSession.current?.progress ?? 0 };
    gsap.to(state, {
      p: 0,
      duration: 0.48,
      ease: 'power3.out',
      onUpdate: () => applyBend(state.p),
      onComplete: () => {
        gsap.set([stageRef.current, coverRef.current], { clearProps: 'transform' });
      },
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (open) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragSession.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      width: Math.max(rect.width, 180),
      progress: 0,
      moved: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    settleRef.current?.kill();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const active = dragSession.current;
    if (!active || active.pointerId !== event.pointerId || open) return;
    const deltaX = active.startX - event.clientX;
    if (Math.abs(deltaX) > 6) active.moved = true;
    const progress = Math.min(1, Math.max(0, deltaX / (active.width * 0.78)));
    active.progress = progress;
    applyBend(progress);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const active = dragSession.current;
    if (!active || active.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragSession.current = null;
    if (!active.moved || active.progress >= 0.2) {
      completeOpen();
    } else {
      snapClosed();
    }
  };

  const handlePointerCancel = () => {
    dragSession.current = null;
    snapClosed();
  };

  return (
    <div ref={scopeRef} className="scene-stage relative flex flex-col items-center justify-center px-4 pb-24 pt-10 sm:px-6 sm:py-16">
      <h1 id="cover-title" className="sr-only">
        {anniversary.conceptTitle} — a six-month anniversary scrapbook
      </h1>

      {/* ── Desk layers: newsprint ground, gingham, dried flowers, books, lamp ── */}
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
        className="pointer-events-none absolute -left-12 top-6 w-40 -rotate-[14deg] opacity-80 lift-soft sm:w-72"
      />
      <ArtImg
        src={element(ART.driedRoses)}
        decorative
        eager
        data-parallax="0.28"
        className="pointer-events-none absolute right-1 top-6 w-24 rotate-[14deg] opacity-90 lift-soft sm:right-10 sm:top-16 sm:w-36"
      />
      <ArtImg
        src={element(ART.books)}
        decorative
        data-parallax="0.2"
        className="pointer-events-none absolute -left-8 bottom-24 hidden w-36 -rotate-[8deg] opacity-85 lift-soft md:block"
      />
      <ArtImg
        src={element(ART.redLily)}
        decorative
        data-parallax="0.42"
        className="pointer-events-none absolute bottom-16 left-2 w-20 -rotate-[10deg] opacity-90 lift-soft sm:bottom-10 sm:left-14 sm:w-32"
      />
      <ArtImg
        src={element(ART.doubleHeart)}
        decorative
        data-parallax="0.3"
        className="pointer-events-none absolute bottom-20 right-4 w-16 rotate-[8deg] opacity-90 sm:right-16 sm:w-28"
      />
      <ArtImg
        src={element(ART.pocketWatch)}
        decorative
        data-parallax="0.22"
        className="pointer-events-none absolute left-6 top-1/3 hidden w-28 -rotate-[8deg] opacity-85 lift-soft lg:block"
      />

      <div className="stage-clip relative z-10 mx-auto w-full max-w-[390px] md:max-w-[52rem]">
        <div ref={stageRef} className="cover-stage w-full">
          <div
            ref={bookRef}
            className="book min-h-[490px] w-full md:aspect-[10/7] md:min-h-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* ── Right-hand page: the invitation ─────────────────────────── */}
            <div
              ref={inviteRef}
              className="absolute inset-y-0 left-0 right-0 overflow-hidden rounded-[10px] border border-[#d8c9a9] bg-[var(--color-cream)] px-6 py-8 shadow-[var(--shadow-lifted)] md:left-1/2 md:rounded-l-none md:px-9 md:py-10"
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
              <LaceTrim className="absolute inset-x-0 bottom-0 opacity-70" />

              {/* chibi stickers tucked into the invitation (on top of paper) */}
              <ArtImg
                src={frame('okuyasu', 0)}
                alt="Okuyasu chibi cut-out, taped into the invitation."
                data-parallax="0.16"
                className="pointer-events-none absolute bottom-3 right-3 z-20 w-20 lift-soft sm:w-24"
              />
              <ArtImg
                src={frame('doppio', 1)}
                alt="Doppio chibi cut-out, taped into the invitation."
                data-parallax="0.24"
                className="pointer-events-none absolute bottom-4 right-24 z-20 w-16 lift-soft sm:right-32 sm:w-20"
              />

              <div className="relative z-10 flex h-full flex-col justify-center gap-4">
                <p data-invite className="type-label text-[11px] text-[var(--color-valentine)]">
                  FOR THE TWO OF US
                </p>
                <h2 data-invite className="type-serif text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.05]">
                  {anniversary.conceptTitle}
                </h2>
                <p data-invite className="type-hand text-[clamp(1.15rem,2.4vw,1.5rem)] leading-snug text-[var(--color-steel)]">
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
              </div>
            </div>

            {/* ── The cover itself (drag / swipe left or tap to open) ──────── */}
            <div
              ref={coverRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="book-cover absolute inset-y-0 left-0 right-0 cursor-grab select-none active:cursor-grabbing md:left-1/2"
              style={{
                transform: 'rotateY(0deg)',
                touchAction: 'pan-y',
                pointerEvents: open ? 'none' : 'auto',
              }}
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
                {/* Dynamic page-curl highlight/shadow that sweeps during bend */}
                <div
                  ref={curlSheenRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 opacity-0"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 20%, rgba(255,250,240,0.32) 48%, rgba(30,16,6,0.28) 72%, transparent 90%)',
                  }}
                />
                {/* Spine crease highlight on the left edge */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/35 via-white/10 to-transparent"
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

                <div className="relative flex h-full flex-col items-center gap-2.5 px-6 pt-8 text-center sm:pt-10">
                  <p className="type-label text-[10px] tracking-[0.3em] text-[#f3e2c4] sm:text-[11px]">
                    {anniversary.eyebrow.toUpperCase()}
                  </p>
                  <h2
                    className="type-masthead text-[clamp(2.2rem,7vw,4.4rem)] leading-[0.92] text-[#fbf7f1]"
                    style={{ textShadow: '0 3px 0 rgb(0 0 0 / 0.35)' }}
                  >
                    SIX
                    <br />
                    MONTHS
                  </h2>
                  <p className="type-hand text-[clamp(1.1rem,2.6vw,1.45rem)] text-[#f7e9cf]">
                    {readable(anniversary.recipientName)}
                  </p>
                  <p className="type-label text-[10px] text-[#e6d0aa]">
                    {readable(anniversary.dateLine)}
                  </p>
                </div>

                {/* Torn newsprint edge sits UNDER Speedwagon (z-10 vs z-20) */}
                <ArtImg
                  src={element(ART.tornNewsEdge)}
                  decorative
                  eager
                  className="pointer-events-none absolute -bottom-1 left-0 z-10 h-[25%] w-full object-cover opacity-95"
                />

                {/* Speedwagon cut-out ON TOP of the torn newsprint edge */}
                <ArtImg
                  src={frame('speedwagon', 0)}
                  alt="Speedwagon in a checkered top hat — supplied cut-out used as the cover portrait."
                  eager
                  className="pointer-events-none absolute -bottom-1 right-1 z-20 h-[56%] w-[48%] object-contain object-bottom drop-shadow-[0_14px_18px_rgb(0_0_0/0.55)] sm:right-3"
                />

                <ArtImg
                  src={element(ART.sfxBang)}
                  decorative
                  eager
                  className="pointer-events-none absolute left-4 top-1/2 z-20 w-14 -rotate-[12deg] opacity-95 sm:w-20"
                />
                <ArtImg
                  src={element(ART.bowRibbon)}
                  decorative
                  eager
                  className="pointer-events-none absolute bottom-16 left-3 z-20 w-16 -rotate-[8deg] opacity-95 lift-soft sm:w-20"
                />

                {/* ribbon */}
                <span
                  data-ribbon
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 top-0 z-10 h-full w-9 -rotate-[18deg] sm:w-11"
                  style={{
                    background:
                      'linear-gradient(90deg, #8e3e56, #c0546f 35%, #f2c9d2 50%, #c0546f 65%, #8e3e56)',
                    boxShadow: '0 4px 10px rgb(0 0 0 / 0.35)',
                  }}
                />
                <WashiTape variant="blush" className="absolute left-4 top-5 z-20" rotate={-14} width="88px" />
                <ArtImg
                  src={element(ART.redStar)}
                  decorative
                  eager
                  className="pointer-events-none absolute right-6 top-16 z-20 w-10 lift-soft"
                />
                <ArtImg
                  src={element(ART.starCluster)}
                  decorative
                  eager
                  className="pointer-events-none absolute bottom-28 left-5 z-20 w-14 opacity-90 sm:w-16"
                />

                {/* Swipe / drag pull-tab right on the cover */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    completeOpen();
                  }}
                  aria-label="Drag, swipe, or tap to open the book"
                  aria-expanded={open}
                  disabled={open}
                  data-open-hint
                  className="absolute bottom-5 left-4 z-30 rounded-full border-2 border-[#f3e2c4] bg-[#7a2128]/95 px-4 py-2 text-[10px] font-bold tracking-[0.15em] text-[#fbf7f1] uppercase shadow-[0_10px_18px_-10px_rgb(0_0_0/0.9)] transition hover:bg-[#96293a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3e2c4] disabled:opacity-0 sm:left-5 sm:px-4 sm:py-2.5 sm:text-[11px]"
                >
                  ← Open the book
                </button>
              </div>

              {/* back — becomes the left-hand page once opened on md+ */}
              <div className="book-face book-face-back hidden rounded-[10px] border border-[#d8c9a9] bg-[var(--color-cream)] shadow-[var(--shadow-lifted)] md:block">
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
    </div>
  );
}
