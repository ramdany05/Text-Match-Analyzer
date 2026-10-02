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

  async getStatsByUserId(userId: string) {
    const result = await this.repository
      .createQueryBuilder("c")
      .select("AVG(c.percentage)", "avgPercentage")
      .addSelect("MAX(c.percentage)", "maxPercentage")
      .addSelect("SUM(CASE WHEN c.mode = 'SENSITIVE' THEN 1 ELSE 0 END)", "sensitiveCount")
      .addSelect("SUM(CASE WHEN c.mode = 'INSENSITIVE' THEN 1 ELSE 0 END)", "insensitiveCount")
      .where("c.user.id = :userId", { userId })
      .getRawOne();

    return {
      avgPercentage: Number(result.avgPercentage) || 0,
      maxPercentage: Number(result.maxPercentage) || 0,
      sensitiveCount: Number(result.sensitiveCount) || 0,
      insensitiveCount: Number(result.insensitiveCount) || 0,
    };
  }
}
