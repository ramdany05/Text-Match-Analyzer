import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import { AuthController } from "../controllers/auth.controller";
import { User } from "../entities/user.entity";
import type { Container } from "../container";

// Mock data
const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "penguji",
  password: "hashedpassword",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  deletedAt: null,
};

// Mock repository & service
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

// Wire DI secara manual untuk test
const userService = new UserService(mockUserRepository, mockAuthService);
const userController = new UserController(userService);
const authController = new AuthController(mockAuthService);

const container: Container = {
  userRepository: mockUserRepository,
  authService: mockAuthService,
  userService,
  authController,
  userController,
  comparisonService: {} as any,
  comparisonController: {
    calculate: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    getStats: vi.fn(),
  } as any,
};

const app = createApp(container);

describe("GET /api/users", () => {
  beforeEach(() => vi.clearAllMocks());

  it("200 — mengembalikan daftar user tanpa password", async () => {
    vi.mocked(mockUserRepository.findAll).mockResolvedValue([mockUser]);

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].username).toBe("penguji");
    expect(res.body.data[0].password).toBeUndefined();
  });
});

describe("GET /api/users/:id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("200 — mengembalikan user tanpa password jika id valid dan ditemukan", async () => {
    vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);

    const res = await request(app).get(`/api/users/${mockUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockUser.id);
    expect(res.body.data.password).toBeUndefined();
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
    vi.mocked(mockAuthService.hashPassword).mockResolvedValue("hashedpassword");
    vi.mocked(mockUserRepository.create).mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/users")
      .send({ username: "penguji", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe("penguji");
    expect(res.body.data.password).toBeUndefined();
  });

  it("422 — mengembalikan error validasi jika username kurang dari 3 karakter", async () => {
    const res = await request(app).post("/api/users").send({ username: "ab", password: "password123" });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe("username");
  });

  it("422 — mengembalikan error validasi jika password kurang dari 6 karakter", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ username: "penguji", password: "123" });

    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe("password");
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
});
