export function EmptyHistoryIllustration() {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[200px] text-foreground"
    >
      {/* Background Dot Grid */}
      <pattern id="empty-hist-grid" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" className="fill-muted-foreground/20" />
      </pattern>
      <rect width="240" height="180" fill="url(#empty-hist-grid)" rx="6" />

      {/* Back Document Stack */}
      <rect
        x="60"
        y="25"
        width="120"
        height="85"
        rx="4"
        className="fill-muted/40 stroke-border"
        strokeWidth="1.5"
      />

      {/* Mid Document Stack */}
      <rect
        x="52"
        y="35"
        width="136"
        height="85"
        rx="4"
        className="fill-secondary/80 stroke-border"
        strokeWidth="1.5"
      />

      {/* Front Main Archive / Table Folder Card */}
      <g transform="translate(44, 45)">
        <rect
          x="0"
          y="0"
          width="152"
          height="85"
          rx="5"
          className="fill-background stroke-foreground"
          strokeWidth="1.5"
        />

        {/* Header Tab Bar */}
        <line x1="0" y1="20" x2="152" y2="20" className="stroke-border" strokeWidth="1" />
        <rect x="10" y="7" width="28" height="6" rx="1.5" className="fill-muted-foreground/30" />
        <rect x="44" y="7" width="20" height="6" rx="1.5" className="fill-muted-foreground/20" />

        {/* Empty Table Row Skeletons */}
        {/* Row 1 */}
        <rect x="10" y="28" width="16" height="8" rx="1.5" className="fill-muted-foreground/20" />
        <rect x="32" y="30" width="55" height="4" rx="1" className="fill-muted-foreground/15" />
        <rect x="95" y="30" width="24" height="4" rx="1" className="fill-muted-foreground/15" />
        <rect x="126" y="30" width="16" height="4" rx="1" className="fill-muted-foreground/15" />

        {/* Row 2 */}
        <rect x="10" y="42" width="16" height="8" rx="1.5" className="fill-muted-foreground/20" />
        <rect x="32" y="44" width="45" height="4" rx="1" className="fill-muted-foreground/15" />
        <rect x="85" y="44" width="30" height="4" rx="1" className="fill-muted-foreground/15" />
        <rect x="122" y="44" width="20" height="4" rx="1" className="fill-muted-foreground/15" />

        {/* Row 3 */}
        <rect x="10" y="56" width="16" height="8" rx="1.5" className="fill-muted-foreground/20" />
        <rect x="32" y="58" width="60" height="4" rx="1" className="fill-muted-foreground/15" />
        <rect x="100" y="58" width="20" height="4" rx="1" className="fill-muted-foreground/15" />
        <rect x="128" y="58" width="14" height="4" rx="1" className="fill-muted-foreground/15" />

        {/* Bottom Bar */}
        <line x1="0" y1="70" x2="152" y2="70" className="stroke-border/70" strokeWidth="1" />
      </g>

      {/* Floating Magnifying Glass searching empty records */}
      <g transform="translate(140, 75)">
        <circle cx="22" cy="22" r="16" className="fill-background stroke-foreground" strokeWidth="1.75" />
        {/* Glass Reflection */}
        <path d="M 12 16 A 10 10 0 0 1 24 10" className="stroke-muted-foreground/40" strokeWidth="1.5" strokeLinecap="round" />
        {/* Inner question mark / empty indicator */}
        <text x="22" y="27" textAnchor="middle" className="fill-foreground font-mono font-bold text-[14px]">
          ∅
        </text>
        {/* Handle */}
        <line x1="34" y1="34" x2="48" y2="48" className="stroke-foreground" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Bottom Status Tag */}
      <g transform="translate(62, 142)">
        <rect
          x="0"
          y="0"
          width="116"
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
          0 records found
        </text>
      </g>
    </svg>
  );
}
