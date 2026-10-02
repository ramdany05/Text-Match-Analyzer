import { Router } from "express";
import { validate } from "../middleware/validate";
import { loginSchema } from "../schemas/auth.schema";
import type { AuthController } from "../controllers/auth.controller";

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  router.post("/login", validate(loginSchema), controller.login);

  return router;
}
