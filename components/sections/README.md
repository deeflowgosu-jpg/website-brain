# Sections

**Source:** Galeria (`AboutSection.jsx`, `ContactSection.jsx`)
**Deps:** `lucide-react`

Generalized versions of Galeria's content sections — image/text has been
made data-driven so you can reuse them in a new project without editing
the component internals.

## AboutSection

```jsx
<AboutSection
  id="about"
  sections={[
    { kicker: 'What it is', title: 'Overview', body: '...', img: '/img1.jpg', flip: false },
    { kicker: 'Process', title: 'How it works', body: '...', img: '/img2.jpg', flip: true },
  ]}
/>
```

Each block's image wrapper carries class `gold-frame` and the whole block
carries `story-block` — pair with `ScrollLine` (see
`/animations/scroll-trail-path`) if you want the connective trail effect,
or drop those classes if you don't need it (they're harmless without it).

## ContactSection

```jsx
<ContactSection
  id="contact"
  onSubmit={async (e) => { /* call your API */ }}
  onSuccessMessage="Thanks — I'll be in touch."
/>
```

The outer wrapper carries class `contact-frame` — same deal, pair with
`ScrollLine` for the animated-border-on-scroll effect, or ignore it.
