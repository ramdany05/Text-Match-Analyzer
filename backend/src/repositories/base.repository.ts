import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  ObjectLiteral,
} from "typeorm";
import { BaseEntity } from "../entities/base.entity";

/**
 * Abstract base repository yang membungkus TypeORM Repository.
 *
 * Menyediakan operasi CRUD standar dengan soft delete.
 * Setiap entity repository mewarisi kelas ini dan menerima
 * TypeORM Repository via constructor (dependency injection).
 */
export abstract class BaseRepository<T extends BaseEntity & ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(order?: FindOptionsOrder<T>): Promise<T[]> {
    return this.repository.find({
      order: order ?? ({ createdAt: "DESC" } as FindOptionsOrder<T>),
    });
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    const entity = await this.findById(id);
    if (!entity) return null;

    Object.assign(entity, data);
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }
}
