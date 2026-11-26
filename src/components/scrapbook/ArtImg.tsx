'use client';

import { forwardRef, type CSSProperties, type ImgHTMLAttributes } from 'react';

/**
 * The only way supplied artwork reaches the page.
 *
 * A plain `<img>` on purpose: every source is already an optimised WebP of a
 * known size (see `scripts/build-assets.mjs`), so the image loader would only
 * add a runtime for dimensions the manifest already records. `loading` is
 * eager only for art above the fold — the cover — and lazy everywhere else.
 *
 * Extra props are forwarded, which is how `data-parallax` and `data-reveal`
 * reach the element and get picked up by the scroll choreography; the ref is
 * forwarded for the one image GSAP scrubs directly (the magazine heroes).
 */
export const ArtImg = forwardRef<HTMLImageElement, ArtImgProps>(function ArtImg(
  {
    src,
    alt = '',
    className,
    style,
    eager = false,
    draggable = false,
    decorative = false,
    ...rest
  },
  ref,
) {
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      ref={ref}
      src={src}
      alt={decorative ? '' : alt}
      aria-hidden={decorative || undefined}
      className={className}
      style={style}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={draggable}
    />
  );
});

export interface ArtImgProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className' | 'style'> {
  src: string;
  /** Required unless the image is decorative — then pass `decorative`. */
  alt?: string;
  className?: string;
  style?: CSSProperties;
  /** Cover art only: it is in the first paint. */
  eager?: boolean;
  draggable?: boolean;
  /** True for pure texture / scatter layers that add nothing to the text. */
  decorative?: boolean;
}
