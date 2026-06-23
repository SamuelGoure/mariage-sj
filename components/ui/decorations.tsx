/* Composants SVG décoratifs réutilisables */

export function RingsIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="28" cy="24" r="18" stroke="#e91e8c" strokeWidth="3" fill="none" />
      <circle cx="52" cy="24" r="18" stroke="#4A90D9" strokeWidth="3" fill="none" />
      <circle cx="28" cy="24" r="14" stroke="#F4A7B9" strokeWidth="1" strokeDasharray="3 3" fill="none" />
      <circle cx="52" cy="24" r="14" stroke="#4A90D9" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
    </svg>
  );
}

export function FloralDivider({ className = "w-64 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <line x1="0" y1="16" x2="90" y2="16" stroke="#F4A7B9" strokeWidth="1" />
      <circle cx="105" cy="16" r="4" fill="#e91e8c" opacity="0.4" />
      <circle cx="120" cy="10" r="3" fill="#F4A7B9" />
      <circle cx="130" cy="16" r="5" fill="#e91e8c" />
      <circle cx="140" cy="10" r="3" fill="#F4A7B9" />
      <circle cx="155" cy="16" r="4" fill="#e91e8c" opacity="0.4" />
      <line x1="170" y1="16" x2="260" y2="16" stroke="#F4A7B9" strokeWidth="1" />
      {/* petites feuilles */}
      <path d="M118 22 Q120 26 124 24 Q122 20 118 22Z" fill="#F4A7B9" opacity="0.6" />
      <path d="M136 22 Q138 26 142 24 Q140 20 136 22Z" fill="#F4A7B9" opacity="0.6" />
    </svg>
  );
}

export function EnvelopeIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="24" width="80" height="56" rx="6" fill="white" stroke="#F4A7B9" strokeWidth="2" />
      <path d="M8 30 L48 56 L88 30" stroke="#e91e8c" strokeWidth="2" fill="none" />
      <path d="M8 80 L36 52" stroke="#F4A7B9" strokeWidth="1.5" />
      <path d="M88 80 L60 52" stroke="#F4A7B9" strokeWidth="1.5" />
      <circle cx="48" cy="20" r="10" fill="#e91e8c" />
      <path d="M44 20 L47 23 L53 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GiftIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="44" width="72" height="44" rx="4" fill="#FDF8F5" stroke="#F4A7B9" strokeWidth="2" />
      <rect x="8" y="32" width="80" height="16" rx="4" fill="white" stroke="#e91e8c" strokeWidth="2" />
      <line x1="48" y1="32" x2="48" y2="88" stroke="#e91e8c" strokeWidth="2" />
      <path d="M48 32 C48 32 36 28 32 20 C28 12 36 8 40 14 C44 20 48 32 48 32Z" fill="#F4A7B9" />
      <path d="M48 32 C48 32 60 28 64 20 C68 12 60 8 56 14 C52 20 48 32 48 32Z" fill="#e91e8c" />
    </svg>
  );
}

export function PlaneIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="48" cy="48" r="38" fill="#eef4ff" />
      <path d="M20 50 L50 28 L76 40 L50 44 Z" fill="#4A90D9" />
      <path d="M50 44 L54 60 L46 58 Z" fill="#1A2B5F" />
      <path d="M50 44 L72 54 L68 56 Z" fill="#4A90D9" opacity="0.7" />
      <circle cx="70" cy="30" r="3" fill="#F4A7B9" />
      <circle cx="76" cy="22" r="2" fill="#F4A7B9" opacity="0.6" />
      <circle cx="80" cy="34" r="1.5" fill="#e91e8c" opacity="0.4" />
    </svg>
  );
}

export function FloralCorner({ className = "w-32 h-32", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <path d="M8 120 Q8 8 120 8" stroke="#F4A7B9" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="20" cy="108" r="6" fill="#F4A7B9" opacity="0.5" />
      <circle cx="36" cy="92" r="4" fill="#e91e8c" opacity="0.3" />
      <circle cx="52" cy="76" r="5" fill="#F4A7B9" opacity="0.4" />
      <circle cx="70" cy="58" r="3" fill="#e91e8c" opacity="0.25" />
      <circle cx="88" cy="40" r="4" fill="#F4A7B9" opacity="0.35" />
      <circle cx="108" cy="20" r="5" fill="#e91e8c" opacity="0.2" />
      {/* petites feuilles */}
      <path d="M16 112 Q12 106 18 102 Q22 108 16 112Z" fill="#F4A7B9" opacity="0.5" />
      <path d="M48 80 Q44 74 50 70 Q54 76 48 80Z" fill="#F4A7B9" opacity="0.4" />
    </svg>
  );
}

export function WaveDivider({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ transform: inverted ? "rotate(180deg)" : undefined }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16" fill="white">
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
      </svg>
    </div>
  );
}

export function HeartBeat({ className = "w-48 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 192 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M0 24 L32 24 L40 8 L52 40 L64 24 L80 24"
        stroke="#F4A7B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 24 C84 24 84 18 88 18 C94 18 94 30 100 30 C106 30 106 18 112 18 Z"
        fill="#e91e8c" opacity="0.9" />
      <path d="M112 24 L128 24 L136 8 L148 40 L160 24 L192 24"
        stroke="#F4A7B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
