import { Router } from "express";
import { validate } from "../middleware/validate";
import { createUserSchema, userIdParamSchema } from "../schemas/user.schema";
import type { UserController } from "../controllers/user.controller";

/**
 * Factory function untuk membuat user routes.
 *
 * Menerima controller instance dari composition root (DI),
 * bukan import langsung — sehingga controller bisa ditukar saat testing.
 */
export function createUserRouter(controller: UserController): Router {
  const router = Router();

  router.get("/", controller.index);
  router.get("/:id", validate(userIdParamSchema), controller.show);
  router.post("/", validate(createUserSchema), controller.store);
  router.delete("/:id", validate(userIdParamSchema), controller.destroy);

  return router;
}
