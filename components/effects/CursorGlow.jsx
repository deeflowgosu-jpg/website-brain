import { useEffect, useRef } from 'react';

/**
 * CursorGlow — a soft gold radial glow that follows the cursor, with
 * screen blend mode. Automatically hides over any element marked
 * `data-hero` (so it doesn't fight with a bright hero image).
 *
 * Mount once near the root of your app (outside scrolling content).
 */
export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const overHero = e.target?.closest?.('[data-hero]');
      if (overHero) {
        el.style.opacity = '0';
        return;
      }
      el.style.transform = `translate3d(${e.clientX - 18}px, ${e.clientY - 18}px, 0)`;
      el.style.opacity = '1';
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[45] h-9 w-9 rounded-full opacity-0 transition-opacity duration-300"
      style={{
        background: 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 40%, transparent 70%)',
        filter: 'blur(4px)',
        mixBlendMode: 'screen',
        willChange: 'transform',
      }}
    />
  );
}
