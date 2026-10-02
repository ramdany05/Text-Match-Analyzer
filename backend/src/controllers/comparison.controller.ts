import type { Request, Response } from "express";
import { ComparisonService } from "../services/comparison.service";
import type { CalculateBody, PaginationQuery, IdParam } from "../schemas/comparison.schema";

export class ComparisonController {
  constructor(private readonly comparisonService: ComparisonService) {}

  /**
   * Endpoint hanya untuk menghitung persentase tanpa menyimpan (US2).
   */
  calculate = async (
    req: Request<object, object, CalculateBody>,
    res: Response
  ): Promise<void> => {
    const { input1, input2, mode } = req.body;
    const result = this.comparisonService.calculate(input1, input2, mode);
    res.json({ success: true, data: result });
  };

  // --- CRUD API ---

  create = async (
    req: Request<object, object, CalculateBody>,
    res: Response
  ): Promise<void> => {
    const userId = req.user!.userId; // Auth middleware menjamin ini ada
    const { input1, input2, mode } = req.body;
    
    const result = await this.comparisonService.create(userId, input1, input2, mode);
    res.status(201).json({ success: true, data: result });
  };

  findAll = async (
    req: Request<object, any, any, PaginationQuery>,
    res: Response
  ): Promise<void> => {
    const userId = req.user!.userId;
    const page = req.query.page || 1;
    
    const result = await this.comparisonService.findAll(userId, page);
    res.json({ success: true, ...result });
  };

  findOne = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    const userId = req.user!.userId;
    const id = req.params.id;
    
    const result = await this.comparisonService.findOne(userId, id);
    if (!result) {
      res.status(403).json({ success: false, message: "Data tidak ditemukan atau Anda tidak memiliki akses" });
      return;
    }
    
    res.json({ success: true, data: result });
  };

  update = async (
    req: Request<IdParam, object, CalculateBody>,
    res: Response
  ): Promise<void> => {
    const userId = req.user!.userId;
    const id = req.params.id;
    const { input1, input2, mode } = req.body;
    
    const result = await this.comparisonService.update(userId, id, input1, input2, mode);
    if (!result) {
      res.status(403).json({ success: false, message: "Data tidak ditemukan atau Anda tidak memiliki akses" });
      return;
    }
    
    res.json({ success: true, data: result });
  };

  destroy = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    const userId = req.user!.userId;
    const id = req.params.id;
    
    const success = await this.comparisonService.delete(userId, id);
    if (!success) {
      res.status(403).json({ success: false, message: "Data tidak ditemukan atau Anda tidak memiliki akses" });
      return;
    }
    
    res.json({ success: true, message: "Data berhasil dihapus" });
  };
}
