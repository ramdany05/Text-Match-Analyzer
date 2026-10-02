/**
 * Strategy interface untuk algoritma pencocokan teks.
 */
export interface MatchStrategy {
  /**
   * Menormalisasi input sebelum diproses.
   * Contoh: lowercase untuk insensitive.
   */
  normalize(input: string): string;
}

export class CaseSensitiveStrategy implements MatchStrategy {
  normalize(input: string): string {
    return input;
  }
}

export class CaseInsensitiveStrategy implements MatchStrategy {
  normalize(input: string): string {
    return input.toLowerCase();
  }
}
