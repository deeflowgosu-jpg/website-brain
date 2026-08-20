import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal — wraps any content and fades/blurs/slides it in as it scrolls
 * into view. Scrubbed to scroll position (not a one-shot timed animation),
 * so it feels tied to the user's scroll gesture rather than autoplaying.
 *
 * USAGE:
 * <Reveal><h2>Section title</h2></Reveal>
 * <Reveal y={40} delay={0.1}><p>Body text</p></Reveal>
 */
export default function Reveal({ children, className, delay = 0, y = 24 }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 42%', scrub: 0.8 },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
