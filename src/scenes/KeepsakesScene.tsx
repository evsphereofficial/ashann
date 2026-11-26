'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { useDragProgress } from '@/hooks/useDragProgress';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { useChapterReveal, useParallax } from '@/components/scrapbook/ChapterSection';
import { keepsakes } from '@/content/keepsakes';
import { memories } from '@/content/memories';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { LaceTrim } from '@/components/scrapbook/LaceTrim';
import { HandwrittenNote } from '@/components/scrapbook/HandwrittenNote';
import { Polaroid } from '@/components/scrapbook/Polaroid';
import { ArtImg } from '@/components/scrapbook/ArtImg';
import { ART, PAPER, background, element } from '@/lib/art';

const findKeepsake = (id: string) => keepsakes.find((item) => item.id === id) ?? keepsakes[0];

const DRAG_STYLE = { touchAction: 'pan-y' as const, transition: 'transform 280ms var(--ease-paper)' };

const buttonClass =
  'rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-5 py-2.5 text-xs font-bold tracking-[0.12em] text-[var(--color-ink)] uppercase transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]';

const activeButtonClass =
  'rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-5 py-2.5 text-xs font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]';

interface PageTheme {
  bg: string;
  bgDeep: string;
  accent: string;
  ink: string;
  gingham: string;
  title: string;
  subtitle: string;
}

const PAGE_THEMES: Record<string, PageTheme> = {
  drawer: {
    bg: '#efe4d6',
    bgDeep: '#cbb392',
    accent: '#8e3e56',
    ink: '#2b2118',
    gingham: '#a9855a',
    title: 'Tucked in the drawer',
    subtitle: 'Pull the ribbon to slide it open.',
  },
  clouds: {
    bg: '#dceaf6',
    bgDeep: '#9fc0df',
    accent: '#275782',
    ink: '#162738',
    gingham: '#6e93b8',
    title: 'Above the clouds',
    subtitle: 'Part the clouds to see what is waiting underneath.',
  },
  giftbox: {
    bg: '#f9e3e8',
    bgDeep: '#e5a8b8',
    accent: '#9c2229',
    ink: '#35141c',
    gingham: '#c0392b',
    title: 'Unwrap this',
    subtitle: 'Untie the bow and lift the lid.',
  },
  sleeve: {
    bg: '#eef2e8',
    bgDeep: '#c3d1b2',
    accent: '#486b42',
    ink: '#1f2b1c',
    gingham: '#6e9167',
    title: 'Pressed between pages',
    subtitle: 'Slide the card out of its pocket.',
  },
  filmstrip: {
    bg: '#f0e7d8',
    bgDeep: '#cbb89c',
    accent: '#7a2128',
    ink: '#261e16',
    gingham: '#4a4750',
    title: 'Still frames',
    subtitle: 'Step through the negatives on the lightbox.',
  },
  hidden: {
    bg: '#fbeee0',
    bgDeep: '#e7c19e',
    accent: '#c0392b',
    ink: '#2d1c12',
    gingham: '#c0392b',
    title: 'Under the star',
    subtitle: 'Peel back the star to read what is beneath.',
  },
};

type StageTransition = 'slide-left' | 'bloom' | 'drop-top' | 'slide-right' | 'unfold' | 'tilt-pop';

const STAGE_FROM: Record<StageTransition, gsap.TweenVars> = {
  'slide-left': { x: -36, y: 14, rotate: -2, opacity: 0.4 },
  bloom: { scale: 0.94, y: 18, opacity: 0.4 },
  'drop-top': { y: -28, rotate: 2, opacity: 0.4 },
  'slide-right': { x: 36, y: 14, rotate: 2, opacity: 0.4 },
  unfold: { y: 28, rotateX: 14, scale: 0.96, opacity: 0.4 },
  'tilt-pop': { y: 26, rotate: -3.5, scale: 0.93, opacity: 0.4 },
};

function KeepsakeSpread({
  theme,
  transition = 'bloom',
  className = '',
  decor,
  overlayLayer,
  children,
}: {
  theme: PageTheme;
  transition?: StageTransition;
  className?: string;
  decor: ReactNode;
  overlayLayer?: ReactNode;
  children: ReactNode;
}) {
  const spreadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = spreadRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const band = node.querySelector<HTMLElement>('[data-spread-band]');
    const stage = node.querySelector<HTMLElement>('[data-page-stage]');

    const ctx = gsap.context(() => {
      if (band) {
        gsap.fromTo(
          band,
          { xPercent: -100 },
          {
            xPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: node, start: 'top bottom', end: 'top 60%', scrub: 0.4 },
          },
        );
      }
      if (stage) {
        gsap.from(stage, {
          ...STAGE_FROM[transition],
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 78%', once: true },
        });
      }
    }, node);

    return () => ctx.revert();
  }, [transition]);

  return (
    <article
      ref={spreadRef}
      className={['relative isolate overflow-x-clip', className].join(' ')}
      style={{ backgroundColor: theme.bg, color: theme.ink }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bgDeep}44 50%, ${theme.bg} 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="edge-torn-top pointer-events-none absolute inset-x-0 top-[-30px] z-20 h-[44px] sm:top-[-40px] sm:h-[56px]"
        style={{ background: theme.bg, filter: 'drop-shadow(0 5px 5px rgb(30 18 8 / 0.22))' }}
      />
      <div
        aria-hidden="true"
        data-spread-band
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-8 sm:h-11"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${theme.gingham} 0 14px, transparent 14px 28px), repeating-linear-gradient(0deg, ${theme.gingham} 0 14px, transparent 14px 28px)`,
          opacity: 0.28,
        }}
      />

      {decor}

      <div data-page-stage className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-8 max-w-xl">
          <h3 data-reveal="left" className="type-serif text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.02]">
            {theme.title}
          </h3>
          <p data-reveal="write" data-reveal-delay="0.08" className="type-hand mt-1.5 text-xl sm:text-2xl" style={{ color: theme.accent }}>
            {theme.subtitle}
          </p>
        </header>

        {children}
      </div>

      {overlayLayer}
    </article>
  );
}

/* ── Page 01 · Tucked in the drawer ─────────────────────────────────────── */
function RibbonDrawerPage() {
  const keepsake = findKeepsake('drawer');
  const { progress, setProgress, handlers } = useDragProgress(true);
  const open = progress > 0.5;

  return (
    <KeepsakeSpread
      theme={PAGE_THEMES.drawer}
      transition="slide-left"
      decor={
        <>
          <ArtImg
            src={background(PAPER.notepadCollage)}
            decorative
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.14] mix-blend-multiply"
          />
          <ArtImg
            src={element(ART.redButton)}
            decorative
            data-parallax="0.3"
            className="pointer-events-none absolute right-6 top-14 w-12 opacity-90 lift-soft sm:w-14"
          />
          <ArtImg
            src={element(ART.ribbonDoodle)}
            decorative
            data-parallax="0.22"
            className="pointer-events-none absolute -left-8 bottom-10 w-32 -rotate-[12deg] opacity-85 sm:w-40"
          />
          <ArtImg
            src={element(ART.ginghamNote)}
            decorative
            data-parallax="0.18"
            className="pointer-events-none absolute -right-6 bottom-8 hidden w-32 rotate-[8deg] opacity-90 lift-soft sm:block"
          />
          <ArtImg
            src={element(ART.tornNewsEdge)}
            decorative
            data-parallax="0.14"
            className="pointer-events-none absolute bottom-0 left-0 w-64 opacity-70 sm:w-96"
          />
          <ArtImg
            src={element(ART.cornerFlourish)}
            decorative
            data-parallax="0.15"
            className="pointer-events-none absolute left-6 top-12 hidden w-24 opacity-65 sm:block"
          />
        </>
      }
    >
      <PaperLayer material="cream" rotate={-0.6} className="relative p-5 shadow-lifted sm:p-8">
        <WashiTape variant="stripe" className="absolute -top-3 left-8" rotate={-5} width="110px" />
        <LaceTrim className="absolute inset-x-0 bottom-0 opacity-60" />

        <div className="relative h-52 overflow-hidden rounded-[10px] border-2 border-[#8a6238] bg-[#efe4d6] sm:h-60">
          <div
            className="absolute inset-0 flex flex-col justify-center gap-3 bg-[#FBF7F1] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-7"
            style={{ opacity: 0.2 + progress * 0.8 }}
          >
            <div className="w-24 shrink-0 sm:w-28">
              <Polaroid src={memories[0].image} alt={memories[0].alt} rotate={-4} />
            </div>
            <div className="min-w-0 flex-1">
              <FilledOrPlaceholder
                as="p"
                value={keepsake.reveal}
                className="type-hand text-xl leading-snug sm:text-2xl"
              />
            </div>
          </div>

          <div
            {...handlers}
            className="absolute inset-y-0 left-0 flex w-full cursor-grab items-center justify-between bg-[#a9855a] px-5 shadow-lg active:cursor-grabbing sm:px-8"
            style={{ ...DRAG_STYLE, transform: `translateX(${progress * 100}%)` }}
            aria-hidden="true"
          >
            <div className="material-kraft absolute inset-0 opacity-70" />
            <span className="type-label relative z-10 text-[11px] text-[#fbf7f1]">
              DRAG OR PULL RIBBON →
            </span>
            <span
              className="relative z-10 h-8 w-20 rounded-full border border-white/40"
              style={{
                background: 'linear-gradient(90deg,#8e3e56,#f2c9d2 50%,#8e3e56)',
                boxShadow: 'inset 0 2px 4px rgb(0 0 0 / 0.35)',
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setProgress(open ? 0 : 1)}
            aria-pressed={open}
            className={open ? activeButtonClass : buttonClass}
          >
            {open ? 'Push drawer shut' : 'Pull the ribbon'}
          </button>
        </div>
      </PaperLayer>
    </KeepsakeSpread>
  );
}

/* ── Crisp Illustrated Cumulus Cloud Cutouts (matching reference style) ─ */
function CloudCutout({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 135"
      aria-hidden="true"
      className={['drop-shadow-[0_10px_14px_rgba(32,68,108,0.22)]', className].join(' ')}
    >
      {/* Crisp white cumulus silhouette with subtle sky-blue outline */}
      <path
        d="M36 122 C16 122 6 108 8 92 C10 77 24 68 38 69 C42 44 65 26 92 28 C106 10 132 4 156 14 C174 22 184 39 186 56 C198 49 216 51 228 62 C244 74 250 96 238 112 C231 120 220 122 208 122 Z"
        fill="#ffffff"
        stroke="#b8d4ee"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Soft sky-blue bottom shading inside the cloud */}
      <path
        d="M28 115 C18 112 14 102 18 93 C28 103 48 108 74 106 C95 113 128 114 154 107 C178 112 208 112 230 102 C232 110 224 116 212 117 L36 117 Z"
        fill="#dceefa"
      />
    </svg>
  );
}

function CloudBank({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left';
  return (
    <div aria-hidden="true" className="relative h-full w-full select-none">
      {/* 2 overlapping clouds per bank (4 total across the screen) piled on top of each other */}
      <CloudCutout
        className={[
          'absolute top-[10%] w-[125%] sm:w-[105%]',
          isLeft ? '-left-[12%]' : '-right-[12%] -scale-x-100',
        ].join(' ')}
      />
      <CloudCutout
        className={[
          'absolute top-[30%] w-[130%] sm:w-[110%]',
          isLeft ? '-left-[4%]' : '-right-[4%] -scale-x-100',
        ].join(' ')}
      />
    </div>
  );
}

/* ── Page 02 · Above the clouds (Overlapping Cloud Pile) ────────────────── */
function UnderTheCloudsPage() {
  const keepsake = findKeepsake('hidden');
  const [parted, setParted] = useState(false);

  return (
    <KeepsakeSpread
      theme={PAGE_THEMES.clouds}
      transition="bloom"
      className="z-30"
      decor={
        <>
          <ArtImg
            src={background(PAPER.blueShatteredStars)}
            decorative
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.22] mix-blend-multiply"
          />
          <ArtImg
            src={element(ART.moon)}
            decorative
            data-parallax="0.32"
            className="pointer-events-none absolute right-6 top-16 w-20 opacity-90 lift-soft sm:w-28"
          />
          <ArtImg
            src={element(ART.starCluster)}
            decorative
            data-parallax="0.22"
            className="pointer-events-none absolute bottom-10 left-6 w-24 opacity-90 sm:w-32"
          />
          <ArtImg
            src={element(ART.streetLamp)}
            decorative
            data-parallax="0.18"
            className="pointer-events-none absolute bottom-4 right-8 hidden w-24 opacity-80 sm:block"
          />
        </>
      }
      overlayLayer={
        <div className="pointer-events-none absolute inset-0 z-30 overflow-x-clip">
          <motion.button
            type="button"
            onClick={() => setParted(true)}
            aria-label="Part the left clouds"
            animate={{ x: parted ? '-112%' : '0%', opacity: parted ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 85, damping: 18 }}
            className={[
              'absolute inset-y-0 left-[-8%] w-[74%] cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-white',
              parted ? 'pointer-events-none' : 'pointer-events-auto',
            ].join(' ')}
          >
            <CloudBank side="left" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setParted(true)}
            aria-label="Part the right clouds"
            animate={{ x: parted ? '112%' : '0%', opacity: parted ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 85, damping: 18 }}
            className={[
              'absolute inset-y-0 right-[-8%] w-[74%] cursor-pointer text-right focus-visible:outline-2 focus-visible:outline-white',
              parted ? 'pointer-events-none' : 'pointer-events-auto',
            ].join(' ')}
          >
            <CloudBank side="right" />
            <span className="type-hand absolute left-[10%] top-[46%] -translate-y-1/2 rounded-full border border-[#b8d4ee] bg-white/95 px-4 py-2 text-lg text-[#275782] shadow-md sm:text-2xl">
              tap to part the clouds
            </span>
          </motion.button>
        </div>
      }
    >
      <div className="relative rounded-[14px] border border-white/60 bg-gradient-to-b from-[#1a3047] to-[#284768] p-6 text-[#f5f8fc] shadow-[var(--shadow-lifted)] sm:p-10">
        <div className="mx-auto max-w-xl py-6 text-center">
          <ArtImg src={element(ART.sparkles)} decorative className="mx-auto mb-3 w-20 opacity-90" />
          <div className="rounded-[10px] border border-white/25 bg-white/10 p-5 backdrop-blur-xs">
            <FilledOrPlaceholder
              as="p"
              value={keepsake.reveal}
              className="type-hand text-2xl leading-snug text-[#fffdf7]"
              placeholderClassName="text-[#fde2e8]"
            />
          </div>
          <HandwrittenNote stock="note" rotate={1.4} className="mx-auto mt-5 max-w-sm text-left">
            Even on cloudy days, this page was waiting underneath.
          </HandwrittenNote>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setParted((p) => !p)}
            aria-pressed={parted}
            className={parted ? activeButtonClass : buttonClass}
          >
            {parted ? 'Gather the clouds' : 'Part the clouds'}
          </button>
        </div>
      </div>
    </KeepsakeSpread>
  );
}

/* ── Page 03 · Unwrap this (Gift Box) ───────────────────────────────────── */
function VelvetGiftBoxPage() {
  const keepsake = findKeepsake('giftbox');
  const [open, setOpen] = useState(false);

  return (
    <KeepsakeSpread
      theme={PAGE_THEMES.giftbox}
      transition="drop-top"
      decor={
        <>
          <ArtImg
            src={background(PAPER.grungeRed)}
            decorative
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12] mix-blend-multiply"
          />
          <ArtImg
            src={background(PAPER.redGinghamSwatch)}
            decorative
            className="pointer-events-none absolute -right-12 top-14 w-48 rotate-[10deg] opacity-65 sm:w-64"
          />
          <ArtImg
            src={element(ART.crownDoodle)}
            decorative
            data-parallax="0.25"
            className="pointer-events-none absolute left-6 top-16 hidden w-16 -rotate-[10deg] opacity-85 sm:block"
          />
          <ArtImg
            src={element(ART.doubleHeart)}
            decorative
            data-parallax="0.3"
            className="pointer-events-none absolute bottom-12 right-8 w-20 opacity-90"
          />
          <ArtImg
            src={element(ART.bowDoodle)}
            decorative
            data-parallax="0.2"
            className="pointer-events-none absolute bottom-10 left-8 hidden w-20 -rotate-[8deg] opacity-85 sm:block"
          />
        </>
      }
    >
      <PaperLayer material="cream" rotate={0.8} className="relative p-6 shadow-lifted sm:p-10">
        <WashiTape variant="blush" className="absolute -top-3 right-10" rotate={6} width="100px" />

        <div className="mx-auto max-w-md pt-6" style={{ perspective: 1100 }}>
          <div className="relative rounded-b-[12px] border-2 border-[#7a2128] bg-[#f7cad4] p-5 pt-10 shadow-[0_18px_28px_-14px_rgba(80,16,24,0.45)] sm:p-7 sm:pt-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 bg-gradient-to-r from-[#8e242c] via-[#c0392b] to-[#8e242c] opacity-90"
            />

            <motion.div
              animate={{ y: open ? -10 : 0, scale: open ? 1 : 0.96, opacity: open ? 1 : 0.25 }}
              transition={{ type: 'spring', stiffness: 190, damping: 18 }}
              className="relative z-10 rounded-[8px] border border-dashed border-[#8e3e56] bg-[#fffaf0] p-5 text-center shadow-sm"
            >
              <FilledOrPlaceholder
                as="p"
                value={keepsake.reveal}
                className="type-hand text-xl leading-snug sm:text-2xl"
              />
            </motion.div>

            <motion.button
              type="button"
              onClick={() => setOpen((c) => !c)}
              aria-pressed={open}
              aria-label={open ? 'Close the gift box lid' : 'Untie the ribbon and open the gift box'}
              initial={false}
              animate={{ rotateX: open ? -122 : 0, y: open ? -18 : 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className="absolute -inset-x-2 -top-4 z-20 flex h-14 origin-top items-center justify-center rounded-[10px] border-2 border-[#6e1a20] bg-[#a82933] text-[#fbf7f1] shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="material-halftone absolute inset-0 opacity-15" aria-hidden="true" />
              <ArtImg
                src={element(ART.bowRibbon)}
                decorative
                className="pointer-events-none absolute -top-8 left-1/2 w-24 -translate-x-1/2 drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]"
              />
              <span className="type-label relative z-10 text-[10px] tracking-[0.2em]">
                {open ? 'TAP TO CLOSE' : 'TAP BOW TO OPEN'}
              </span>
            </motion.button>
          </div>
        </div>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen((c) => !c)}
            aria-pressed={open}
            className={open ? activeButtonClass : buttonClass}
          >
            {open ? 'Close the box' : 'Open the box'}
          </button>
        </div>
      </PaperLayer>
    </KeepsakeSpread>
  );
}

/* ── Page 04 · Pressed between pages ────────────────────────────────────── */
function BotanicalPocketPage() {
  const keepsake = findKeepsake('sleeve');
  const { progress, setProgress, handlers } = useDragProgress(true);
  const out = progress > 0.5;

  return (
    <KeepsakeSpread
      theme={PAGE_THEMES.sleeve}
      transition="slide-right"
      decor={
        <>
          <ArtImg
            src={background(PAPER.printmakingGrid)}
            decorative
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12] mix-blend-multiply"
          />
          <ArtImg
            src={element(ART.driedRoses)}
            decorative
            data-parallax="0.28"
            className="pointer-events-none absolute right-6 top-16 w-28 rotate-[10deg] opacity-90 lift-soft sm:w-36"
          />
          <ArtImg
            src={element(ART.redLily)}
            decorative
            data-parallax="0.22"
            className="pointer-events-none absolute bottom-10 left-6 w-24 -rotate-[8deg] opacity-90 lift-soft sm:w-32"
          />
          <ArtImg
            src={element(ART.tornLinedCorner)}
            decorative
            data-parallax="0.16"
            className="pointer-events-none absolute -left-8 top-24 hidden w-32 opacity-80 sm:block"
          />
        </>
      }
    >
      <PaperLayer material="lined" rotate={-0.7} className="relative p-5 shadow-lifted sm:p-8">
        <WashiTape variant="mint" className="absolute -top-3 left-10" rotate={-3} width="110px" />

        <div className="relative h-52 overflow-hidden rounded-[10px] border border-[#b5c4a4] bg-[#f8faf5] sm:h-56">
          <div
            className="absolute inset-0 flex items-center gap-5 bg-white p-5 sm:p-7"
            style={{ opacity: 0.2 + progress * 0.8 }}
          >
            <ArtImg
              src={element(ART.pinkLetterPaper)}
              decorative
              className="hidden w-24 shrink-0 rotate-[-4deg] opacity-90 sm:block"
            />
            <div className="min-w-0 flex-1">
              <FilledOrPlaceholder
                as="p"
                value={keepsake.reveal}
                className="type-hand text-xl leading-snug sm:text-2xl"
              />
            </div>
          </div>

          <div
            {...handlers}
            className="absolute inset-y-0 left-0 flex w-full cursor-grab items-center justify-between bg-[#c9a87c] px-5 shadow-lg active:cursor-grabbing sm:px-8"
            style={{ ...DRAG_STYLE, transform: `translateX(${-progress * 100}%)` }}
            aria-hidden="true"
          >
            <span className="h-8 w-8 rounded-full border-2 border-dashed border-[#3c2a17]" />
            <span className="type-label text-[11px] text-[#3c2a17]">
              ← SLIDE PAPER SLEEVE LEFT
            </span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setProgress(out ? 0 : 1)}
            aria-pressed={out}
            className={out ? activeButtonClass : buttonClass}
          >
            {out ? 'Slide back in' : 'Slide the card out'}
          </button>
        </div>
      </PaperLayer>
    </KeepsakeSpread>
  );
}

/* ── Page 05 · Still frames ─────────────────────────────────────────────── */
const FILM_FRAMES = 4;

function FilmReelPage() {
  const keepsake = findKeepsake('filmstrip');
  const [frameIdx, setFrameIdx] = useState(0);

  return (
    <KeepsakeSpread
      theme={PAGE_THEMES.filmstrip}
      transition="unfold"
      decor={
        <>
          <ArtImg
            src={background(PAPER.oldNewspaper)}
            decorative
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.16] mix-blend-multiply"
          />
          <ArtImg
            src={element(ART.pocketWatch)}
            decorative
            data-parallax="0.3"
            className="pointer-events-none absolute right-6 top-16 hidden w-24 opacity-90 lift-soft sm:block sm:w-28"
          />
          <ArtImg
            src={background(PAPER.blackGingham)}
            decorative
            className="pointer-events-none absolute -left-10 top-12 w-40 -rotate-[12deg] opacity-35 sm:w-56"
          />
          <ArtImg
            src={element(ART.tornNewsCaption)}
            decorative
            data-parallax="0.24"
            className="pointer-events-none absolute left-6 bottom-6 w-36 rotate-[-6deg] opacity-85 sm:w-48"
          />
        </>
      }
    >
      <div className="relative rounded-[12px] border-2 border-[#2b2b2e] bg-[#1c1c1f] p-4 shadow-[var(--shadow-lifted)] sm:p-6">
        <div className="material-sprocket mb-3 h-3 w-full opacity-75" aria-hidden="true" />
        <div className="grid grid-cols-4 gap-2" aria-hidden="true">
          {Array.from({ length: FILM_FRAMES }, (_, i) => (
            <div
              key={i}
              className={[
                'h-3 rounded-sm transition-colors',
                i === frameIdx ? 'bg-[#f2c9d2]' : 'bg-[#3b3940]',
              ].join(' ')}
            />
          ))}
        </div>

        <div className="mt-4 rounded-[8px] bg-[#FBF7F1] p-5 sm:p-7">
          <p className="type-label text-[10px] text-[var(--color-valentine)]">
            FRAME {frameIdx + 1} OF {FILM_FRAMES}
          </p>
          <FilledOrPlaceholder
            as="p"
            value={keepsake.reveal}
            className="type-hand mt-2 text-xl leading-snug sm:text-2xl"
          />
        </div>
        <div className="material-sprocket mt-3 h-3 w-full opacity-75" aria-hidden="true" />
      </div>

      <div className="mt-5 flex justify-center gap-2" role="group" aria-label="Choose a frame">
        {Array.from({ length: FILM_FRAMES }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFrameIdx(i)}
            aria-pressed={frameIdx === i}
            aria-label={`Show frame ${i + 1}`}
            className={[
              'h-11 w-11 rounded-full border-2 text-xs font-bold transition',
              frameIdx === i
                ? 'border-[var(--color-ink)] bg-[var(--color-valentine)] text-white'
                : 'border-[#c9b79c] bg-white hover:bg-[#fff6e4]',
            ].join(' ')}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </KeepsakeSpread>
  );
}

/* ── Page 06 · Under the star ───────────────────────────────────────────── */
function SecretStarPage() {
  const keepsake = findKeepsake('polaroid');
  const [peeled, setPeeled] = useState(false);

  return (
    <KeepsakeSpread
      theme={PAGE_THEMES.hidden}
      transition="tilt-pop"
      decor={
        <>
          <ArtImg
            src={background(PAPER.crumpledFoil)}
            decorative
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.16] mix-blend-multiply"
          />
          <ArtImg
            src={element(ART.starGarland)}
            decorative
            data-parallax="0.2"
            className="pointer-events-none absolute right-6 top-12 w-44 opacity-85 sm:w-64"
          />
          <ArtImg
            src={element(ART.redGingham)}
            decorative
            data-parallax="0.25"
            className="pointer-events-none absolute -left-8 bottom-12 w-36 -rotate-[10deg] opacity-75 sm:w-44"
          />
          <ArtImg
            src={element(ART.blankNotepaper)}
            decorative
            data-parallax="0.18"
            className="pointer-events-none absolute -right-10 bottom-10 hidden w-36 rotate-[8deg] opacity-85 sm:block"
          />
        </>
      }
    >
      <PaperLayer material="grid" rotate={-0.5} className="relative p-6 shadow-lifted sm:p-10">
        <WashiTape variant="butter" className="absolute -top-3 left-10" rotate={4} width="100px" />

        <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-[10px] border-2 border-dashed border-[#c9b79c] bg-[#FBF7F1] p-6">
          <div
            className="max-w-md text-center transition-opacity duration-300"
            style={{ opacity: peeled ? 1 : 0.14 }}
          >
            <FilledOrPlaceholder
              as="p"
              value={keepsake.reveal}
              className="type-hand text-2xl leading-snug"
            />
          </div>

          <motion.button
            type="button"
            onClick={() => setPeeled((c) => !c)}
            aria-pressed={peeled}
            aria-label={peeled ? 'Stick the star back down' : 'Peel the star sticker off'}
            initial={false}
            animate={
              peeled
                ? { x: 110, y: -62, rotate: 34, scale: 0.78, opacity: 0.9 }
                : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
            }
            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
            className="absolute z-10 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-valentine)]"
          >
            <ArtImg
              src={element(ART.redStar)}
              decorative
              className="block w-28 drop-shadow-[0_10px_14px_rgb(0_0_0/0.3)] sm:w-32"
            />
          </motion.button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => setPeeled((c) => !c)}
            aria-pressed={peeled}
            className={peeled ? activeButtonClass : buttonClass}
          >
            {peeled ? 'Stick it back' : 'Peel the star'}
          </button>
        </div>
      </PaperLayer>
    </KeepsakeSpread>
  );
}

/**
 * Chapter 05 — six full-bleed, themed keepsake pages.
 */
export default function KeepsakesScene() {
  const { reducedMotion } = useScrapbook();
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useParallax(scopeRef, !reducedMotion);
  useChapterReveal(scopeRef);

  return (
    <div ref={scopeRef} className="relative">
      <header className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20">
        <WashiTape variant="butter" className="mb-3" rotate={4} width="96px" />
        <p data-reveal="write" className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 05 · KEEPSAKES</p>
        <h2 id="keepsakes-title" data-reveal="left" className="type-masthead mt-2 max-w-3xl text-[clamp(2.1rem,6.5vw,4.2rem)] leading-[0.92]">
          Little things we kept
        </h2>
        <p data-reveal="write" data-reveal-delay="0.1" className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
          Six quiet pages tucked inside — pull, part, unwrap, slide, and peel as you go.
        </p>
      </header>

      <RibbonDrawerPage />
      <UnderTheCloudsPage />
      <VelvetGiftBoxPage />
      <BotanicalPocketPage />
      <FilmReelPage />
      <SecretStarPage />
    </div>
  );
}
