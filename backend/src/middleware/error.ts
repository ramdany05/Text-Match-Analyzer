import type { ErrorRequestHandler, RequestHandler } from "express";

import { env } from "../config/env";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const statusCode = typeof err?.statusCode === "number" ? err.statusCode : 500;

  console.error(`[error] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
};
