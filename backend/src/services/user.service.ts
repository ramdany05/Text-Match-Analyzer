import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "./auth.service";
import type { CreateUserBody } from "../schemas/user.schema";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService
  ) {}

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async createUser(data: CreateUserBody) {
    // Hash password sebelum simpan
    const hashedPassword = await this.authService.hashPassword(data.password);
    return this.userRepository.create({
      username: data.username,
      password: hashedPassword,
    });
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}
