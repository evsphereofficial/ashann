'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { chapterPalettes, paletteVars, type Palette } from '@/content/palettes';
import type { SceneId } from '@/scenes/registry';

/**
 * One chapter of the continuous scroll.
 *
 * The section owns everything *scroll-shaped* about a chapter:
 *
 *  - its **palette**, published as CSS custom properties so every card, rule
 *    and button inside can colour itself from data;
 *  - a **torn-paper top edge** in the chapter's own stock, overlapping the
 *    previous chapter — the new colour is revealed *through* the tear rather
 *    than swapped in behind a hard line;
 *  - a **gingham band** that slides in on scroll, marking the hand-over;
 *  - a **wash** the backdrop cross-fades to, so overscroll and the gaps
 *    between sections never show a foreign colour.
 *
 * Content, layout and interaction stay inside the chapter's own component —
 * this wrapper never touches them.
 */
export function ChapterSection({
  id,
  titleId,
  children,
  palette,
  className,
  /** Set false for the opening chapter, which has nothing to tear from. */
  torn = true,
}: {
  id: SceneId;
  titleId: string;
  children: ReactNode;
  palette?: Palette;
  className?: string;
  torn?: boolean;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const resolved = palette ?? chapterPalettes[id];

  /* Gingham band slides across the hand-over as the chapter arrives. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const band = node.querySelector<HTMLElement>('[data-chapter-band]');
    if (!band) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(band, { xPercent: 0, clearProps: 'opacity' });
      return;
    }

    const tween = gsap.fromTo(
      band,
      { xPercent: -100 },
      {
        xPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: 'top bottom',
          end: 'top 55%',
          scrub: 0.4,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(band, { clearProps: 'transform' });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={`chapter-${id}`}
      data-chapter={id}
      aria-labelledby={titleId}
      className={cn('chapter relative isolate overflow-x-clip', className)}
      style={paletteVars(resolved) as React.CSSProperties}
    >
      {/* Stock the chapter is printed on. */}
      <div aria-hidden="true" className="chapter-wash absolute inset-0 -z-10 bg-[var(--pal-bg)]" />

      {/* Gingham hand-over band — decorative, scrubbed by ScrollTrigger. */}
      <div
        aria-hidden="true"
        data-chapter-band
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 sm:h-14"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, var(--pal-gingham) 0 12px, transparent 12px 24px), repeating-linear-gradient(0deg, var(--pal-gingham) 0 12px, transparent 12px 24px)`,
          opacity: 0.32,
        }}
      />

      {/* The tear: this chapter's stock ripped across the previous one. */}
      {torn && (
        <div
          aria-hidden="true"
          className="edge-torn-top pointer-events-none absolute inset-x-0 top-[-34px] z-10 h-[46px] bg-[var(--pal-bg)] sm:top-[-46px] sm:h-[62px]"
          style={{ filter: 'drop-shadow(0 6px 6px rgb(30 18 8 / 0.28))' }}
        />
      )}

      {/* Content sits above the stock, in normal flow. */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

/**
 * Reveal a chapter's content when it scrolls into view.
 *
 * GSAP owns this because it is scroll choreography; component-level motion
 * (hover, tap, drag, flip) stays with Framer Motion inside the content.
 * Under reduced motion nothing is registered — content is simply present.
 */
export function useChapterReveal(scopeRef: React.RefObject<HTMLElement | null>) {
  const revealed = useRef(false);

  useEffect(() => {
    const node = scopeRef.current;
    if (!node || revealed.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = Array.from(node.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (items.length === 0) return;

    revealed.current = true;

    const tween = gsap.from(items, {
      y: 54,
      opacity: 0,
      rotate: -4,
      duration: 0.7,
      stagger: 0.09,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: node,
        start: 'top 78%',
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(items, { clearProps: 'opacity,transform' });
    };
  }, [scopeRef]);
}

/**
 * Parallax for decorative layers.
 *
 * Scope every `[data-parallax]` descendant to this container and drift it on
 * scroll. Speed comes from the attribute (`0.1` = subtle, `0.4` = dramatic).
 *
 * Ownership rule: parallax targets must be *wrapper* layers. Anything a
 * Framer Motion component animates itself (hover, drag, flip) must never carry
 * `data-parallax`, or two systems would write the same transform.
 */
export function useParallax(scopeRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const node = scopeRef.current;
    if (!node || !enabled) return;

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]');
      for (const layer of layers) {
        const speed = Number.parseFloat(layer.dataset.parallax ?? '0.15');
        if (!Number.isFinite(speed)) continue;
        gsap.fromTo(
          layer,
          { yPercent: speed * 26 },
          {
            yPercent: -speed * 26,
            ease: 'none',
            scrollTrigger: {
              trigger: layer,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    }, node);

    return () => ctx.revert();
  }, [scopeRef, enabled]);
}

export { ScrollTrigger };
