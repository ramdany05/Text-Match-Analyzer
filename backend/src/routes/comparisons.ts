import { Router } from "express";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { calculateSchema } from "../schemas/comparison.schema";
import type { ComparisonController } from "../controllers/comparison.controller";

export function createComparisonRouter(controller: ComparisonController): Router {
  const router = Router();

  // Wajib login untuk mengakses
  router.use(requireAuth);

  // Endpoint untuk calculate (US2)
  router.post("/calculate", validate(calculateSchema), controller.calculate);

  return router;
}
