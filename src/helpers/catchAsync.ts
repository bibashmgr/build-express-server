import express from "express";

function catchAsync(fn: express.Handler) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    Promise.resolve(fn(req, res, next)).catch((err: unknown) => next(err));
  };
}

export { catchAsync };
