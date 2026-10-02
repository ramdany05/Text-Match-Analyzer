import { z } from "zod";

export const calculateSchema = z.object({
  body: z.object({
    input1: z.string().min(1, { message: "Input 1 tidak boleh kosong" }),
    input2: z.string().min(1, { message: "Input 2 tidak boleh kosong" }),
    mode: z.enum(["SENSITIVE", "INSENSITIVE"], {
      errorMap: () => ({ message: "Mode harus SENSITIVE atau INSENSITIVE" }),
    }),
  }),
});

export type CalculateBody = z.infer<typeof calculateSchema>["body"];
