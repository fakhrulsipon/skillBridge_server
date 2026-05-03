import { Request, Response, NextFunction } from "express";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  
  // Log the error for the developer
  console.error(`[ERROR] ${req.method} ${req.url} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
