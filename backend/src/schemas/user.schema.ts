import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, { message: "email wajib diisi" })
      .email({ message: "Format email tidak valid" }),
    name: z.string().min(1, { message: "name tidak boleh kosong" }).optional(),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid({ message: "id harus berupa UUID yang valid" }),
  }),
});

// Inferred types untuk dipakai di controller / route
export type CreateUserBody = z.infer<typeof createUserSchema>["body"];
export type UserIdParam = z.infer<typeof userIdParamSchema>["params"];
