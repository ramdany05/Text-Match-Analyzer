export function LoginHeroIllustration() {
  return (
    <svg
      viewBox="0 0 440 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[380px] text-foreground"
    >
      {/* Background Dot Grid */}
      <pattern id="dot-grid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" className="fill-muted-foreground/20" />
      </pattern>
      <rect width="440" height="340" fill="url(#dot-grid)" rx="8" />

      {/* Card 1 (Input 1 Source) */}
      <g className="transition-transform duration-300">
        <rect
          x="30"
          y="70"
          width="160"
          height="190"
          rx="6"
          className="fill-background stroke-foreground"
          strokeWidth="2"
        />
        {/* Card Header Bar */}
        <line x1="30" y1="102" x2="190" y2="102" className="stroke-border" strokeWidth="1.5" />
        <rect x="42" y="82" width="40" height="8" rx="2" className="fill-muted-foreground/30" />
        <circle cx="170" cy="86" r="3" className="fill-foreground/60" />

        {/* Text Lines */}
        <rect x="42" y="118" width="90" height="6" rx="2" className="fill-muted-foreground/20" />
        <rect x="42" y="132" width="130" height="6" rx="2" className="fill-muted-foreground/20" />

        {/* Highlighted Chars: A (match), B (no), B (no), C (match), D (match) -> 3/5 = 60% */}
        <g transform="translate(42, 155)">
          {/* A - Matched */}
          <rect x="0" y="0" width="22" height="26" rx="3" className="fill-foreground" />
          <text x="7" y="17" className="fill-background font-mono text-[12px] font-bold">A</text>

          {/* B - Not Matched */}
          <rect x="26" y="0" width="22" height="26" rx="3" className="fill-muted stroke-border" strokeWidth="1" />
          <text x="33" y="17" className="fill-muted-foreground font-mono text-[12px]">B</text>

          {/* B - Not Matched */}
          <rect x="52" y="0" width="22" height="26" rx="3" className="fill-muted stroke-border" strokeWidth="1" />
          <text x="59" y="17" className="fill-muted-foreground font-mono text-[12px]">B</text>

          {/* C - Matched */}
          <rect x="78" y="0" width="22" height="26" rx="3" className="fill-foreground" />
          <text x="85" y="17" className="fill-background font-mono text-[12px] font-bold">C</text>

          {/* D - Matched */}
          <rect x="104" y="0" width="22" height="26" rx="3" className="fill-foreground" />
          <text x="111" y="17" className="fill-background font-mono text-[12px] font-bold">D</text>
        </g>

        <rect x="42" y="200" width="110" height="6" rx="2" className="fill-muted-foreground/20" />
        <rect x="42" y="214" width="70" height="6" rx="2" className="fill-muted-foreground/20" />
        <rect x="42" y="228" width="85" height="6" rx="2" className="fill-muted-foreground/20" />
      </g>

      {/* Card 2 (Input 2 Target) */}
      <g className="transition-transform duration-300">
        <rect
          x="250"
          y="70"
          width="160"
          height="190"
          rx="6"
          className="fill-background stroke-foreground"
          strokeWidth="2"
        />
        {/* Card Header Bar */}
        <line x1="250" y1="102" x2="410" y2="102" className="stroke-border" strokeWidth="1.5" />
        <rect x="262" y="82" width="48" height="8" rx="2" className="fill-muted-foreground/30" />
        <circle cx="390" cy="86" r="3" className="fill-foreground/60" />

        {/* Text Lines */}
        <rect x="262" y="118" width="120" height="6" rx="2" className="fill-muted-foreground/20" />
        <rect x="262" y="132" width="95" height="6" rx="2" className="fill-muted-foreground/20" />

        {/* Target Matching Snippet */}
        <g transform="translate(262, 155)">
          <rect x="0" y="0" width="136" height="26" rx="3" className="fill-secondary stroke-border" strokeWidth="1" />
          <text x="8" y="17" className="fill-foreground font-mono text-[11px]">
            G<tspan className="font-bold fill-foreground underline">a</tspan>llant <tspan className="font-bold fill-foreground underline">D</tspan>u<tspan className="font-bold fill-foreground underline">c</tspan>k
          </text>
        </g>

        <rect x="262" y="200" width="85" height="6" rx="2" className="fill-muted-foreground/20" />
        <rect x="262" y="214" width="115" height="6" rx="2" className="fill-muted-foreground/20" />
        <rect x="262" y="228" width="60" height="6" rx="2" className="fill-muted-foreground/20" />
      </g>

      {/* Connecting Dotted Vectors */}
      <path
        d="M 190 168 C 220 168, 220 168, 250 168"
        className="stroke-foreground"
        strokeWidth="2"
        strokeDasharray="4 4"
      />

      {/* Center Match Badge */}
      <g transform="translate(180, 20)">
        <rect
          x="0"
          y="0"
          width="80"
          height="36"
          rx="18"
          className="fill-background stroke-foreground"
          strokeWidth="2"
        />
        <text
          x="40"
          y="22"
          textAnchor="middle"
          className="fill-foreground font-mono font-bold text-[13px]"
        >
          60.0%
        </text>
      </g>

      {/* Connector lines to center badge */}
      <path
        d="M 110 70 L 110 38 L 180 38"
        className="stroke-border"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <path
        d="M 330 70 L 330 38 L 260 38"
        className="stroke-border"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />

      {/* Bottom Status Tag */}
      <g transform="translate(160, 290)">
        <rect
          x="0"
          y="0"
          width="120"
          height="24"
          rx="4"
          className="fill-secondary stroke-border"
          strokeWidth="1"
        />
        <circle cx="16" cy="12" r="3" className="fill-foreground" />
        <text
          x="28"
          y="16"
          className="fill-muted-foreground font-mono text-[10px] font-medium"
        >
          Case Insensitive
        </text>
      </g>
    </svg>
  );
}
