import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

interface BodyParseError extends SyntaxError {
  status?: number;
  type?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      status: "error",
      message: "Dados inválidos",
      errors: messages,
    });
  }

  const bodyParseError = err as BodyParseError;
  if (bodyParseError instanceof SyntaxError && bodyParseError.status === 400) {
    return res.status(400).json({
      status: "error",
      message: "Corpo da requisição contém JSON inválido",
    });
  }

  const statusCode = (err as { statusCode?: unknown }).statusCode;
  if (typeof statusCode === "number" && statusCode >= 400 && statusCode < 500) {
    return res.status(statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("Erro interno:", err);

  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
}
