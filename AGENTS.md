# AGENTS.md

## Project identity

This repository contains a personal six-month anniversary scrapbook
website. It is a cinematic, interactive, romantic scrapbook with
JoJo-inspired fan-magazine elements.

## Source of truth

Follow this order: 1. Explicit user requirements and
`User Requirement.md`. 2. `Scrapbook_Master_Brief.md`. 3. Supplied
reference images and chat screenshots. 4. Pinterest MCP research
documented by the agent. 5. Existing repository conventions and
technical judgment.

If sources conflict, do not silently discard a user requirement.
Document the conflict and choose the interpretation that best preserves
the user's explicit intent.

## Required workflow

-   Inspect before editing.
-   Reuse the existing stack and conventions when sensible.
-   Discover Pinterest MCP tools and schemas before using them.
-   Never claim Pinterest research was completed unless it was actually
    performed.
-   Plan scene structure and motion choreography before implementing
    complex animation.
-   Implement in small, verifiable stages.
-   Run lint, typecheck, and build commands that exist in the
    repository.
-   Test primary interactions on desktop and mobile breakpoints.

## Design rules

-   This must look like a crafted scrapbook / magazine, not a SaaS
    dashboard.
-   Do not use repeated generic cards as the primary visual language.
-   Vary scene composition and density.
-   Use paper, lace, tape, stickers, photos, film, handwritten notes,
    manga panels, and character cutouts as compositional materials.
-   Preserve readability and visual hierarchy.
-   Avoid random decoration that obscures content or controls.
-   Do not copy Pinterest images or supplied references as finished
    layouts.

## Animation rules

-   Animation is a core feature.
-   Build scenes from choreographed object movement and assembly.
-   Every interactive element must produce a meaningful result.
-   Use Framer Motion for component/state motion and GSAP for complex
    timelines; define ownership clearly.
-   Use Three.js only for effects that benefit from actual 3D.
-   Remotion and HeyGen are optional, not mandatory.
-   Respect reduced motion.
-   Clean up timelines, listeners, observers, and animation contexts.
-   Avoid animation jank and excessive simultaneous movement.

## Content and privacy rules

-   Never invent names, dates, memories, quotes, relationship events, or
    personal messages.
-   Use clearly marked placeholders when content has not been supplied.
-   Keep content separate from presentation.
-   Do not expose private assets or content in public source locations
    unless intended by the creator.

## Engineering rules

-   TypeScript first.
-   Prefer small reusable primitives and scene-specific compositions.
-   Avoid premature global state.
-   Use semantic, accessible controls.
-   All drag/swipe actions need click/tap alternatives.
-   All meaningful images need appropriate alt text.
-   No forced autoplay audio.
-   Optimize images and lazy-load expensive content.
-   Avoid unnecessary dependencies.
-   Do not let multiple animation systems control the same property on
    the same element.
-   Do not leave dead buttons, TODO interactions, or fake navigation in
    the finished experience.

## Definition of done

A change is not complete until: - It matches the visual direction. - It
works on mobile and desktop. - Its interactions work with pointer,
touch, and keyboard as appropriate. - It respects reduced motion. - It
passes available typecheck/lint/build checks. - Any missing content or
asset is clearly documented.
