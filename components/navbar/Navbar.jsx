import { motion } from 'framer-motion';
import Logo from './Logo';
import EditiiButton from './EditiiButton';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * Navbar — fixed, frosted-glass navbar that slides/fades in on mount.
 * Center slot breaks out below the bar for a standout dropdown
 * (see EditiiButton) — a nice pattern for a "primary nav action" that
 * wants visual weight beyond a normal nav link.
 *
 * Adapt the left/right button labels and scrollTo() targets to your page's
 * section ids, and swap EditiiButton for whatever your standout center
 * action should be (e.g. "Work", "Menu", a language switcher, etc.)
 */
export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 z-50 w-full"
    >
      <div className="relative grid grid-cols-3 items-center gap-2 border-y border-gold/20 bg-black/55 px-4 py-2 backdrop-blur-xl sm:px-8">
        {/* left */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => scrollTo('contact')}
            className="gloss-btn rounded-md px-4 py-2 font-body text-xs tracking-wide text-foreground/75 transition-colors duration-300 hover:bg-gold/5 hover:text-gold sm:px-5 sm:text-sm"
          >
            <span className="relative z-[2]">Contact</span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo('regulament')}
            className="gloss-btn rounded-md px-4 py-2 font-body text-xs tracking-wide text-foreground/75 transition-colors duration-300 hover:bg-gold/5 hover:text-gold sm:px-5 sm:text-sm"
          >
            <span className="relative z-[2]">Regulament</span>
          </button>
        </div>

        {/* center (spacer; the standout center button is absolutely positioned to break out below) */}
        <div />

        {/* right — logo */}
        <div className="flex items-center justify-end">
          <Logo />
        </div>

        {/* center — standout dropdown/action */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <EditiiButton />
        </div>
      </div>
    </motion.nav>
  );
}
