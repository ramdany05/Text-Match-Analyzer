import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, { message: "username minimal 3 karakter" }),
    password: z
      .string()
      .min(6, { message: "password minimal 6 karakter" }),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid({ message: "id harus berupa UUID yang valid" }),
  }),
});

export type CreateUserBody = z.infer<typeof createUserSchema>["body"];
export type UserIdParam = z.infer<typeof userIdParamSchema>["params"];
