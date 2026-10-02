import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "./user.service";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/user.entity";
import { AuthService } from "./auth.service";

// Mock UserRepository
const mockUserRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByUsername: vi.fn(),
} as unknown as UserRepository;

const mockAuthService = {
  hashPassword: vi.fn(),
  login: vi.fn(),
} as unknown as AuthService;

// Contoh data user untuk keperluan test
const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "penguji",
  password: "hashedpassword",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  deletedAt: null,
};

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService(mockUserRepository, mockAuthService);
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
    it("membuat user baru dengan username dan password (di-hash)", async () => {
      vi.mocked(mockAuthService.hashPassword).mockResolvedValue("hashedpassword");
      vi.mocked(mockUserRepository.create).mockResolvedValue(mockUser);

      const result = await userService.createUser({ username: "penguji", password: "password123" });

      expect(result).toEqual(mockUser);
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith("password123");
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: "penguji",
        password: "hashedpassword",
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
