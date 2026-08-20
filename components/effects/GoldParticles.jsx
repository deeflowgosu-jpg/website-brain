import { useEffect, useRef } from 'react';

/**
 * GoldParticles — ambient canvas particle field: slow-rising, flickering
 * gold specks. Pure canvas (no library), self-managing on resize. Mount
 * as a fixed full-screen background layer behind your content (z-index 0).
 *
 * Retheme by changing the `rgba(212, 175, 55, ...)` fill/shadow colors.
 */
export default function GoldParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const particles = [];
    const COUNT = window.innerWidth < 640 ? 16 : 30;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (initial = false) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: Math.random() * 2 + 0.6,
      vy: -(Math.random() * 0.22 + 0.05),
      vx: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.45 + 0.12,
      tw: Math.random() * Math.PI * 2,
      tws: Math.random() * 0.02 + 0.006,
    });

    const init = () => {
      resize();
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) particles.push(spawn(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += p.tws;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;

        const flick = 0.55 + Math.sin(p.tw) * 0.45;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.9)';
        ctx.fillStyle = `rgba(212, 175, 55, ${(p.a * flick).toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 h-full w-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
