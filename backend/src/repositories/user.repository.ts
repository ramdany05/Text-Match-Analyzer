import { Repository } from "typeorm";
import { BaseRepository } from "./base.repository";
import { User } from "../entities/user.entity";

/**
 * Repository untuk entity User.
 *
 * Mewarisi BaseRepository dan menambahkan query spesifik User.
 * Menerima TypeORM Repository<User> via constructor (DI).
 */
export class UserRepository extends BaseRepository<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }
}
