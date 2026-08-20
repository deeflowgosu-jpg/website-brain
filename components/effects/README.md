# Ambient Effects

**Source:** Galeria (`CursorGlow.jsx`, `GoldParticles.jsx`)
**Deps:** none (pure DOM/canvas)

Two lightweight ambient effects that add a lot of perceived polish for
very little cost:

- **CursorGlow** — a soft glow that follows the mouse, screen-blended so
  it lights up whatever's underneath rather than sitting on top of it.
  Auto-hides over `[data-hero]` elements.
- **GoldParticles** — slow-rising flickering specks, canvas-based (no
  animation library), self-resizing.

## Usage

Mount both once, near the root of your layout, outside your scrolling
content:

```jsx
<GoldParticles />
<CursorGlow />
<YourPageContent />
```

## Retheming

Both are gold by default — swap the `rgba(212, 175, 55, ...)` values for
your palette. `GoldParticles`' particle count auto-reduces on small
viewports (`window.innerWidth < 640`).
