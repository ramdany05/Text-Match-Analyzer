import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/user.entity";
import { Comparison } from "../entities/comparison.entity";

/**
 * Parse DATABASE_URL menjadi konfigurasi TypeORM.
 */
function parseConnectionUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 5432,
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.slice(1), // hapus leading "/"
  };
}

const connection = parseConnectionUrl(env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: connection.host,
  port: connection.port,
  username: connection.username,
  password: connection.password,
  database: connection.database,
  // synchronize diaktifkan di development dan saat DB_SYNC=true (misal: docker pertama kali)
  synchronize: env.NODE_ENV === "development" || process.env["DB_SYNC"] === "true",
  logging: env.NODE_ENV === "development",
  entities: [User, Comparison],
  migrations: [],
  subscribers: [],
});
