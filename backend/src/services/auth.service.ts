import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRepository } from "../repositories/user.repository";
import type { LoginBody } from "../schemas/auth.schema";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Helper untuk hash password
   */
  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  /**
   * Proses login dan mengembalikan token JWT jika sukses
   */
  async login(data: LoginBody): Promise<{ token: string; user: { id: string; username: string } } | null> {
    const user = await this.userRepository.findByUsername(data.username);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return null;
    }

    const payload = { id: user.id, userId: user.id, username: user.username };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });

    return { token, user: payload };
  }
}
