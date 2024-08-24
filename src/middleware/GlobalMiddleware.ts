import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ErrorHandler from "../utils/ErrorHandler";
import { Jwt } from "../utils/Jwt";

export class GlobalMiddleware {
  static checkError(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 400));
    }

    next();
  }

  static async auth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header || !header.includes("Bearer")) {
      return next(new ErrorHandler("Unauthorized", 401));
    }
    const token = header.split(" ")[1];

    try {
      const decoded = await Jwt.verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static role = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.type)) {
        return next(
          new ErrorHandler(
            `Role ${req.user.type} is not allowed to access this resource`,
            403
          )
        );
      }

      next();
    };
  };
}
