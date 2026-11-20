"use client";

import type { ReactNode } from "react";

/**
 * Marks creator-supplied content that has not been filled in yet.
 *
 * AGENTS.md: "Use placeholders that are unmistakably placeholders."
 * A decorative chip makes an unfinished scrapbook impossible to mistake for a
 * finished one, without changing the underlying layout when the real text
 * arrives — the component disappears entirely once the value is set.
 */
export function PlaceholderTag({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const isPlaceholder = value.trim().startsWith("[PLACEHOLDER");
  if (!isPlaceholder) return null;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.15rem 0.5rem",
        borderRadius: "999px",
        border: "1.5px dashed rgb(184 94 117 / 0.85)",
        background: "rgb(242 201 210 / 0.55)",
        color: "#8e3e56",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
        <path
          d="M5 0.6 6.2 3.6 9.4 3.9 7 6 7.7 9.2 5 7.5 2.3 9.2 3 6 0.6 3.9 3.8 3.6Z"
          fill="currentColor"
        />
      </svg>
      To fill in
    </span>
  );
}

/**
 * Renders the readable form of content with a small marker when it is still
 * a placeholder — used for long-form text where a chip would break the line.
 */
export function FilledOrPlaceholder({
  value,
  as: Tag = "span",
  className,
  placeholderClassName,
}: {
  value: string;
  as?: "span" | "p" | "div";
  className?: string;
  placeholderClassName?: string;
}): ReactNode {
  const isPlaceholder = value.trim().startsWith("[PLACEHOLDER");
  const readable = value.replace(/^\[PLACEHOLDER:\s*/i, "").replace(/\]$/, "");

  if (!isPlaceholder) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      className={className}
      style={{
        ...(className ? {} : {}),
        borderLeft: "3px dashed rgb(184 94 117 / 0.7)",
        paddingLeft: "0.7rem",
        color: "#8e3e56",
        fontStyle: "italic",
      }}
      data-placeholder="true"
    >
      <span className={placeholderClassName}>{readable}</span>
    </Tag>
  );
}
