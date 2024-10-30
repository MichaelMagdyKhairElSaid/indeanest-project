import { Request, Response, NextFunction } from "express";

export default function catchAsyncError(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void|Response<any>>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(err => next(err));
  };
}
