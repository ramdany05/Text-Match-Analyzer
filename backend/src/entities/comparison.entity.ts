import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity("comparisons")
export class Comparison extends BaseEntity {
  @Column({ type: "text" })
  input1: string;

  @Column({ type: "text" })
  input2: string;

  @Column({ type: "varchar" })
  mode: "SENSITIVE" | "INSENSITIVE";

  @Column({ type: "decimal", precision: 5, scale: 2 })
  percentage: number;

  @Column({ type: "int" })
  matchedCount: number;

  @Column({ type: "int" })
  totalCount: number;

  @Column({ type: "jsonb" })
  matchedChars: string[];

  @Column({ type: "varchar" })
  label: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
