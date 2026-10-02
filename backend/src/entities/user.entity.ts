import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: "varchar", unique: true })
  username: string;

  @Column({ type: "varchar" })
  password: string; // bcrypt hash
}
