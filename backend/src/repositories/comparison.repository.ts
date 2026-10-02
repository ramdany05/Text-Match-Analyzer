import { Repository } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Comparison } from "../entities/comparison.entity";

export class ComparisonRepository extends BaseRepository<Comparison> {
  constructor(repository: Repository<Comparison>) {
    super(repository);
  }

  async findByUserId(userId: string, skip: number, take: number): Promise<{ data: Comparison[]; total: number }> {
    const [data, total] = await this.repository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
      skip,
      take,
    });
    
    return { data, total };
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Comparison | null> {
    return this.repository.findOne({
      where: { id, user: { id: userId } },
    });
  }
}
