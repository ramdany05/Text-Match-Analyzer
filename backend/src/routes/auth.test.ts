import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { User } from "../entities/user.entity";
import type { Container } from "../container";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock data
const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "penguji",
  password: "hashedpassword", // we will mock bcrypt to return true
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  deletedAt: null,
};

// Mock repository
const mockUserRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByUsername: vi.fn(),
} as unknown as UserRepository;

// Mock bcrypt & jwt
vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  }
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(() => "mock-jwt-token"),
  }
}));

// Wire DI
const authService = new AuthService(mockUserRepository);
const authController = new AuthController(authService);
const userService = new UserService(mockUserRepository, authService);
const userController = new UserController(userService);

const container: Container = {
  userRepository: mockUserRepository,
  authService,
  authController,
  userService,
  userController
};

const app = createApp(container);

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("200 — mengembalikan token JWT jika username dan password benar", async () => {
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "penguji", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBe("mock-jwt-token");
    expect(res.body.data.user.username).toBe("penguji");
  });

  it("401 — mengembalikan error jika password salah", async () => {
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "penguji", password: "salahpassword" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Username atau password salah");
  });

  it("401 — mengembalikan error jika username tidak ditemukan", async () => {
    vi.mocked(mockUserRepository.findByUsername).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "tidakada", password: "password123" });

    expect(res.status).toBe(401);
  });

  it("422 — mengembalikan error validasi jika input kosong", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveLength(2);
  });
});
