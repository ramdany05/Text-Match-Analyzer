import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler, notFoundHandler } from "./middleware/error";
import type { Container } from "./container";
import { createRouter } from "./routes";

/**
 * Factory function untuk membuat Express app.
 *
 * Menerima container (DI) agar router bisa menggunakan
 * controller instance yang sudah ter-wire.
 */
export function createApp(container: Container) {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", createRouter(container));

  // 404 untuk route yang tidak ditemukan
  app.use(notFoundHandler);

  // Error handler global (harus paling akhir)
  app.use(errorHandler);

  return app;
}
