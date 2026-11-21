'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Minimal, dependency-free focus trap for modal surfaces.
 * Restores focus to the element that opened the overlay.
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null || element === document.activeElement);

    const initial = container.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0];
    initial?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const elements = focusables();
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      opener?.focus?.();
    };
  }, [active]);

  return containerRef;
}

export function OverlaySurface({
  label,
  onClose,
  children,
  className = '',
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#160d06]/75 backdrop-blur-[2px]"
        aria-label={`Close ${label}`}
        onClick={onClose}
        data-overlay-scrim
      />
      <div className={className} role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </div>
    </div>
  );
}
