import { BarChart2, Target, Sliders } from "lucide-react";
import type { ComparisonStats } from "@/hooks/use-comparisons";

interface BrutalistStatsProps {
  stats: ComparisonStats;
}

export function BrutalistStats({ stats }: BrutalistStatsProps) {
  const totalModeCount = stats.sensitiveCount + stats.insensitiveCount || 1;
  const sensitiveRatio = Math.round((stats.sensitiveCount / totalModeCount) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Average Card */}
      <div className="border border-border p-4 rounded-lg bg-card flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Rata-rata Kecocokan</span>
          <BarChart2 className="h-4 w-4" />
        </div>
        <div className="space-y-1.5">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
            {stats.avgPercentage}%
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-foreground h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, stats.avgPercentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Highest Card */}
      <div className="border border-border p-4 rounded-lg bg-card flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Skor Tertinggi</span>
          <Target className="h-4 w-4" />
        </div>
        <div className="space-y-1.5">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
            {stats.maxPercentage}%
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-foreground h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, stats.maxPercentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sensitive Mode */}
      <div className="border border-border p-4 rounded-lg bg-card flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Case Sensitive</span>
          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
            {sensitiveRatio}%
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
            {stats.sensitiveCount}
            <span className="text-xs font-normal text-muted-foreground ml-1.5 font-sans">kali</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Pengecekan tepat huruf besar/kecil</p>
        </div>
      </div>

      {/* Insensitive Mode */}
      <div className="border border-border p-4 rounded-lg bg-card flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">Case Insensitive</span>
          <Sliders className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-foreground">
            {stats.insensitiveCount}
            <span className="text-xs font-normal text-muted-foreground ml-1.5 font-sans">kali</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Pengecekan tanpa membedakan kapital</p>
        </div>
      </div>
    </div>
  );
}
