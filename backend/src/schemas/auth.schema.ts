import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, { message: "username wajib diisi" }),
    password: z.string().min(1, { message: "password wajib diisi" }),
  }),
});

export type LoginBody = z.infer<typeof loginSchema>["body"];
