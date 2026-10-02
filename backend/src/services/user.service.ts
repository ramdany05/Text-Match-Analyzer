import { UserRepository } from "../repositories/user.repository";

export interface CreateUserData {
  email: string;
  name?: string | undefined;
}

/**
 * Service layer untuk User.
 *
 * Menampung business logic dan menerima UserRepository via constructor (DI).
 * Controller tetap tipis — hanya memanggil method service ini.
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async createUser(data: CreateUserData) {
    return this.userRepository.create({
      email: data.email,
      name: data.name ?? null,
    });
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}
