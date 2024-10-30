import { Request, Response, NextFunction } from "express";

export const globalError = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const isDevMode = process.env.MODE === "dev";
  res.status(err.statusCode || 400).json({
    message: err.message,
    ...(isDevMode && { stack: err.stack })
  });
};
