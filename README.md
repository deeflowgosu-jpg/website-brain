# website-brain

A personal library of proven, reusable web components and animations,
extracted from finished projects so future builds don't start from zero.

**First entry: the Galeria design system** — dark/gold "premium gala"
aesthetic with scroll-tied animations. This is the quality bar/threshold
for future projects (e.g. the upcoming portfolio site).

## Structure

```
animations/
  scroll-trail-path/    the signature "trail line draws itself as you scroll" effect
  content-reveal/        lightweight scroll-scrubbed fade/blur-in wrapper
components/
  navbar/                 fixed frosted navbar, standout dropdown button, animated logo
  hero/                    full-viewport staged-entrance hero
  sections/                alternating image/text section, glass-panel contact form
  footer/                  centered socials + divider footer
  effects/                 cursor glow, ambient particle field
styles/
  design-tokens.css       every keyframe/animation class the components above depend on
```

Each folder has its own README with usage notes, retheming tips, and
where the code originally came from.

## Dependencies

These components assume:

- **React** (function components + hooks)
- **Tailwind CSS**, with a shadcn/ui-style CSS-variable color setup
  (`--background`, `--foreground`, `--gold`, etc. — see
  `styles/design-tokens.css` for the exact variables used)
- **framer-motion** — entrance/exit animations (Navbar, Hero, EditiiButton dropdown)
- **gsap** + **gsap/ScrollTrigger** — scroll-scrubbed animations (ScrollLine, Reveal)
- **lucide-react** — icons

Install:
```
npm install framer-motion gsap lucide-react
```

## What "genuinely matters" here (the reusable core)

If you only take four things from Galeria into a new project, take these:

1. **`animations/scroll-trail-path/ScrollLine.jsx`** — the connective gold
   line that draws itself down the page. This is the single most
   distinctive/premium-feeling effect in the whole site.
2. **`animations/content-reveal/Reveal.jsx`** — scroll-scrubbed (not
   timed) fade/blur-in. Cheap, reusable everywhere, and what makes every
   section feel "tied" to the scroll rather than just autoplaying.
3. **`components/navbar/Navbar.jsx`** + **`Logo.jsx`** — the staged
   entrance (fade + slide) navbar pattern and the self-drawing logo mark.
4. **`styles/design-tokens.css`** — none of the above works without the
   keyframes in here. Import it once, globally.

## Using this for the next project (portfolio)

The portfolio should reuse the *system*, not the literal gold theme:

- Keep: ScrollLine, Reveal, the staged Hero entrance, the navbar
  entrance/standout-dropdown pattern, CursorGlow, the gloss-btn hover
  sweep.
- Change: the color tokens in `design-tokens.css` (swap gold for your
  portfolio's accent color), the fonts, and the copy/content — everything
  else is intentionally data-driven or prop-driven so it can be reused
  as-is.

## Adding to this library

When a future project produces another component/animation worth
keeping: extract it into its own folder here (with a README following the
same format as the existing ones — source, deps, how it works, usage,
retheming notes) so it's a genuine drop-in next time, not just a copy-paste
you have to re-understand from scratch.
