import "reflect-metadata";

// Set dummy DATABASE_URL for test environment to prevent env validation from crashing
process.env["DATABASE_URL"] = process.env["DATABASE_URL"] ?? "postgresql://test:test@localhost:5432/test";
process.env["NODE_ENV"] = "test";
