/**
 * Logo — animated line-drawn logo mark. Each path/shape draws itself in
 * (stroke-dashoffset), holds, then fades and loops. Swap the <path>/<circle>
 * shapes for your own mark; keep the `logo-path` class + animation-delay
 * stagger pattern for the draw-in effect.
 *
 * Requires the `.logo-path` CSS animation — see /styles/design-tokens.css.
 */
export default function Logo() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-9 w-9 sm:h-10 sm:w-10"
      fill="none"
      aria-label="Logo"
    >
      <defs>
        <linearGradient id="logoGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5E6A8" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
        <filter id="logoGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.1" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        filter="url(#logoGlow)"
        stroke="url(#logoGold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="logo-path" d="M40 30 L50 12 L60 30" style={{ animationDelay: '0s' }} />
        <circle className="logo-path" cx="50" cy="56" r="20" style={{ animationDelay: '0.35s' }} />
        <path className="logo-path" d="M50 46 C 46 53 46 61 50 67 C 54 61 54 53 50 46" style={{ animationDelay: '0.7s' }} />
        <path className="logo-path" d="M50 56 C 40 60 32 69 28 82" style={{ animationDelay: '1s' }} />
        <path className="logo-path" d="M50 56 C 60 60 68 69 72 82" style={{ animationDelay: '1.2s' }} />
      </g>
    </svg>
  );
}
