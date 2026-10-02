import { describe, it, expect, beforeEach, vi } from "vitest";
import { ComparisonService } from "./comparison.service";
import { ComparisonRepository } from "../repositories/comparison.repository";

const mockComparisonRepository = {
  findByUserId: vi.fn(),
  findByIdAndUserId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as ComparisonRepository;

describe("ComparisonService", () => {
  let service: ComparisonService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ComparisonService(mockComparisonRepository);
  });

  describe("calculate", () => {
    it("menghitung 20% untuk ABBCD vs 'Gallant Duck' dengan mode SENSITIVE", () => {
      const result = service.calculate("ABBCD", "Gallant Duck", "SENSITIVE");
      
      expect(result.percentage).toBe(20);
      expect(result.matchedCount).toBe(1);
      expect(result.totalCount).toBe(5);
      expect(result.label).toBe("Rendah");
      expect(result.hint).toBe("Coba mode non-sensitive, hasilnya mungkin lebih baik.");
    });

    it("menghitung 60% untuk ABBCD vs 'Gallant Duck' dengan mode INSENSITIVE", () => {
      const result = service.calculate("ABBCD", "Gallant Duck", "INSENSITIVE");
      
      expect(result.percentage).toBe(60);
      expect(result.matchedCount).toBe(3);
      expect(result.totalCount).toBe(5);
      expect(result.label).toBe("Sedang");
      expect(result.hint).toBeUndefined(); // Tidak ada hint untuk INSENSITIVE
    });

    it("menghitung 0% jika tidak ada karakter yang cocok", () => {
      const result = service.calculate("XYZ", "ABC", "SENSITIVE");
      
      expect(result.percentage).toBe(0);
      expect(result.label).toBe("Tidak ada kecocokan");
    });

    it("menghitung 100% jika semua karakter ada", () => {
      const result = service.calculate("ABC", "A B C D E", "SENSITIVE");
      
      expect(result.percentage).toBe(100);
      expect(result.label).toBe("Penuh");
    });

    it("menangani pembulatan 2 desimal dengan benar", () => {
      // 1 cocok dari 3 = 33.3333333333% -> 33.33%
      const result = service.calculate("ABC", "A", "SENSITIVE");
      
      expect(result.percentage).toBe(33.33);
    });

    it("menangani spasi sebagai karakter biasa", () => {
      const result = service.calculate("A B", "C D E", "SENSITIVE");
      // "A", " ", "B". " " ada di "C D E".
      // Jadi 1 dari 3 cocok -> 33.33%
      expect(result.percentage).toBe(33.33);
    });
  });
});
