import { useMemo } from "react";
import type { ComparisonMode } from "@/hooks/use-comparisons";

export interface LiveMatchResult {
  input1: string;
  input2: string;
  mode: ComparisonMode;
  percentage: number;
  matchedCount: number;
  totalCount: number;
  matchedChars: string[];
  unmatchedChars: string[];
  charBreakdown: Array<{
    char: string;
    isMatched: boolean;
    index: number;
  }>;
  label: string;
  suggestion?: string;
}

export function calculateTextMatch(
  input1: string,
  input2: string,
  mode: ComparisonMode
): LiveMatchResult | null {
  if (!input1 || !input2) {
    return null;
  }

  const isSensitive = mode === "SENSITIVE";
  const targetChars = new Set(isSensitive ? input2.split("") : input2.toLowerCase().split(""));
  const input1List = input1.split("");

  let matchedCount = 0;
  const matchedCharsSet = new Set<string>();
  const unmatchedCharsSet = new Set<string>();

  const charBreakdown = input1List.map((char, index) => {
    const lookupChar = isSensitive ? char : char.toLowerCase();
    const isMatched = targetChars.has(lookupChar);
    if (isMatched) {
      matchedCount++;
      matchedCharsSet.add(char);
    } else {
      unmatchedCharsSet.add(char);
    }
    return { char, isMatched, index };
  });

  const totalCount = input1List.length;
  const percentage = totalCount > 0 ? Number(((matchedCount / totalCount) * 100).toFixed(2)) : 0;

  // Label calculation based on nested conditions in PRD
  let label = "Tidak ada kecocokan";
  if (percentage === 100) {
    label = "Penuh";
  } else if (percentage >= 50) {
    label = "Sedang";
  } else if (percentage > 0) {
    label = "Rendah";
  }

  // Suggestion for sensitive mode if insensitive would be higher
  let suggestion: string | undefined;
  if (isSensitive) {
    const targetInsensitive = new Set(input2.toLowerCase().split(""));
    let insCount = 0;
    input1List.forEach((c) => {
      if (targetInsensitive.has(c.toLowerCase())) insCount++;
    });
    const insPct = Number(((insCount / totalCount) * 100).toFixed(2));
    if (insPct > percentage) {
      suggestion = `Coba gunakan Case Insensitive untuk potensi kecocokan ${insPct}%.`;
    }
  }

  return {
    input1,
    input2,
    mode,
    percentage,
    matchedCount,
    totalCount,
    matchedChars: Array.from(matchedCharsSet),
    unmatchedChars: Array.from(unmatchedCharsSet),
    charBreakdown,
    label,
    suggestion,
  };
}

export function useLiveMatch(input1: string, input2: string, mode: ComparisonMode) {
  return useMemo(() => calculateTextMatch(input1, input2, mode), [input1, input2, mode]);
}
