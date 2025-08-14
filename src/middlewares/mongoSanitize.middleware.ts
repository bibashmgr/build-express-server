import express from "express";

function purgeDollarSign(input: string) {
  return input.replace(/\$/g, "");
}

function sanitize(data: any): any {
  if (typeof data === "string") {
    return purgeDollarSign(data);
  } else if (Array.isArray(data)) {
    return data.map(sanitize);
  } else if (data && typeof data === "object") {
    const sanitized: any = {};

    for (const key in data) {
      if (key.startsWith("$") || key.includes(".")) {
        continue;
      }
      sanitized[key] = sanitize(data[key]);
    }

    return sanitized;
  }

  return data;
}

function mongoSanitize() {
  return function (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body) req.body = sanitize(req.body);
    if (req.params) req.params = sanitize(req.params);

    if (req.query) {
      const sanitizedQuery = sanitize(req.query);
      Object.defineProperty(req, "query", {
        value: sanitizedQuery,
        writable: false,
        configurable: true,
        enumerable: true,
      });
    }

    next();
  };
}

export { mongoSanitize };
