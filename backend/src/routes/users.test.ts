import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../entities/user.entity";
import type { Container } from "../container";

// Mock data
const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "budi@example.com",
  name: "Budi",
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
  findByEmail: vi.fn(),
} as unknown as UserRepository;

// Wire DI secara manual untuk test
const userService = new UserService(mockUserRepository);
const userController = new UserController(userService);

const container: Container = {
  userRepository: mockUserRepository,
  userService,
  userController,
};

const app = createApp(container);

describe("GET /api/users", () => {
  beforeEach(() => vi.clearAllMocks());

  it("200 — mengembalikan daftar user", async () => {
    vi.mocked(mockUserRepository.findAll).mockResolvedValue([mockUser]);

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].email).toBe("budi@example.com");
  });
});

describe("GET /api/users/:id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("200 — mengembalikan user jika id valid dan ditemukan", async () => {
    vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);

    const res = await request(app).get(`/api/users/${mockUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockUser.id);
  });

  it("404 — mengembalikan error jika user tidak ditemukan", async () => {
    vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

    const res = await request(app).get("/api/users/550e8400-e29b-41d4-a716-446655440001");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  it("422 — mengembalikan error validasi jika id bukan UUID", async () => {
    const res = await request(app).get("/api/users/abc");

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /api/users", () => {
  beforeEach(() => vi.clearAllMocks());

  it("201 — membuat user baru dengan payload valid", async () => {
    vi.mocked(mockUserRepository.create).mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/users")
      .send({ email: "budi@example.com", name: "Budi" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("budi@example.com");
  });

  it("422 — mengembalikan error validasi jika email kosong", async () => {
    const res = await request(app).post("/api/users").send({ name: "Budi" });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe("email");
  });

  it("422 — mengembalikan error validasi jika format email salah", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "bukan-email" });

    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe("email");
  });
});

describe("DELETE /api/users/:id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("200 — menghapus user jika id valid", async () => {
    vi.mocked(mockUserRepository.delete).mockResolvedValue(true);

    const res = await request(app).delete(`/api/users/${mockUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User deleted");
  });

  it("422 — mengembalikan error validasi jika id bukan UUID", async () => {
    const res = await request(app).delete("/api/users/abc");

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});
