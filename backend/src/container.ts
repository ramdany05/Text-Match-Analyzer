import { AppDataSource } from "./config/database";
import { User } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";

/**
 * Composition root — manual dependency injection.
 *
 * Semua dependency di-wire di sini:
 *   TypeORM Repository -> Custom Repository -> Service -> Controller
 *
 * File ini harus dipanggil SETELAH AppDataSource.initialize() selesai.
 */
export function createContainer() {
  // TypeORM repositories
  const userTypeOrmRepo = AppDataSource.getRepository(User);

  // Custom repositories
  const userRepository = new UserRepository(userTypeOrmRepo);

  // Services
  const authService = new AuthService(userRepository);
  const userService = new UserService(userRepository, authService);

  // Controllers
  const authController = new AuthController(authService);
  const userController = new UserController(userService);

  return {
    userRepository,
    authService,
    userService,
    authController,
    userController,
  };
}

export type Container = ReturnType<typeof createContainer>;
