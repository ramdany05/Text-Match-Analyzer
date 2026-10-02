import "reflect-metadata";
import { env } from "./config/env";
import { AppDataSource } from "./config/database";
import { createContainer } from "./container";
import { createApp } from "./app";

async function bootstrap() {
  // Inisialisasi TypeORM DataSource (koneksi database)
  await AppDataSource.initialize();
  console.log("Database connected.");

  // Wire semua dependency
  const container = createContainer();

  // Buat Express app dengan container yang sudah ter-wire
  const app = createApp(container);

  const server = app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  // Graceful shutdown: berhenti menerima koneksi baru, tunggu request aktif selesai
  function shutdown(signal: string) {
    console.log(`\n${signal} received. Shutting down gracefully...`);

    server.close(async (err) => {
      if (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }

      // Tutup koneksi database
      await AppDataSource.destroy();
      console.log("Server closed.");
      process.exit(0);
    });

    // Force exit jika koneksi tidak selesai dalam 10 detik
    setTimeout(() => {
      console.error("Forcing shutdown after timeout.");
      process.exit(1);
    }, 10_000).unref();
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
