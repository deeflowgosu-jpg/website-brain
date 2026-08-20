# Scroll Trail Path

**Source:** Galeria (`src/components/Galeria/ScrollLine.jsx`)
**Deps:** `gsap` (with `ScrollTrigger` plugin)

The signature Galeria effect: a glowing gold line that "draws itself" down
the page as you scroll, connecting a sequence of image frames, with a
traveling comet light, glowing halo, pulsing connection nodes, and
synced content fade/blur reveals. When it reaches a final section (e.g. a
contact form) it also draws an animated border around it.

## How it works

- Measures the DOM position of every element with class `.gold-frame`
  relative to a shared wrapper, and builds an SVG path connecting them
  (in → behind each frame → out).
- Uses GSAP `ScrollTrigger` with `scrub` to tie the path's
  `stroke-dashoffset` to scroll position, so the line "draws" as you scroll
  instead of playing on a timer.
- A `ResizeObserver` on the wrapper recalculates all coordinates on layout
  change (responsive-safe).
- Elements with class `.story-block` fade/blur in sync with the segment
  that reveals them.
- An element with class `.contact-frame` gets an animated gold border once
  the trail reaches it.

## Usage

```jsx
import ScrollLine from './ScrollLine';

function Page() {
  return (
    <div className="relative"> {/* must be position: relative — ScrollLine is absolute-positioned inside */}
      <ScrollLine />

      <div className="gold-frame">...</div>
      <div className="story-block">...</div>

      <div className="gold-frame">...</div>
      <div className="story-block">...</div>

      <div className="contact-frame">
        <form>...</form>
      </div>
    </div>
  );
}
```

## Retheming

All colors are gold by default (`#D4AF37`, `#F5E6A8`, `#B8902C`). To adapt
to a different palette, swap the `<stop>` colors inside the `scroll-gold`
and `scroll-light` gradients, and update the `stroke`/`fill` colors used
for glow paths and pulsing nodes.

Also requires the `.scroll-node` and `.scroll-line-pulse` CSS classes —
see `/styles/design-tokens.css` in this repo for their keyframes.

## When to use this vs. `content-reveal/Reveal.jsx`

- Use **ScrollLine** when you want a literal connective visual (a path/line)
  tying a sequence of sections together — great for storytelling pages,
  portfolios with a narrative flow, timelines.
- Use **Reveal** (in `../content-reveal/`) when you just want individual
  elements to fade/blur in on scroll, with no connecting line.
