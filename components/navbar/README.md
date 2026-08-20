# Navbar

**Source:** Galeria (`src/components/Galeria/Navbar.jsx`, `EditiiButton.jsx`, `Logo.jsx`)
**Deps:** `framer-motion`, `lucide-react`

Fixed, frosted-glass navbar that slides/fades in on mount (`framer-motion`),
with a standout center dropdown button (comet-traced gold border) and an
animated line-drawn logo mark.

## Files

- `Navbar.jsx` — the bar itself: left nav buttons, right logo, center
  standout action breaking out below the bar.
- `EditiiButton.jsx` — the standout dropdown button pattern (generic —
  rename freely). Comet traces its border on a loop; dropdown items
  stagger in with framer-motion.
- `Logo.jsx` — animated SVG mark, each stroke draws itself in and loops.

## Usage

```jsx
import Navbar from './Navbar';

<Navbar />
```

Update the `scrollTo()` targets in `Navbar.jsx` to match your page's
section ids, and swap the left-side button labels.

## Retheming for a portfolio

- Swap `Logo.jsx`'s paths for your own mark (initials, geometric shape,
  etc.) — keep the staggered `animationDelay` per shape for the draw-in
  feel.
- `EditiiButton.jsx` works well repurposed as a "Work" or "Menu" dropdown
  — just rename and swap `ITEMS`.
- Needs the `.logo-path`, `.editii-trail-comet`, and `.gloss-btn` CSS from
  `/styles/design-tokens.css`.
