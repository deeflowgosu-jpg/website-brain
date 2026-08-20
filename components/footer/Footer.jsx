/**
 * Footer — centered social icons + gold divider + copyright line.
 * Pass your own `socials` array of { label, Icon, href } (any icon set,
 * e.g. lucide-react) and `tagline`.
 */
export default function Footer({ socials = [], tagline = '' }) {
  return (
    <footer className="relative z-10 border-t border-gold/15 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14">
        {socials.length > 0 && (
          <div className="flex items-center gap-7 sm:gap-10">
            {socials.map(({ label, Icon, href = '#' }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="group rounded-md p-2 text-gold transition-transform duration-300 hover:scale-110"
              >
                <Icon className="h-5 w-5 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] sm:h-6 sm:w-6" />
              </a>
            ))}
          </div>
        )}
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="font-body text-[11px] tracking-[0.2em] text-foreground/40">
          © {new Date().getFullYear()} {tagline}
        </p>
      </div>
    </footer>
  );
}
