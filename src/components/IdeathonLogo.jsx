const IdeathonLogo = ({ className = '', title = 'Ideathon — Flagship Innovation Challenge' }) => (
  <svg
    className={className}
    viewBox="0 0 1200 350"
    role="img"
    aria-label={title}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ideathon-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff1b4" />
        <stop offset=".18" stopColor="#f4c067" />
        <stop offset=".46" stopColor="#a96324" />
        <stop offset=".68" stopColor="#e4a54a" />
        <stop offset=".84" stopColor="#754019" />
        <stop offset="1" stopColor="#f5c66d" />
      </linearGradient>
      <linearGradient id="ideathon-edge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe7a0" />
        <stop offset=".5" stopColor="#8b4d1b" />
        <stop offset="1" stopColor="#ffcf72" />
      </linearGradient>
      <radialGradient id="ideathon-core" cx=".5" cy=".45" r=".65">
        <stop offset="0" stopColor="#fff" />
        <stop offset=".17" stopColor="#ffe49a" />
        <stop offset=".42" stopColor="#ff9e2d" />
        <stop offset="1" stopColor="#9e210b" />
      </radialGradient>
      <pattern id="micro-grid" width="22" height="22" patternUnits="userSpaceOnUse">
        <path d="M0 22 22 0M-6 6 6-6M16 28 28 16" stroke="#fff5cc" strokeOpacity=".07" strokeWidth="1" />
      </pattern>
      <filter id="ideathon-shadow" x="-20%" y="-30%" width="140%" height="180%">
        <feDropShadow dx="0" dy="5" stdDeviation="1" floodColor="#351706" floodOpacity=".95" />
        <feDropShadow dx="0" dy="15" stdDeviation="12" floodColor="#000" floodOpacity=".82" />
        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ff9b32" floodOpacity=".16" />
      </filter>
      <filter id="ideathon-glow" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="7" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <g filter="url(#ideathon-shadow)">
      <g
        fill="url(#ideathon-gold)"
        stroke="url(#ideathon-edge)"
        strokeWidth="2.2"
        paintOrder="stroke"
        fontFamily="Orbitron, 'Arial Black', sans-serif"
        fontSize="174"
        fontWeight="900"
        letterSpacing="-5"
      >
        <text x="32" y="224">IDE</text>
        <text x="656" y="224">THON</text>
      </g>

      <path
        d="M536 30 659 230h-65l-58-104-58 104h-65L536 30Zm0 112-34 62h68l-34-62Z"
        fill="url(#ideathon-gold)"
        fillRule="evenodd"
        stroke="url(#ideathon-edge)"
        strokeWidth="2.4"
      />

      <g opacity=".62">
        <text
          x="32"
          y="224"
          fill="url(#micro-grid)"
          fontFamily="Orbitron, 'Arial Black', sans-serif"
          fontSize="174"
          fontWeight="900"
          letterSpacing="-5"
        >IDE</text>
        <text
          x="656"
          y="224"
          fill="url(#micro-grid)"
          fontFamily="Orbitron, 'Arial Black', sans-serif"
          fontSize="174"
          fontWeight="900"
          letterSpacing="-5"
        >THON</text>
        <path d="M536 30 659 230h-65l-58-104-58 104h-65L536 30Z" fill="url(#micro-grid)" />
      </g>

      <path d="m536 151 30 53-30 18-30-18 30-53Z" fill="url(#ideathon-core)" stroke="#ffd982" strokeWidth="2" filter="url(#ideathon-glow)" />
    </g>

    <g transform="translate(0 285)">
      <path d="M40 0h270l24 8-24 8H40l-24-8Z" fill="url(#ideathon-gold)" opacity=".78" />
      <path d="M1160 0H890l-24 8 24 8h270l24-8Z" fill="url(#ideathon-gold)" opacity=".78" />
      <text
        x="600"
        y="18"
        textAnchor="middle"
        fill="#e8bb6d"
        fontFamily="Orbitron, sans-serif"
        fontSize="27"
        fontWeight="600"
        letterSpacing="9"
      >FLAGSHIP INNOVATION CHALLENGE</text>
    </g>
  </svg>
);

export default IdeathonLogo;
