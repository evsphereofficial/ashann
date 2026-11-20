/**
 * Decorative scrapbook motifs, drawn as inline SVG.
 *
 * These are the "sticker sheet" of the experience: stars, bows, hearts,
 * flowers, buttons. Inline SVG means they stay crisp at any scale (the brief
 * forbids low-resolution stretched art), cost no network requests, and can be
 * recoloured per scene from the shared palette.
 *
 * Every one is `aria-hidden` — they are ornament, never information.
 */

type Props = { size?: number; className?: string; color?: string };

const hidden = { "aria-hidden": true as const, focusable: false as const };

export function StarSticker({ size = 44, className, color = "#F06292" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...hidden}>
      <path
        d="M24 3.5 30.4 17l14.6 1.9-10.7 10 2.9 14.4L24 36.5 10.8 43.3l2.9-14.4L3 18.9 17.6 17Z"
        fill={color}
        stroke="#FFF"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HalftoneStar({ size = 56, className, color = "#242326" }: Props) {
  const id = `ht-${color.replace("#", "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...hidden}>
      <defs>
        <pattern id={id} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.5" fill={color} />
        </pattern>
      </defs>
      <path d="M24 3.5 30.4 17l14.6 1.9-10.7 10 2.9 14.4L24 36.5 10.8 43.3l2.9-14.4L3 18.9 17.6 17Z" fill={`url(#${id})`} />
    </svg>
  );
}

export function BowSticker({ size = 66, className, color = "#F2C9D2" }: Props) {
  return (
    <svg width={size} height={size * 0.66} viewBox="0 0 90 60" className={className} {...hidden}>
      <path
        d="M43 30C34 12 20 6 11 12c-9 6-6 22 6 26 9 3 19-2 26-8Z"
        fill={color}
        stroke="#FFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M47 30c9-18 23-24 32-18 9 6 6 22-6 26-9 3-19-2-26-8Z"
        fill={color}
        stroke="#FFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M40 34c-4 10-9 18-15 23M50 34c4 10 9 18 15 23"
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="45" cy="30" rx="8" ry="7" fill={color} stroke="#FFF" strokeWidth="3" />
    </svg>
  );
}

export function HeartSticker({ size = 40, className, color = "#C0392B" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className={className} {...hidden}>
      <path
        d="M22 38C10 30 3 23.5 3 15.6 3 9.7 7.6 5 13.3 5c4 0 7.2 2.2 8.7 5.1C23.5 7.2 26.7 5 30.7 5 36.4 5 41 9.7 41 15.6c0 7.9-7 14.4-19 22.4Z"
        fill={color}
        stroke="#FFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlowerSticker({ size = 52, className, color = "#F2C9D2" }: Props) {
  const petals = Array.from({ length: 6 }, (_, i) => (i * 360) / 6);
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className} {...hidden}>
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx="30"
          cy="15"
          rx="10"
          ry="14"
          fill={color}
          stroke="#FFF"
          strokeWidth="2.6"
          transform={`rotate(${deg} 30 30)`}
        />
      ))}
      <circle cx="30" cy="30" r="8" fill="#F5E4AA" stroke="#FFF" strokeWidth="2.6" />
    </svg>
  );
}

export function ButtonSticker({ size = 40, className, color = "#EFE4D6" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className={className} {...hidden}>
      <circle cx="22" cy="22" r="19" fill={color} stroke="#FFF" strokeWidth="3" />
      <circle cx="22" cy="22" r="13" fill="none" stroke="rgb(36 35 38 / 0.35)" strokeWidth="1.6" />
      <circle cx="17.5" cy="19" r="2.4" fill="rgb(36 35 38 / 0.7)" />
      <circle cx="26.5" cy="19" r="2.4" fill="rgb(36 35 38 / 0.7)" />
      <circle cx="17.5" cy="26" r="2.4" fill="rgb(36 35 38 / 0.7)" />
      <circle cx="26.5" cy="26" r="2.4" fill="rgb(36 35 38 / 0.7)" />
    </svg>
  );
}

export function SafetyPin({ size = 46, className, color = "#8E97A8" }: Props) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 80 40" className={className} {...hidden}>
      <path
        d="M14 12c0-6 5-9 11-9s11 3 11 9v14c0 5-4 8-9 8s-9-3-9-8"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M14 12h46" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path
        d="M60 12c8 0 12 5 12 11s-5 11-12 11"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="14" cy="12" r="4.5" fill={color} />
    </svg>
  );
}

export function TicketStub({
  width = 150,
  className,
  color = "#FBF7F1",
  accent = "#C0392B",
}: Props & { width?: number; accent?: string }) {
  return (
    <svg
      width={width}
      height={width * 0.44}
      viewBox="0 0 160 70"
      className={className}
      {...hidden}
    >
      <path
        d="M4 6h152v22a7 7 0 0 0 0 14v22H4V42a7 7 0 0 0 0-14Z"
        fill={color}
        stroke={accent}
        strokeWidth="3"
      />
      <path d="M104 6v58" stroke={accent} strokeWidth="2.5" strokeDasharray="7 7" />
      <text
        x="52"
        y="42"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="3"
        fill={accent}
      >
        ADMIT
      </text>
      <text
        x="132"
        y="42"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="13"
        letterSpacing="2"
        fill={accent}
      >
        06
      </text>
    </svg>
  );
}

/** Speed-line sweep used for manga impact moments. */
export function SpeedLines({
  className,
  color = "#242326",
  count = 22,
}: {
  className?: string;
  color?: string;
  count?: number;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="none"
      className={className}
      {...hidden}
    >
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * 360) / count;
        const r1 = 60 + ((i * 37) % 40);
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + r1 * Math.cos(rad);
        const y1 = 200 + r1 * Math.sin(rad);
        const x2 = 200 + 340 * Math.cos(rad);
        const y2 = 200 + 340 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={i % 3 === 0 ? 7 : 3.5}
            strokeLinecap="round"
            opacity={i % 3 === 0 ? 0.85 : 0.5}
          />
        );
      })}
    </svg>
  );
}
