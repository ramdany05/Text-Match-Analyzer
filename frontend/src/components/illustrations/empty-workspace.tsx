export function EmptyWorkspaceIllustration() {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[200px] text-foreground"
    >
      {/* Background Dot Grid */}
      <pattern id="empty-ws-grid" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" className="fill-muted-foreground/20" />
      </pattern>
      <rect width="240" height="180" fill="url(#empty-ws-grid)" rx="6" />

      {/* Left Input Mock Card */}
      <g transform="translate(20, 30)">
        <rect
          x="0"
          y="0"
          width="75"
          height="95"
          rx="4"
          className="fill-background stroke-foreground"
          strokeWidth="1.5"
        />
        {/* Header bar */}
        <line x1="0" y1="18" x2="75" y2="18" className="stroke-border" strokeWidth="1" />
        <rect x="8" y="6" width="24" height="5" rx="1" className="fill-muted-foreground/30" />
        
        {/* Skeleton text */}
        <rect x="8" y="26" width="50" height="4" rx="1" className="fill-muted-foreground/20" />
        <rect x="8" y="36" width="40" height="4" rx="1" className="fill-muted-foreground/20" />
        
        {/* Typing cursor indicator */}
        <rect x="8" y="50" width="16" height="14" rx="2" className="fill-secondary stroke-border" strokeWidth="1" />
        <text x="13" y="61" className="fill-foreground font-mono text-[9px] font-bold">|</text>

        <rect x="8" y="72" width="45" height="4" rx="1" className="fill-muted-foreground/15" />
        <rect x="8" y="80" width="30" height="4" rx="1" className="fill-muted-foreground/15" />
      </g>

      {/* Right Target Mock Card */}
      <g transform="translate(145, 30)">
        <rect
          x="0"
          y="0"
          width="75"
          height="95"
          rx="4"
          className="fill-background stroke-foreground"
          strokeWidth="1.5"
        />
        {/* Header bar */}
        <line x1="0" y1="18" x2="75" y2="18" className="stroke-border" strokeWidth="1" />
        <rect x="8" y="6" width="28" height="5" rx="1" className="fill-muted-foreground/30" />

        {/* Skeleton text */}
        <rect x="8" y="26" width="58" height="4" rx="1" className="fill-muted-foreground/20" />
        <rect x="8" y="36" width="46" height="4" rx="1" className="fill-muted-foreground/20" />
        <rect x="8" y="46" width="52" height="4" rx="1" className="fill-muted-foreground/20" />
        
        {/* Target search cursor */}
        <rect x="8" y="58" width="16" height="14" rx="2" className="fill-secondary stroke-border" strokeWidth="1" />
        <text x="12" y="69" className="fill-foreground font-mono text-[9px] font-bold">_</text>

        <rect x="8" y="78" width="35" height="4" rx="1" className="fill-muted-foreground/15" />
      </g>

      {/* Center Connecting Arrow / Match Engine */}
      <g transform="translate(95, 62)">
        <circle cx="25" cy="15" r="14" className="fill-background stroke-foreground" strokeWidth="1.5" />
        <text x="25" y="19" textAnchor="middle" className="fill-foreground font-mono font-bold text-[11px]">
          ≈
        </text>

        {/* Dotted connecting lines */}
        <path d="M 0 15 L 11 15" className="stroke-foreground" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M 39 15 L 50 15" className="stroke-foreground" strokeWidth="1.5" strokeDasharray="2 2" />
      </g>

      {/* Bottom Status Bubble */}
      <g transform="translate(60, 140)">
        <rect
          x="0"
          y="0"
          width="120"
          height="22"
          rx="4"
          className="fill-secondary stroke-border"
          strokeWidth="1"
        />
        <circle cx="12" cy="11" r="2.5" className="fill-muted-foreground" />
        <text
          x="22"
          y="15"
          className="fill-muted-foreground font-mono text-[9px] font-medium"
        >
          Waiting for text...
        </text>
      </g>
    </svg>
  );
}
