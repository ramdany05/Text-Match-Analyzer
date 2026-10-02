import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { ComparisonController } from "../controllers/comparison.controller";
import { ComparisonService } from "../services/comparison.service";
import { ComparisonRepository } from "../repositories/comparison.repository";
import { Comparison } from "../entities/comparison.entity";
import type { Container } from "../container";
import jwt from "jsonwebtoken";

import { User } from "../entities/user.entity";

const mockUserEntity: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "penguji",
  password: "hashedpassword",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockComparison: Comparison = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  input1: "ABBCD",
  input2: "Gallant Duck",
  mode: "SENSITIVE",
  percentage: 20,
  matchedCount: 1,
  totalCount: 5,
  matchedChars: ["c"],
  label: "Rendah",
  user: mockUserEntity,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockComparisonRepository = {
  findByUserId: vi.fn(),
  findByIdAndUserId: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getStatsByUserId: vi.fn(),
} as unknown as ComparisonRepository;

const comparisonService = new ComparisonService(mockComparisonRepository);
const comparisonController = new ComparisonController(comparisonService);

const container = {
  comparisonController,
  authController: { login: vi.fn() },
  userController: { index: vi.fn(), show: vi.fn(), store: vi.fn(), destroy: vi.fn() },
} as unknown as Container;

const app = createApp(container);

// Mock middleware JWT (bypassing token verifikasi, langsung inject req.user)
vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(() => ({ userId: "550e8400-e29b-41d4-a716-446655440000", username: "penguji" })),
  },
}));

describe("Comparison CRUD API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/comparisons", () => {
    it("200 - mengembalikan daftar riwayat dengan paginasi", async () => {
      vi.mocked(mockComparisonRepository.findByUserId).mockResolvedValue({
        data: [mockComparison],
        total: 1,
      });

      const res = await request(app)
        .get("/api/comparisons?page=1")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });
  });

  describe("GET /api/comparisons/stats", () => {
    it("200 - mengembalikan ringkasan statistik user", async () => {
      vi.mocked(mockComparisonRepository.getStatsByUserId).mockResolvedValue({
        avgPercentage: 55.5,
        maxPercentage: 90,
        sensitiveCount: 2,
        insensitiveCount: 3,
      });

      const res = await request(app)
        .get("/api/comparisons/stats")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.avgPercentage).toBe(55.5);
      expect(res.body.data.sensitiveCount).toBe(2);
    });
  });

  describe("GET /api/comparisons/:id", () => {
    it("200 - mengembalikan detail riwayat jika ID valid dan milik user", async () => {
      vi.mocked(mockComparisonRepository.findByIdAndUserId).mockResolvedValue(mockComparison);

      const res = await request(app)
        .get(`/api/comparisons/${mockComparison.id}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(mockComparison.id);
    });

    it("403 - menolak akses jika data bukan milik user (atau tidak ditemukan)", async () => {
      vi.mocked(mockComparisonRepository.findByIdAndUserId).mockResolvedValue(null);

      const res = await request(app)
        .get("/api/comparisons/550e8400-e29b-41d4-a716-446655440002")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/comparisons", () => {
    it("201 - membuat riwayat baru dengan kalkulasi terisi", async () => {
      vi.mocked(mockComparisonRepository.create).mockResolvedValue(mockComparison);

      const res = await request(app)
        .post("/api/comparisons")
        .set("Authorization", "Bearer valid-token")
        .send({
          input1: "ABBCD",
          input2: "Gallant Duck",
          mode: "SENSITIVE"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.percentage).toBeDefined();
    });
  });

  describe("PUT /api/comparisons/:id", () => {
    it("200 - memperbarui riwayat dan menghitung ulang", async () => {
      // 1. Mock existing
      vi.mocked(mockComparisonRepository.findByIdAndUserId).mockResolvedValue(mockComparison);
      
      // 2. Mock hasil update
      const updatedMock = { ...mockComparison, percentage: 60, mode: "INSENSITIVE" as const };
      vi.mocked(mockComparisonRepository.update).mockResolvedValue(updatedMock);

      const res = await request(app)
        .put(`/api/comparisons/${mockComparison.id}`)
        .set("Authorization", "Bearer valid-token")
        .send({
          input1: "ABBCD",
          input2: "Gallant Duck",
          mode: "INSENSITIVE"
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.percentage).toBe(60);
    });
  });

  describe("DELETE /api/comparisons/:id", () => {
    it("200 - melakukan soft-delete", async () => {
      vi.mocked(mockComparisonRepository.findByIdAndUserId).mockResolvedValue(mockComparison);
      vi.mocked(mockComparisonRepository.delete).mockResolvedValue(true);

      const res = await request(app)
        .delete(`/api/comparisons/${mockComparison.id}`)
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Data berhasil dihapus");
    });
  });
});
