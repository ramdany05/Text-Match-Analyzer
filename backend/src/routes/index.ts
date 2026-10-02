import { Router } from "express";
import type { Container } from "../container";
import { createUserRouter } from "./users";
import { createAuthRouter } from "./auth";

/**
 * Factory function untuk membuat root API router.
 *
 * Menerima container (hasil DI) agar setiap sub-router
 * mendapat controller instance yang sudah ter-wire.
 */
export function createRouter(container: Container): Router {
  const router = Router();

  router.get("/", (_, res) => {
    res.json({
      success: true,
      message: "Express TypeScript Boilerplate",
    });
  });

  router.use("/auth", createAuthRouter(container.authController));
  router.use("/users", createUserRouter(container.userController));

  return router;
}
