// Generic version of Galeria's alternating image/text "story" section.
// Pair each block's outer image wrapper with class "gold-frame" and the
// whole block with "story-block" if you're using it alongside
// ScrollLine (see /animations/scroll-trail-path).

function Block({ s }) {
  return (
    <div
      className={`story-block flex flex-col items-center gap-10 sm:gap-16 ${
        s.flip ? 'sm:flex-row-reverse' : 'sm:flex-row'
      }`}
    >
      <div className="w-full sm:w-[42%]">
        <div className="gold-frame relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/30 sm:aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.img} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
      </div>

      <div className="w-full sm:w-[52%]">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-gold/80 sm:text-sm">{s.kicker}</p>
        <h2
          className="mt-4 font-display text-4xl font-light text-foreground sm:text-6xl"
          style={{ textShadow: '0 0 32px rgba(212,175,55,0.15)' }}
        >
          {s.title}
        </h2>
        <div className="mt-6 h-px w-20 bg-gradient-to-r from-gold-bright to-transparent" />
        <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-foreground/70 sm:text-lg">{s.body}</p>
      </div>
    </div>
  );
}

/**
 * AboutSection — pass an array of { kicker, title, body, img, flip }
 * to render alternating left/right image+text blocks.
 */
export default function AboutSection({ id = 'about', sections = [] }) {
  return (
    <section id={id} className="relative z-10 mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
      <div className="relative z-10">
        {sections.map((s, i) => (
          <div key={s.title} className={i > 0 ? 'mt-28 sm:mt-44' : ''}>
            <Block s={s} />
          </div>
        ))}
      </div>
    </section>
  );
}
