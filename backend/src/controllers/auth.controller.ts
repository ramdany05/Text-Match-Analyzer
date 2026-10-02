import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import type { LoginBody } from "../schemas/auth.schema";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (
    req: Request<object, object, LoginBody>,
    res: Response,
  ): Promise<void> => {
    const result = await this.authService.login(req.body);

    if (!result) {
      res.status(401).json({ success: false, message: "Username atau password salah" });
      return;
    }

    res.json({ success: true, data: result });
  };
}
