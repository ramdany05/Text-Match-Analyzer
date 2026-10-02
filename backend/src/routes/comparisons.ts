import { Router } from "express";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { calculateSchema, paginationQuerySchema, idParamSchema } from "../schemas/comparison.schema";
import type { ComparisonController } from "../controllers/comparison.controller";

export function createComparisonRouter(controller: ComparisonController): Router {
  const router = Router();

  // Wajib login untuk mengakses
  router.use(requireAuth);

  // Endpoint untuk calculate saja
  router.post("/calculate", validate(calculateSchema), controller.calculate);

  // CRUD endpoints
  router.post("/", validate(calculateSchema), controller.create);
  router.get("/", validate(paginationQuerySchema), controller.findAll);
  router.get("/:id", validate(idParamSchema), controller.findOne);
  router.put("/:id", validate(idParamSchema), validate(calculateSchema), controller.update);
  router.delete("/:id", validate(idParamSchema), controller.destroy);

  return router;
}
