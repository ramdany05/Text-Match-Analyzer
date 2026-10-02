import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

/**
 * Abstract base entity yang diwarisi oleh semua entity.
 *
 * Menyediakan kolom standar: id (UUID), createdAt, updatedAt, deletedAt (soft delete).
 * Sesuai PRD: BaseEntity diwarisi oleh User, Comparison, dan AuditLog.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date | null;
}
