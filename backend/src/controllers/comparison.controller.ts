import type { Request, Response } from "express";
import { ComparisonService } from "../services/comparison.service";
import type { CalculateBody } from "../schemas/comparison.schema";

export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  /**
   * Endpoint hanya untuk menghitung persentase tanpa menyimpan (US2).
   * Berguna saat user mengganti input form secara real-time.
   */
  calculate = async (
    req: Request<object, object, CalculateBody>,
    res: Response
  ): Promise<void> => {
    const { input1, input2, mode } = req.body;

    const result = this.comparisonService.calculate(input1, input2, mode);

    res.json({ success: true, data: result });
  };
}
