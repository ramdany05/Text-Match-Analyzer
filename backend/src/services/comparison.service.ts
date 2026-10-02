import {
  MatchStrategy,
  CaseSensitiveStrategy,
  CaseInsensitiveStrategy,
} from "../strategies/match.strategy";

export interface CalculateResult {
  percentage: number;
  matchedCount: number;
  totalCount: number;
  matchedChars: string[];
  label: string;
  hint?: string;
}

export class ComparisonService {
  private getStrategy(mode: "SENSITIVE" | "INSENSITIVE"): MatchStrategy {
    return mode === "SENSITIVE"
      ? new CaseSensitiveStrategy()
      : new CaseInsensitiveStrategy();
  }

  /**
   * Evaluasi label dan memberikan hint jika mode SENSITIVE punya hasil jauh di bawah INSENSITIVE
   */
  private evaluateLabelAndHint(
    percentage: number,
    mode: "SENSITIVE" | "INSENSITIVE",
    input1: string,
    input2: string
  ): { label: string; hint?: string } {
    let label = "";

    if (percentage === 0) {
      label = "Tidak ada kecocokan";
    } else if (percentage < 50) {
      label = "Rendah";
    } else if (percentage < 100) {
      label = "Sedang";
    } else {
      label = "Penuh";
    }

    let hint: string | undefined = undefined;

    // Hint khusus jika mode SENSITIVE
    if (mode === "SENSITIVE") {
      const insensitiveResult = this.computeMatch(input1, input2, "INSENSITIVE");
      
      // Jika selisih persentase >= 20, beri saran
      if (insensitiveResult.percentage - percentage >= 20) {
        hint = "Coba mode non-sensitive, hasilnya mungkin lebih baik.";
      }
    }

    return { label, hint };
  }

  /**
   * Inti dari algoritma pencocokan.
   */
  private computeMatch(
    input1: string,
    input2: string,
    mode: "SENSITIVE" | "INSENSITIVE"
  ): { percentage: number; matchedCount: number; totalCount: number; matchedChars: string[] } {
    const strategy = this.getStrategy(mode);
    const normalizedInput1 = strategy.normalize(input1);
    const normalizedInput2 = strategy.normalize(input2);

    // Optimize lookup O(1) dengan Set (O(n+m) kompleksitas keseluruhan)
    const set2 = new Set(normalizedInput2.split(""));

    let matchedCount = 0;
    const matchedChars = new Set<string>();

    for (const char of normalizedInput1) {
      if (set2.has(char)) {
        matchedCount++;
        matchedChars.add(char); // Menyimpan karakter unik yang cocok
      }
    }

    const totalCount = input1.length;
    // Pembulatan 2 desimal
    const percentage = Math.round((matchedCount / totalCount) * 100 * 100) / 100;

    return {
      percentage,
      matchedCount,
      totalCount,
      matchedChars: Array.from(matchedChars),
    };
  }

  /**
   * Main method untuk calculate API
   */
  public calculate(input1: string, input2: string, mode: "SENSITIVE" | "INSENSITIVE"): CalculateResult {
    const matchData = this.computeMatch(input1, input2, mode);
    const labelData = this.evaluateLabelAndHint(matchData.percentage, mode, input1, input2);

    return {
      ...matchData,
      ...labelData,
    };
  }
}
