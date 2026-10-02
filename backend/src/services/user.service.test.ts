import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "./user.service";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/user.entity";

// Mock UserRepository
const mockUserRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByEmail: vi.fn(),
} as unknown as UserRepository;

// Contoh data user untuk keperluan test
const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "budi@example.com",
  name: "Budi",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  deletedAt: null,
};

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService(mockUserRepository);
  });

  describe("getAllUsers", () => {
    it("mengembalikan daftar user yang diurutkan terbaru", async () => {
      vi.mocked(mockUserRepository.findAll).mockResolvedValue([mockUser]);

      const result = await userService.getAllUsers();

      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });

    it("mengembalikan array kosong jika tidak ada user", async () => {
      vi.mocked(mockUserRepository.findAll).mockResolvedValue([]);

      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe("getUserById", () => {
    it("mengembalikan user jika id ditemukan", async () => {
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
    });

    it("mengembalikan null jika id tidak ditemukan", async () => {
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

      const result = await userService.getUserById("nonexistent-id");

      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("membuat user baru dengan email dan name", async () => {
      vi.mocked(mockUserRepository.create).mockResolvedValue(mockUser);

      const result = await userService.createUser({ email: "budi@example.com", name: "Budi" });

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: "budi@example.com",
        name: "Budi",
      });
    });

    it("membuat user baru tanpa name (name menjadi null)", async () => {
      const userTanpaNama = { ...mockUser, name: null };
      vi.mocked(mockUserRepository.create).mockResolvedValue(userTanpaNama);

      const result = await userService.createUser({ email: "budi@example.com" });

      expect(result.name).toBeNull();
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: "budi@example.com",
        name: null,
      });
    });
  });

  describe("deleteUser", () => {
    it("menghapus user berdasarkan id", async () => {
      vi.mocked(mockUserRepository.delete).mockResolvedValue(true);

      const result = await userService.deleteUser(mockUser.id);

      expect(result).toBe(true);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
