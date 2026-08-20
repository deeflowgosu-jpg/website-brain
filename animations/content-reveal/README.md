# Content Reveal

**Source:** Galeria (`src/components/Galeria/Reveal.jsx`)
**Deps:** `gsap` (with `ScrollTrigger` plugin)

A drop-in wrapper that fades, blurs, and slides its children in as they
scroll into view. Unlike a one-shot "animate on mount" effect, this is
scrubbed to scroll position — it feels physically tied to the scroll
gesture, which is what gives Galeria's page its "premium" feel rather than
a generic fade-in.

## Usage

```jsx
import Reveal from './Reveal';

<Reveal>
  <h2>Section title</h2>
</Reveal>

<Reveal y={40} className="mt-6">
  <p>Longer body copy that rises in from slightly further down.</p>
</Reveal>
```

## Props

| Prop        | Default | Description                                   |
| ----------- | ------- | ---------------------------------------------- |
| `y`         | `24`    | Starting vertical offset in px (slides up into place) |
| `delay`     | `0`     | Currently unused directly in the scrub tween, kept for API parity with entrance variants — safe to ignore or extend |
| `className` | —       | Passed through to the wrapping `div`          |

## Notes

- Requires `gsap` + `ScrollTrigger` registered once per app (see root
  README "Dependencies").
- Cleans up its ScrollTrigger instance on unmount — safe to use inside
  lists/maps without leaking triggers.
- For a heavier, connective version of this same idea (a literal path
  that draws between elements as you scroll), see
  `../scroll-trail-path/ScrollLine.jsx`.
