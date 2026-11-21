'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { assembleContainer, dropIn } from '@/lib/motion';
import { useDragProgress } from '@/hooks/useDragProgress';
import { useScrapbook } from '@/components/scrapbook/ScrapbookContext';
import { keepsakes } from '@/content/keepsakes';
import { memories } from '@/content/memories';
import { FilledOrPlaceholder } from '@/components/scrapbook/PlaceholderTag';
import { PaperLayer } from '@/components/scrapbook/PaperLayer';
import { WashiTape } from '@/components/scrapbook/WashiTape';
import { Polaroid } from '@/components/scrapbook/Polaroid';
import { BowSticker, StarSticker, TicketStub } from '@/components/scrapbook/Deco';

const findKeepsake = (id: string) => keepsakes.find((item) => item.id === id) ?? keepsakes[0];

const DRAG_STYLE = { touchAction: 'none' as const, transition: 'transform 300ms var(--ease-paper)' };

function KeepsakeCard({
  id,
  children,
  index,
}: {
  id: string;
  children: ReactNode;
  index: number;
}) {
  const { openOverlay } = useScrapbook();
  const keepsake = findKeepsake(id);

  return (
    <motion.article
      variants={dropIn({ y: 70, rotate: index % 2 === 0 ? -7 : 7 }, index % 2 === 0 ? -1 : 1.2)}
      className="h-full"
    >
      <PaperLayer material={index % 2 === 0 ? 'cream' : 'lined'} className="flex h-full flex-col px-5 py-5 shadow-lifted">
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="type-label text-[10px] text-[var(--color-valentine)]">
              KEEPSAKE {String(index + 1).padStart(2, '0')} · {keepsake.affordance.toUpperCase()}
            </p>
            <h3 className="type-serif mt-1 text-xl leading-tight">{keepsake.title}</h3>
          </div>
          <span aria-hidden="true" className="mt-1 shrink-0">
            <TicketStub width={54} />
          </span>
        </header>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{keepsake.hint}</p>

        <div className="mt-4 flex-1">{children}</div>

        <footer className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openOverlay({ type: 'keepsake', id })}
            className="rounded-full border border-[#c9b79c] bg-white px-3 py-2 text-[11px] font-semibold hover:bg-[#fff6e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            What is inside? →
          </button>
        </footer>
      </PaperLayer>
    </motion.article>
  );
}

const buttonClass =
  'rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-cream)] px-4 py-2.5 text-[11px] font-bold tracking-[0.12em] uppercase transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]';

const activeButtonClass =
  'rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-4 py-2.5 text-[11px] font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]';

/* ── 1 · pull the ribbon drawer ─────────────────────────────────────────── */
function DrawerObject({ reveal }: { reveal: string }) {
  const { progress, setProgress, handlers } = useDragProgress(true);
  const open = progress > 0.5;

  return (
    <>
      <div className="relative h-40 overflow-hidden rounded-[8px] border-2 border-[#8a6238] bg-[#efe4d6]">
        <div
          className="absolute inset-0 flex items-center bg-[#FBF7F1] p-4"
          style={{ opacity: 0.25 + progress * 0.75 }}
        >
          <FilledOrPlaceholder value={reveal} className="text-sm leading-relaxed" />
        </div>
        <div
          {...handlers}
          className="absolute inset-y-0 left-0 flex w-full cursor-grab items-center justify-between bg-[#a9855a] px-4 active:cursor-grabbing"
          style={{ ...DRAG_STYLE, transform: `translateX(${progress * 100}%)` }}
          aria-hidden="true"
        >
          <span className="type-label text-[10px] text-[#fbf7f1]">RIBBON DRAWER</span>
          <span
            className="h-6 w-16 rounded-full"
            style={{
              background: 'linear-gradient(90deg,#8e3e56,#f2c9d2 50%,#8e3e56)',
              boxShadow: 'inset 0 1px 3px rgb(0 0 0 / 0.35)',
            }}
          />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-[var(--color-ink-faint)]" aria-live="polite">
        {open ? 'Drawer open — drag it shut, or use the button.' : 'Drawer closed — drag the ribbon, or use the button.'}
      </p>
      <button
        type="button"
        onClick={() => setProgress(open ? 0 : 1)}
        aria-pressed={open}
        className={open ? activeButtonClass : buttonClass}
      >
        {open ? 'Push the drawer shut' : 'Pull the ribbon'}
      </button>
    </>
  );
}

/* ── 2 · slide the card out of its sleeve ───────────────────────────────── */
function SleeveObject({ reveal }: { reveal: string }) {
  const { progress, setProgress, handlers } = useDragProgress(true);
  const out = progress > 0.5;

  return (
    <>
      <div className="relative h-40 overflow-hidden rounded-[8px] border border-[#c9b79c] bg-[#efe4d6]">
        <div
          className="absolute inset-0 flex items-center bg-white p-4"
          style={{ opacity: 0.2 + progress * 0.8 }}
        >
          <FilledOrPlaceholder value={reveal} className="text-sm leading-relaxed" />
        </div>
        <div
          {...handlers}
          className="absolute inset-y-0 left-0 flex w-full cursor-grab items-center justify-end bg-[#c9a87c] px-4 active:cursor-grabbing"
          style={{ ...DRAG_STYLE, transform: `translateX(${-progress * 100}%)` }}
          aria-hidden="true"
        >
          <span className="type-label text-[10px] text-[#3c2a17]">PAPER SLEEVE</span>
          <span className="ml-3 h-6 w-6 rounded-full border-2 border-dashed border-[#3c2a17]" />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-[var(--color-ink-faint)]" aria-live="polite">
        {out ? 'Card slid out.' : 'Card still inside the sleeve.'}
      </p>
      <button
        type="button"
        onClick={() => setProgress(out ? 0 : 1)}
        aria-pressed={out}
        className={out ? activeButtonClass : buttonClass}
      >
        {out ? 'Slide the card back in' : 'Slide the card out'}
      </button>
    </>
  );
}

/* ── 3 · turn the polaroid over ─────────────────────────────────────────── */
function PolaroidObject({ reveal }: { reveal: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-[210px]">
          <Polaroid
            src={memories[1].image}
            alt={memories[1].alt}
            caption={memories[1].caption}
            back={reveal}
            rotate={-2.4}
            flipped={flipped}
            onFlip={() => setFlipped((current) => !current)}
            showFlipControl
          />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-[var(--color-ink-faint)]" aria-live="polite">
        {flipped ? 'Showing the back of the print.' : 'Showing the front of the print.'}
      </p>
      <button
        type="button"
        onClick={() => setFlipped((current) => !current)}
        aria-pressed={flipped}
        className={flipped ? activeButtonClass : buttonClass}
      >
        {flipped ? 'See the front' : 'Turn the print over'}
      </button>
    </>
  );
}

/* ── 4 · move through the film strip ────────────────────────────────────── */
const FILM_FRAMES = 4;

function FilmstripObject({ reveal }: { reveal: string }) {
  const [frame, setFrame] = useState(0);

  return (
    <>
      <div className="relative overflow-hidden rounded-[6px] border border-[#2b2b2e] bg-[#1c1c1f] p-3">
        <div className="mb-2 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: FILM_FRAMES }, (_, index) => (
            <span
              key={index}
              className={index === frame ? 'h-2 flex-1 rounded-sm bg-[#f2c9d2]' : 'h-2 flex-1 rounded-sm bg-[#4a4750]'}
            />
          ))}
        </div>
        <div className="rounded-[4px] bg-[#FBF7F1] p-3">
          <p className="type-label text-[10px] text-[var(--color-valentine)]">
            FRAME {frame + 1} OF {FILM_FRAMES}
          </p>
          <FilledOrPlaceholder as="p" value={reveal} className="mt-1 text-sm leading-relaxed" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose a frame">
        <button type="button" onClick={() => setFrame((f) => (f - 1 + FILM_FRAMES) % FILM_FRAMES)} className={buttonClass}>
          ← Previous frame
        </button>
        <button type="button" onClick={() => setFrame((f) => (f + 1) % FILM_FRAMES)} className={activeButtonClass}>
          Next frame →
        </button>
        {Array.from({ length: FILM_FRAMES }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setFrame(index)}
            aria-pressed={frame === index}
            aria-label={`Show frame ${index + 1}`}
            className={[
              'h-9 w-9 rounded-full border-2 text-[11px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]',
              frame === index
                ? 'border-[var(--color-ink)] bg-[var(--color-valentine)] text-white'
                : 'border-[#c9b79c] bg-white hover:bg-[#fff6e4]',
            ].join(' ')}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}

/* ── 5 · open the gift box lid ──────────────────────────────────────────── */
function GiftBoxObject({ reveal }: { reveal: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative h-40" style={{ perspective: 900 }}>
        <div className="absolute inset-x-4 bottom-0 top-8 rounded-[8px] border-2 border-[#8e3e56] bg-[#f2c9d2] p-3">
          <div
            className="h-full rounded-[6px] border border-dashed border-[#8e3e56] bg-[#FBF7F1] p-3"
            style={{ opacity: open ? 1 : 0.18, transition: 'opacity 300ms var(--ease-paper)' }}
          >
            <FilledOrPlaceholder value={reveal} className="text-sm leading-relaxed" />
          </div>
        </div>
        <motion.button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-pressed={open}
          aria-label={open ? 'Close the gift box lid' : 'Open the gift box lid'}
          initial={false}
          animate={{ rotateX: open ? -118 : 0, y: open ? -6 : 0 }}
          transition={{ type: 'spring', stiffness: 210, damping: 20 }}
          className="absolute inset-x-4 top-0 h-10 origin-bottom rounded-[6px] border-2 border-[#8e3e56] bg-[#c0392b] text-[10px] font-bold tracking-[0.16em] text-[#fbf7f1] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {open ? 'Lid open' : 'Gift box'}
        </motion.button>
        <span aria-hidden="true" className="absolute -right-2 -top-3">
          <BowSticker size={46} />
        </span>
      </div>
      <p className="mt-2 text-[11px] text-[var(--color-ink-faint)]" aria-live="polite">
        {open ? 'The lid is open.' : 'The lid is closed.'}
      </p>
      <button type="button" onClick={() => setOpen((current) => !current)} aria-pressed={open} className={open ? activeButtonClass : buttonClass}>
        {open ? 'Close the lid' : 'Open the lid'}
      </button>
    </>
  );
}

/* ── 6 · peel the star ──────────────────────────────────────────────────── */
function StarObject({ reveal }: { reveal: string }) {
  const [peeled, setPeeled] = useState(false);

  return (
    <>
      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-[8px] border border-[#c9b79c] bg-[#FBF7F1] p-4">
        <div
          className="absolute inset-0 flex items-center p-4"
          style={{ opacity: peeled ? 1 : 0.15, transition: 'opacity 300ms var(--ease-paper)' }}
        >
          <FilledOrPlaceholder value={reveal} className="text-sm leading-relaxed" />
        </div>
        <motion.button
          type="button"
          onClick={() => setPeeled((current) => !current)}
          aria-pressed={peeled}
          aria-label={peeled ? 'Stick the star back down' : 'Peel the star sticker off'}
          initial={false}
          animate={
            peeled
              ? { x: 96, y: -54, rotate: 34, scale: 0.82, opacity: 0.9 }
              : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
          }
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="relative z-10 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-valentine)]"
        >
          <StarSticker size={96} color="#c9a227" />
        </motion.button>
      </div>
      <p className="mt-2 text-[11px] text-[var(--color-ink-faint)]" aria-live="polite">
        {peeled ? 'The star is peeled back.' : 'The star is stuck down.'}
      </p>
      <button type="button" onClick={() => setPeeled((current) => !current)} aria-pressed={peeled} className={peeled ? activeButtonClass : buttonClass}>
        {peeled ? 'Stick the star back' : 'Peel the star'}
      </button>
    </>
  );
}

/**
 * Scene 6 — six keepsakes, six different operations.
 *
 * Each object has one obvious button (click / tap / Enter) and, where it makes
 * sense, a pointer-drag as a bonus — the drawer and the sleeve both drag, and
 * both have the identical button behind them.
 */
export default function KeepsakesScene() {
  const { goToScene } = useScrapbook();

  const objects: Record<string, (reveal: string) => ReactNode> = {
    drawer: (reveal) => <DrawerObject reveal={reveal} />,
    sleeve: (reveal) => <SleeveObject reveal={reveal} />,
    polaroid: (reveal) => <PolaroidObject reveal={reveal} />,
    filmstrip: (reveal) => <FilmstripObject reveal={reveal} />,
    giftbox: (reveal) => <GiftBoxObject reveal={reveal} />,
    hidden: (reveal) => <StarObject reveal={reveal} />,
  };

  return (
    <section aria-labelledby="keepsakes-title" className="scene-stage px-4 py-14 sm:px-6">
      <div className="relative mx-auto w-full max-w-6xl">
        <header className="relative mb-8 max-w-2xl">
          <WashiTape variant="butter" className="absolute -top-6 left-12" rotate={6} />
          <p className="type-label text-[11px] text-[var(--color-valentine)]">CHAPTER 05 · KEEPSAKES</p>
          <h2 id="keepsakes-title" className="type-masthead mt-2 text-[clamp(2rem,6vw,3.8rem)] leading-[0.95]">
            Six small machines
          </h2>
          <p className="mt-3 text-[var(--color-ink-soft)]">
            Pull, slide, turn, step, open, peel. Every one of them answers to a button first — the
            drag is only there if you want it.
          </p>
        </header>

        <motion.div
          variants={assembleContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {keepsakes.map((keepsake, index) => (
            <KeepsakeCard key={keepsake.id} id={keepsake.id} index={index}>
              {objects[keepsake.id]?.(keepsake.reveal)}
            </KeepsakeCard>
          ))}
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goToScene('letter')}
            className="object-interactive rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-valentine)] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase transition hover:-translate-y-0.5 hover:bg-[#a83227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)]"
          >
            Next: the letter →
          </button>
          <button
            type="button"
            onClick={() => goToScene('jojo')}
            className="rounded-full border border-[#c9b79c] bg-[var(--color-cream)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-valentine)]"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  );
}
