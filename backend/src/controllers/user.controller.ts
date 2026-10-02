import type { Request, Response } from "express";
import { UserService } from "../services/user.service";
import type { CreateUserBody, UserIdParam } from "../schemas/user.schema";

/**
 * Controller untuk User.
 *
 * Menerima UserService via constructor (DI).
 * Hanya menangani HTTP request/response, logika bisnis didelegasikan ke service.
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  index = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAllUsers();
    res.json({ success: true, data: users });
  };

  show = async (req: Request<UserIdParam>, res: Response): Promise<void> => {
    const user = await this.userService.getUserById(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  };

  store = async (
    req: Request<object, object, CreateUserBody>,
    res: Response,
  ): Promise<void> => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  };

  destroy = async (req: Request<UserIdParam>, res: Response): Promise<void> => {
    await this.userService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted" });
  };
}
