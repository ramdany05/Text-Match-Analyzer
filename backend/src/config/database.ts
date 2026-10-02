import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/user.entity";

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
  synchronize: env.NODE_ENV === "development",
  logging: env.NODE_ENV === "development",
  entities: [User],
  migrations: [],
  subscribers: [],
});
