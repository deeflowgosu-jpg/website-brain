import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function relPos(el, container) {
  let x = 0;
  let y = 0;
  let node = el;
  while (node && node !== container) {
    x += node.offsetLeft || 0;
    y += node.offsetTop || 0;
    node = node.offsetParent;
  }
  return { x, y };
}

const mk = (arr) => arr.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(' ');

/**
 * ScrollLine — a gold "trail" path that draws itself as the user scrolls,
 * connecting a sequence of `.gold-frame` elements (and optionally a
 * `.contact-frame` at the end) with an animated stroke, glowing halo,
 * traveling comet light, and pulsing connection nodes.
 *
 * USAGE:
 * 1. Render <ScrollLine /> as the first child of a `position: relative`
 *    wrapper that contains your page sections.
 * 2. Mark each image/element you want the trail to connect with the
 *    class `gold-frame`.
 * 3. (Optional) Mark a final section as `contact-frame` to draw an
 *    animated border around it once the trail reaches it.
 * 4. Wrap each content block you want to fade/blur in sync with the
 *    trail in class `story-block`.
 *
 * To retheme: swap the `#D4AF37` / `#F5E6A8` / `#B8902C` gold stops in
 * the <defs> gradients for your own accent color.
 */
export default function ScrollLine() {
  const hostRef = useRef(null);
  const svgRef = useRef(null);
  const segRefs = useRef([]);
  const glowRefs = useRef([]);
  const lightRefs = useRef([]);
  const nodeRefs = useRef([]);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftGlowRef = useRef(null);
  const rightGlowRef = useRef(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const wrapper = host?.parentElement;
    const svg = svgRef.current;
    if (!host || !wrapper || !svg) return;

    let tweens = [];
    let triggers = [];
    let ro = null;
    let raf = 0;

    const setup = () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      triggers.forEach((t) => t.kill());
      tweens = [];
      triggers = [];

      const sw = host.offsetWidth;
      const sh = host.offsetHeight;
      if (!sw || !sh) return;
      svg.setAttribute('viewBox', `0 0 ${sw} ${sh}`);
      svg.setAttribute('width', sw);
      svg.setAttribute('height', sh);

      const frames = Array.from(wrapper.querySelectorAll('.gold-frame'));
      const blocks = Array.from(wrapper.querySelectorAll('.story-block'));
      const contact = wrapper.querySelector('.contact-frame');
      if (!frames.length) return;

      const N = frames.length;
      const D = 46;
      const segs = [];

      // segment 0 — entry to first image top
      {
        const f = frames[0];
        const p = relPos(f, wrapper);
        const cx = p.x + f.offsetWidth / 2;
        const ty = p.y;
        const my = Math.max(ty - D, 6);
        segs[0] = [[sw / 2, 0], [sw / 2, my], [cx, my], [cx, ty]];
      }
      // segment i — previous image top -> behind -> to image i top
      for (let i = 1; i < N; i++) {
        const prev = frames[i - 1];
        const pp = relPos(prev, wrapper);
        const pcx = pp.x + prev.offsetWidth / 2;
        const pby = pp.y + prev.offsetHeight;
        const cur = frames[i];
        const cp = relPos(cur, wrapper);
        const cx = cp.x + cur.offsetWidth / 2;
        const ty = cp.y;
        const my = (pby + ty) / 2;
        segs[i] = [[pcx, pby], [pcx, my], [cx, my], [cx, ty]];
      }
      // connector segment (N) — last image top -> behind -> to form top
      {
        const last = frames[N - 1];
        const lp = relPos(last, wrapper);
        const lcx = lp.x + last.offsetWidth / 2;
        const lby = lp.y + last.offsetHeight;
        if (contact) {
          const cp = relPos(contact, wrapper);
          const fcx = cp.x + contact.offsetWidth / 2;
          const fty = cp.y;
          const my = lby + D;
          segs[N] = [[lcx, lby], [lcx, my], [fcx, my], [fcx, fty]];

          const fx = cp.x;
          const fy = cp.y;
          const fw = contact.offsetWidth;
          const fh = contact.offsetHeight;
          const tcx = fx + fw / 2;
          const bcy = fy + fh;
          const ld = mk([[tcx, fy], [fx, fy], [fx, bcy], [tcx, bcy]]);
          const rd = mk([[tcx, fy], [fx + fw, fy], [fx + fw, bcy], [tcx, bcy]]);
          leftRef.current?.setAttribute('d', ld);
          rightRef.current?.setAttribute('d', rd);
          leftGlowRef.current?.setAttribute('d', ld);
          rightGlowRef.current?.setAttribute('d', rd);
        } else {
          const endY = Math.min(lby + D, sh - 6);
          segs[N] = [[lcx, lby], [lcx, endY], [sw / 2, endY], [sw / 2, sh]];
        }
      }

      // one path per segment, each scrubbed to its own image reveal
      segs.forEach((pts, i) => {
        const core = segRefs.current[i];
        const glow = glowRefs.current[i];
        const light = lightRefs.current[i];
        if (!core) return;
        const d = mk(pts);
        core.setAttribute('d', d);
        if (glow) glow.setAttribute('d', d);
        const len = core.getTotalLength();
        const scrubSeg = i < N ? Math.min(Math.max(len / 180, 1.8), 6) : contact ? 4 : 1.8;
        gsap.set(core, { strokeDasharray: len, strokeDashoffset: len });
        if (glow) gsap.set(glow, { strokeDasharray: len, strokeDashoffset: len });
        if (light) gsap.set(light, { opacity: 0 });

        let trigger;
        let start;
        let end;
        if (i < N) {
          trigger = frames[i];
          start = 'top 80%';
          end = 'top 34%';
        } else if (contact) {
          trigger = contact;
          start = 'top 95%';
          end = 'top 55%';
        } else {
          trigger = wrapper;
          start = 'top 60%';
          end = 'bottom 30%';
        }

        const proxy = { t: 0 };
        tweens.push(
          gsap.to(proxy, {
            t: 1,
            ease: 'power2.inOut',
            scrollTrigger: { trigger, start, end, scrub: scrubSeg },
            onUpdate: () => {
              const off = len * (1 - proxy.t);
              core.style.strokeDashoffset = off;
              if (glow) glow.style.strokeDashoffset = off;
              if (light) {
                const pt = core.getPointAtLength(proxy.t * len);
                light.setAttribute('cx', pt.x);
                light.setAttribute('cy', pt.y);
                let op;
                if (proxy.t < 0.08) op = proxy.t / 0.08;
                else if (proxy.t > 0.9) op = (1 - proxy.t) / 0.1;
                else op = 1;
                light.setAttribute('opacity', Math.max(0, op) * 0.95);
              }
            },
          })
        );
      });

      // glowing node dots at each image / form connection point
      const nodePositions = [];
      frames.forEach((f) => {
        const p = relPos(f, wrapper);
        nodePositions.push({ x: p.x + f.offsetWidth / 2, y: p.y });
        nodePositions.push({ x: p.x + f.offsetWidth / 2, y: p.y + f.offsetHeight });
      });
      if (contact) {
        const cp = relPos(contact, wrapper);
        nodePositions.push({ x: cp.x + contact.offsetWidth / 2, y: cp.y });
      }
      nodeRefs.current.forEach((node, i) => {
        if (!node) return;
        if (i < nodePositions.length) {
          node.setAttribute('cx', nodePositions[i].x);
          node.setAttribute('cy', nodePositions[i].y);
          node.style.display = '';
          gsap.set(node, { opacity: 0 });
        } else {
          node.style.display = 'none';
        }
      });
      frames.forEach((f, i) => {
        const top = nodeRefs.current[2 * i];
        const bot = nodeRefs.current[2 * i + 1];
        if (!top && !bot) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: f,
            start: 'top 75%',
            onEnter: () => gsap.to([top, bot].filter(Boolean), { opacity: 1, duration: 0.7, ease: 'power2.out' }),
            onLeaveBack: () => gsap.to([top, bot].filter(Boolean), { opacity: 0, duration: 0.4, ease: 'power2.in' }),
          })
        );
      });
      if (contact) {
        const cn = nodeRefs.current[2 * frames.length];
        if (cn) {
          triggers.push(
            ScrollTrigger.create({
              trigger: contact,
              start: 'top 90%',
              onEnter: () => gsap.to(cn, { opacity: 1, duration: 0.7, ease: 'power2.out' }),
              onLeaveBack: () => gsap.to(cn, { opacity: 0, duration: 0.4, ease: 'power2.in' }),
            })
          );
        }
      }

      // borders — glow + core split simultaneously
      if (contact && leftRef.current && rightRef.current) {
        [leftRef.current, rightRef.current].forEach((p) => {
          const l = p.getTotalLength();
          gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
        });
        [leftGlowRef.current, rightGlowRef.current].forEach((p) => {
          if (!p) return;
          const l = p.getTotalLength();
          gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
        });
        const bt = { trigger: contact, start: 'top 55%', end: 'bottom 94%', scrub: 7 };
        const borderProxy = { t: 0 };
        tweens.push(
          gsap.to(borderProxy, {
            t: 1,
            ease: 'power2.inOut',
            scrollTrigger: { ...bt },
            onUpdate: () => {
              const setOff = (el) => {
                if (!el) return;
                const l = el.getTotalLength();
                el.style.strokeDashoffset = l * (1 - borderProxy.t);
              };
              setOff(leftRef.current);
              setOff(rightRef.current);
              setOff(leftGlowRef.current);
              setOff(rightGlowRef.current);
            },
          })
        );
        // pulse glow activates once the borders are printed
        triggers.push(
          ScrollTrigger.create({
            trigger: contact,
            start: 'bottom 94%',
            onEnter: () => {
              leftRef.current?.classList.add('scroll-line-pulse');
              rightRef.current?.classList.add('scroll-line-pulse');
              leftGlowRef.current?.classList.add('scroll-line-pulse');
              rightGlowRef.current?.classList.add('scroll-line-pulse');
            },
            onLeaveBack: () => {
              leftRef.current?.classList.remove('scroll-line-pulse');
              rightRef.current?.classList.remove('scroll-line-pulse');
              leftGlowRef.current?.classList.remove('scroll-line-pulse');
              rightGlowRef.current?.classList.remove('scroll-line-pulse');
            },
          })
        );
      }

      // content reveals — synced to each image's line segment
      blocks.forEach((block, i) => {
        if (!frames[i]) return;
        tweens.push(
          gsap.fromTo(
            block,
            { opacity: 0, y: 28, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              ease: 'power2.inOut',
              scrollTrigger: { trigger: frames[i], start: 'top 80%', end: 'top 34%', scrub: 1.8 },
            }
          )
        );
      });

      // form reveal — same premium style/timing as the image blocks
      const formEl = contact?.querySelector('form');
      if (formEl) {
        tweens.push(
          gsap.fromTo(
            formEl,
            { opacity: 0, y: 28, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              ease: 'power2.inOut',
              scrollTrigger: { trigger: contact, start: 'top 90%', end: 'top 30%', scrub: 3.5 },
            }
          )
        );
      }
    };

    setup();

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setup();
        ScrollTrigger.refresh();
      });
    };
    ro = new ResizeObserver(onResize);
    ro.observe(wrapper);

    return () => {
      cancelAnimationFrame(raf);
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      triggers.forEach((t) => t.kill());
      ro?.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0 z-0">
      <svg ref={svgRef} className="h-full w-full" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="scroll-halo" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <linearGradient id="scroll-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8902C" />
            <stop offset="38%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5E6A8" />
            <stop offset="62%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8902C" />
          </linearGradient>
          <radialGradient id="scroll-light">
            <stop offset="0%" stopColor="#FFFBE6" />
            <stop offset="35%" stopColor="#F5E6A8" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </radialGradient>
        </defs>

        {/* soft halos behind each segment */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`g${i}`}
            ref={(el) => {
              glowRefs.current[i] = el;
            }}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="7"
            strokeLinejoin="miter"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
            opacity="0.32"
            style={{ filter: 'url(#scroll-halo)' }}
          />
        ))}

        {/* sharp gold-gradient cores */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`c${i}`}
            ref={(el) => {
              segRefs.current[i] = el;
            }}
            fill="none"
            stroke="url(#scroll-gold)"
            strokeWidth="1.8"
            strokeLinejoin="miter"
            strokeLinecap="butt"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* traveling comet lights */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={`l${i}`}
            ref={(el) => {
              lightRefs.current[i] = el;
            }}
            r="5"
            fill="url(#scroll-light)"
            style={{ filter: 'url(#scroll-halo)' }}
          />
        ))}

        {/* pulsing connection nodes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={`n${i}`}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            r="3"
            fill="#F5E6A8"
            className="scroll-node"
            style={{ filter: 'url(#scroll-halo)' }}
          />
        ))}

        {/* form borders — halo + core */}
        <path
          ref={leftGlowRef}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="7"
          strokeLinejoin="miter"
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
          opacity="0.32"
          style={{ filter: 'url(#scroll-halo)' }}
        />
        <path
          ref={rightGlowRef}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="7"
          strokeLinejoin="miter"
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
          opacity="0.32"
          style={{ filter: 'url(#scroll-halo)' }}
        />
        <path ref={leftRef} fill="none" stroke="url(#scroll-gold)" strokeWidth="1.8" strokeLinejoin="miter" strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        <path ref={rightRef} fill="none" stroke="url(#scroll-gold)" strokeWidth="1.8" strokeLinejoin="miter" strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
