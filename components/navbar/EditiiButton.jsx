import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// Rename / repurpose freely — this is a generic "standout dropdown button"
// pattern (comet-traced gold border + staggered dropdown list).
const ITEMS = ['2023', '2024', '2025', '2026'];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

function GoldChevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`relative z-[2] h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      style={{ filter: 'drop-shadow(0 0 3px rgba(212,175,55,0.5))' }}
    >
      <defs>
        <linearGradient id="editiiChev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5E6A8" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <path d="M6 9l6 6 6-6" stroke="url(#editiiChev)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * EditiiButton — a standout pill-shaped dropdown button with a gold
 * "comet" continuously tracing its border, a soft static halo, and a
 * staggered dropdown list. Originally used for a year picker ("Ediții" =
 * "Editions" in Romanian) — generic enough to reuse for any nav dropdown
 * that should draw more attention than a plain nav link.
 *
 * Requires the `.editii-trail-comet` CSS animation — see
 * /styles/design-tokens.css.
 */
export default function EditiiButton() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="group gloss-btn relative flex items-center gap-2.5 rounded-md px-5 py-2.5 font-body text-sm tracking-[0.18em] text-foreground/80 transition-colors duration-300 hover:bg-gold/5 hover:text-gold sm:px-7 sm:text-base"
      >
        <span className="relative z-[2]">Ediții</span>
        <GoldChevron open={open} />
        {/* gold border — comet traces the rectangle on a loop, with a soft halo */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="editiiTrail" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#B8902C" />
              <stop offset="50%" stopColor="#F5E6A8" />
              <stop offset="100%" stopColor="#B8902C" />
            </linearGradient>
            <filter id="editiiTrailHalo" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>
          {/* soft static halo */}
          <rect x="0" y="0" width="100%" height="100%" rx="10" ry="10" fill="none" stroke="#D4AF37" strokeWidth="4" opacity="0.22" style={{ filter: 'url(#editiiTrailHalo)' }} />
          {/* static gold border */}
          <rect x="0" y="0" width="100%" height="100%" rx="10" ry="10" fill="none" stroke="url(#editiiTrail)" strokeWidth="1.2" opacity="0.6" />
          {/* comet traveling the border on loop */}
          <rect x="0" y="0" width="100%" height="100%" rx="10" ry="10" fill="none" stroke="url(#editiiTrail)" strokeWidth="1.8" pathLength="100" className="editii-trail-comet" style={{ filter: 'url(#editiiTrailHalo)' }} />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 -translate-x-1/2"
          >
            <div className="relative w-[180px] overflow-hidden rounded-md border border-gold/20 bg-black/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_18px_rgba(212,175,55,0.12)] sm:w-[210px]">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-bright/70 to-transparent" />
              <motion.ul variants={listVariants} initial="hidden" animate="show" className="divide-y divide-gold/10">
                {ITEMS.map((y) => (
                  <motion.li key={y} variants={itemVariants}>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="group/item relative flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-300 hover:bg-gold/10"
                    >
                      <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-gold-bright transition-transform duration-300 group-hover/item:scale-y-100" />
                      <span className="font-display text-sm tracking-[0.2em] text-foreground/75 transition-colors duration-300 group-hover/item:text-gold-bright">
                        {y}
                      </span>
                      <ChevronDown className="h-3 w-3 -rotate-90 text-gold/40 opacity-0 transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
