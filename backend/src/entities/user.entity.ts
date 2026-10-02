import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

/**
 * Entity User — mewarisi BaseEntity.
 *
 * Untuk boilerplate ini hanya menyimpan email dan name.
 * Field autentikasi (password, username) akan ditambahkan saat fitur auth diimplementasikan.
 */
@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string | null;
}
