import { useState, useEffect } from "react";
import { Loader2, Copy, Check, Save, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLiveMatch } from "@/lib/match-analyzer";
import { EmptyWorkspaceIllustration } from "@/components/illustrations/empty-workspace";
import type { ComparisonMode, ComparisonData } from "@/hooks/use-comparisons";

interface AnalysisWorkspaceProps {
  initialData?: ComparisonData | null;
  onSave: (data: { input1: string; input2: string; mode: ComparisonMode }) => void;
  isSaving: boolean;
  onCancelEdit?: () => void;
}

export function AnalysisWorkspace({
  initialData,
  onSave,
  isSaving,
  onCancelEdit,
}: AnalysisWorkspaceProps) {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [mode, setMode] = useState<ComparisonMode>("SENSITIVE");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialData) {
      setInput1(initialData.input1);
      setInput2(initialData.input2);
      setMode(initialData.mode);
    }
  }, [initialData]);

  const liveResult = useLiveMatch(input1, input2, mode);

  const handleReset = () => {
    setInput1("");
    setInput2("");
    setMode("SENSITIVE");
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleCopyResult = () => {
    if (!liveResult) return;
    const text = `Hasil Text Match: ${liveResult.percentage}%\nInput 1: "${liveResult.input1}"\nInput 2: "${liveResult.input2}"\nMode: ${liveResult.mode} (${liveResult.matchedCount}/${liveResult.totalCount} Karakter)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Hasil berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!input1.trim()) {
      toast.error("Input 1 tidak boleh kosong.");
      return;
    }
    if (!input2.trim()) {
      toast.error("Input 2 tidak boleh kosong.");
      return;
    }
    onSave({ input1, input2, mode });
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden shadow-xs">
      {/* Header Banner */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/40">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-foreground" />
          <h2 className="text-sm font-semibold tracking-tight uppercase">
            {initialData ? "Edit Mode Analysis" : "Live Match Workspace"}
          </h2>
          {initialData && (
            <span className="text-xs bg-muted border border-border px-2 py-0.5 rounded font-mono">
              Editing: #{initialData.id.slice(0, 8)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {initialData && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs font-mono"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Batal Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!input1 && !input2}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Left: Input Panel (7 cols) */}
        <div className="lg:col-span-6 p-6 space-y-5 bg-background">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="ws-input1" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Input 1 (Karakter yang dicari)
              </Label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {input1.length} chars
              </span>
            </div>
            <Textarea
              id="ws-input1"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="Contoh: ABBCD"
              className="font-mono text-sm resize-y min-h-[90px] border-border bg-muted/20 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="ws-input2" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Input 2 (Teks Sumber / Target)
              </Label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {input2.length} chars
              </span>
            </div>
            <Textarea
              id="ws-input2"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              placeholder="Contoh: Gallant Duck"
              className="font-mono text-sm resize-y min-h-[90px] border-border bg-muted/20 focus:bg-background transition-colors"
            />
          </div>

          {/* Mode Selection */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mode Pencocokan
            </Label>
            <RadioGroup
              value={mode}
              onValueChange={(val) => setMode(val as ComparisonMode)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              <Label
                htmlFor="mode-sensitive"
                className={`flex items-start space-x-2.5 p-3 rounded-md border cursor-pointer transition-all ${
                  mode === "SENSITIVE"
                    ? "border-foreground bg-secondary/80 font-medium"
                    : "border-border hover:bg-muted/30 text-muted-foreground"
                }`}
              >
                <RadioGroupItem value="SENSITIVE" id="mode-sensitive" className="mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-semibold block text-foreground">Case Sensitive</span>
                  <span className="text-[11px] block text-muted-foreground font-mono">"A" ≠ "a"</span>
                </div>
              </Label>

              <Label
                htmlFor="mode-insensitive"
                className={`flex items-start space-x-2.5 p-3 rounded-md border cursor-pointer transition-all ${
                  mode === "INSENSITIVE"
                    ? "border-foreground bg-secondary/80 font-medium"
                    : "border-border hover:bg-muted/30 text-muted-foreground"
                }`}
              >
                <RadioGroupItem value="INSENSITIVE" id="mode-insensitive" className="mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-semibold block text-foreground">Case Insensitive</span>
                  <span className="text-[11px] block text-muted-foreground font-mono">"A" = "a"</span>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving || !input1.trim() || !input2.trim()}
              className="w-full font-medium h-10 gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {initialData ? "Simpan Perubahan" : "Simpan ke Riwayat"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Live Result Panel (6 cols) */}
        <div className="lg:col-span-6 p-6 bg-secondary/20 flex flex-col justify-between space-y-6">
          {liveResult ? (
            <div className="space-y-6">
              {/* Score Box */}
              <div className="border border-border rounded-lg p-5 bg-background flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold font-mono tracking-tight text-foreground">
                    {liveResult.percentage}%
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-secondary font-medium border border-border">
                    {liveResult.label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                    Karakter Cocok
                  </p>
                  <p className="text-base font-mono font-bold">
                    {liveResult.matchedCount} / {liveResult.totalCount}
                  </p>
                </div>
              </div>

              {/* Character Breakdown Visualizer */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider">
                    Visualisasi Karakter Input 1
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Hijau = Cocok, Abu-abu = Tidak
                  </span>
                </div>
                <div className="p-3.5 border border-border rounded-md bg-background min-h-[64px] flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto">
                  {liveResult.charBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className={`h-8 min-w-[2rem] px-1.5 flex items-center justify-center font-mono text-xs font-semibold rounded border ${
                        item.isMatched
                          ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900"
                          : "bg-muted/40 text-muted-foreground border-border"
                      }`}
                      title={`Char: "${item.char}" - ${item.isMatched ? "Cocok" : "Tidak Cocok"}`}
                    >
                      {item.char === " " ? "␣" : item.char}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Summary List */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-border rounded-md bg-background">
                  <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[10px]">
                    Karakter Unik Cocok
                  </span>
                  <p className="font-mono break-all font-medium">
                    {liveResult.matchedChars.length > 0
                      ? liveResult.matchedChars.map((c) => (c === " " ? "␣" : c)).join(" ")
                      : "-"}
                  </p>
                </div>
                <div className="p-3 border border-border rounded-md bg-background">
                  <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[10px]">
                    Karakter Tidak Cocok
                  </span>
                  <p className="font-mono break-all text-muted-foreground">
                    {liveResult.unmatchedChars.length > 0
                      ? liveResult.unmatchedChars.map((c) => (c === " " ? "␣" : c)).join(" ")
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Suggestion Box */}
              {liveResult.suggestion && (
                <div className="p-3 border border-border rounded-md bg-muted/40 flex items-start gap-2.5 text-xs">
                  <Sparkles className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Saran:</strong> {liveResult.suggestion}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-background/50 space-y-3">
              <EmptyWorkspaceIllustration />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Pratinjau Hasil Langsung</p>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Ketik teks pada Input 1 dan Input 2 di panel sebelah kiri untuk melihat perhitungan kecocokan secara instan.
                </p>
              </div>
            </div>
          )}

          {/* Footer Action */}
          {liveResult && (
            <div className="pt-2 border-t border-border flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyResult}
                className="h-8 text-xs font-mono gap-1.5"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Tersalin" : "Salin Ringkasan"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
