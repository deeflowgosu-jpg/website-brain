import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// Replace with your <img> or Next/Image equivalent — Galeria used a custom
// <Image> wrapper component (fittingType/focalPointY are Base44-specific
// props). Swap for a plain <img> with object-fit: cover / object-position.
// import { Image } from '@/components/ui/image';

const HERO_IMAGE_URL = 'REPLACE_WITH_YOUR_HERO_IMAGE_URL';

/**
 * Hero — full-viewport hero with a staged entrance: background blurs/scales
 * in, then a gradient overlay, then a handwritten "motto" line wipes in via
 * clip-path, then a scroll-down CTA fades up with a looping bounce.
 *
 * The staggered `delay` values on each motion element are what sell the
 * "premium" feel — nothing appears at once.
 */
export default function Hero({
  imageUrl = HERO_IMAGE_URL,
  imageAlt = 'Hero image',
  motto = 'Your motto or tagline goes here.',
  ctaLabel = 'See more',
  onCtaClick,
}) {
  const scroll = () => {
    if (onCtaClick) return onCtaClick();
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section data-hero className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(16px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '50% 45%' }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.72)_100%)]" />
      </motion.div>

      {/* Motto — wipes in via clip-path, gold sheen animation */}
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        transition={{ duration: 2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-10 left-5 max-w-md sm:bottom-14 sm:left-12"
      >
        <p className="motto font-script text-2xl leading-snug sm:text-4xl">{motto}</p>
      </motion.div>

      {/* CTA — fades up, chevron bounces on loop */}
      <motion.button
        type="button"
        onClick={scroll}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="group absolute bottom-12 right-5 flex items-center gap-3 text-foreground/85 transition-colors duration-300 hover:text-gold-bright sm:right-12"
      >
        <span className="font-body text-xs uppercase tracking-[0.25em] sm:text-sm">{ctaLabel}</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown className="h-5 w-5 text-gold-bright" style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.7))' }} />
        </motion.span>
      </motion.button>
    </section>
  );
}
