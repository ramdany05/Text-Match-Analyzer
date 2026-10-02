import { Repository } from "typeorm";
import { BaseRepository } from "./base.repository";
import { User } from "../entities/user.entity";

export class UserRepository extends BaseRepository<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOneBy({ username });
  }
}
