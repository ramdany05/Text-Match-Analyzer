import { z } from "zod";

export const calculateSchema = z.object({
  body: z.object({
    input1: z.string().min(1, { message: "Input 1 tidak boleh kosong" }),
    input2: z.string().min(1, { message: "Input 2 tidak boleh kosong" }),
    mode: z.enum(["SENSITIVE", "INSENSITIVE"]),
  }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default("1" as any),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "ID tidak valid" }),
  }),
});

export type CalculateBody = z.infer<typeof calculateSchema>["body"];
export type PaginationQuery = z.infer<typeof paginationQuerySchema>["query"];
export type IdParam = z.infer<typeof idParamSchema>["params"];
