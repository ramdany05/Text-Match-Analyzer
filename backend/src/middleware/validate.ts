import type { RequestHandler } from "express";
import { z, ZodSchema, ZodError } from "zod";

type ParsedRequest = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

/**
 * Middleware factory untuk memvalidasi request menggunakan Zod schema.
 *
 * Schema harus berupa object dengan key `body`, `params`, dan/atau `query`.
 * Contoh pemakaian:
 *
 *   router.post("/", validate(createUserSchema), handler)
 */
export function validate(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = (result.error as ZodError).issues.map((issue) => ({
        field: issue.path.slice(1).join("."), // hilangkan prefix "body"/"params"/"query"
        message: issue.message,
      }));

      res.status(422).json({
        success: false,
        message: "Validasi gagal",
        errors,
      });
      return;
    }

    // Mutasi req agar handler mendapat data yang sudah ter-parse & sanitasi
    const data = result.data as ParsedRequest;
    if (data.body !== undefined) req.body = data.body;
    if (data.params !== undefined) Object.assign(req.params, data.params);
    if (data.query !== undefined) Object.assign(req.query, data.query);

    next();
  };
}
