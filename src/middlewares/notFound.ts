import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
    error: `${req.originalUrl} is not a valid endpoint.`,
  });
};

export default notFound;
