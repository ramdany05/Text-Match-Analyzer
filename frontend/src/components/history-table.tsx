import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComparisonData } from "@/hooks/use-comparisons";

interface HistoryTableProps {
  data: ComparisonData[];
  onEdit: (item: ComparisonData) => void;
  onDelete: (id: string) => void;
}

export function HistoryTable({ data, onEdit, onDelete }: HistoryTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="py-3 px-4 w-[110px]">Skor (%)</th>
              <th className="py-3 px-4">Teks Input 1 & 2</th>
              <th className="py-3 px-4 w-[130px]">Mode</th>
              <th className="py-3 px-4 w-[140px]">Waktu</th>
              <th className="py-3 px-4 w-[90px] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-sans">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                {/* Score */}
                <td className="py-3 px-4 align-top">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-mono font-bold text-base text-foreground">
                      {item.percentage}%
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary font-medium border border-border text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                </td>

                {/* Inputs Comparison */}
                <td className="py-3 px-4 align-top space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-mono uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">
                      In 1
                    </span>
                    <span className="font-mono text-xs text-foreground break-all line-clamp-1">
                      {item.input1}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-mono uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">
                      In 2
                    </span>
                    <span className="font-mono text-xs text-muted-foreground break-all line-clamp-1">
                      {item.input2}
                    </span>
                  </div>
                </td>

                {/* Mode */}
                <td className="py-3 px-4 align-top">
                  <span className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded border border-border bg-background">
                    {item.mode === "SENSITIVE" ? "Sensitive" : "Insensitive"}
                  </span>
                </td>

                {/* Date */}
                <td className="py-3 px-4 align-top text-xs text-muted-foreground font-mono">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      title="Edit di Workspace"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      title="Hapus"
                      className="h-7 w-7 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
