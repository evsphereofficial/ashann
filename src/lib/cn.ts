/** Tiny class joiner — no dependency, works with Tailwind's class strings. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
