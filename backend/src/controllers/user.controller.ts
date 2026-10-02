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
    // Exclude password from response
    const sanitized = users.map(({ password, ...rest }) => rest);
    res.json({ success: true, data: sanitized });
  };

  show = async (req: Request<UserIdParam>, res: Response): Promise<void> => {
    const user = await this.userService.getUserById(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const { password, ...sanitized } = user;
    res.json({ success: true, data: sanitized });
  };

  store = async (
    req: Request<object, object, CreateUserBody>,
    res: Response,
  ): Promise<void> => {
    const user = await this.userService.createUser(req.body);
    const { password, ...sanitized } = user;
    res.status(201).json({ success: true, data: sanitized });
  };

  destroy = async (req: Request<UserIdParam>, res: Response): Promise<void> => {
    await this.userService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted" });
  };
}
