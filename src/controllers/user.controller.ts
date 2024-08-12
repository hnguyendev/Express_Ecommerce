import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { validationResult } from "express-validator";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, email, password } = req.body;
      const verification_token = Utils.generateVerificationToken();

      const user = await UserModel.create({
        name,
        phone,
        email,
        verification_token,
        verification_token_time: Date.now() + new Utils().TOKEN_EXPIRED,
        password,
      });

      await NodeMailer.sendMail({
        to: [user.email],
        subject: "Your activation code",
        html: `<h1>Please input ${verification_token} to verify your email.</h1>`,
      });

      res.status(200).json({
        success: true,
        message: `Please check your email ${email}`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { verification_token, email } = req.body;
    try {
      const user = await UserModel.findOneAndUpdate(
        {
          email,
          verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        { email_verified: true },
        { new: true }
      );

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const verification_token = Utils.generateVerificationToken();
      const { email } = req.query;

      const user = await UserModel.findOneAndUpdate(
        { email },
        {
          verification_token,
          verification_token_time: Date.now() + new Utils().TOKEN_EXPIRED,
        }
      );

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await NodeMailer.sendMail({
        to: [user.email],
        subject: "Resend activation code",
        html: `<h1>Please input ${verification_token} to verify your email.</h1>`,
      });

      res.status(200).json({
        success: true,
        message: `Please check your email ${email}`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      console.log(Utils.generateVerificationToken());

      res.status(200).json({
        success: true,
        msg: "xdd",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
