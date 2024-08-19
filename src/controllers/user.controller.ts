require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import { Jwt } from "../utils/Jwt";

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

      const payload = {
        aud: user._id,
        email: user.email,
        type: user.type,
      };
      const token = Jwt.jwtSign(payload);

      await NodeMailer.sendMail({
        to: [user.email],
        subject: "Your activation code",
        html: `<h1>Please input ${verification_token} to verify your email.</h1>`,
      });

      res.status(200).json({
        success: true,
        message: `Please check your ${user.email} to activate account!`,
        token: token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { verification_token } = req.body;
    const { email } = req.user;
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
        return next(
          new ErrorHandler("Failed to verify email. Please try again", 400)
        );
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
      const { email } = req.user;
      const verification_token = Utils.generateVerificationToken();

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

      const user = await UserModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const matchPassword = await user.comparePassword(password);

      if (!matchPassword) {
        return next(new ErrorHandler("Invalid credentials", 401));
      }

      const payload = {
        aud: user._id,
        email: user.email,
        type: user.type,
      };
      const token = Jwt.jwtSign(payload);

      res.status(200).json({
        success: true,
        user,
        token: token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  // send OTP to reset password
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query;
      const reset_password_token = Utils.generateVerificationToken();

      const user = await UserModel.findOneAndUpdate(
        { email },
        {
          reset_password_token,
          reset_password_token_time: Date.now() + new Utils().TOKEN_EXPIRED,
        }
      );

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await NodeMailer.sendMail({
        to: [user.email],
        subject: "Reset password code",
        html: `<h1>Please input ${reset_password_token} to reset your password.</h1>`,
      });

      res.status(200).json({
        success: true,
        message: `Please check your email ${email}`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static verifyResetPasswordToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.status(200).json({
      success: true,
    });
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { email, new_password, reset_password_token } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (user.reset_password_token !== reset_password_token) {
        return next(new ErrorHandler("Invalid token", 401));
      }

      user.password = new_password;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Reset password successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    const { aud } = req.user;
    const { old_password, new_password } = req.body;
    try {
      const user = await UserModel.findById(aud).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const matchPassword = await user.comparePassword(old_password);

      if (!matchPassword) {
        return next(new ErrorHandler("Password does not match", 401));
      }

      user.password = new_password;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, phone, email, password } = req.body;
    const user = req.user;
    try {
      if (!name && !phone && !email) {
        return next(new ErrorHandler("Update at least 1 field", 400));
      }

      const existingUser = await UserModel.findById(user.aud).select(
        "+password"
      );
      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const matchPassword = await existingUser.comparePassword(password);
      if (!matchPassword) {
        return next(new ErrorHandler("Password doesn't match", 401));
      }

      const verification_token = Utils.generateVerificationToken();

      if (email) {
        existingUser.email = email;
        existingUser.email_verified = false;
        existingUser.verification_token = verification_token;
        existingUser.verification_token_time = new Date(
          Date.now() + new Utils().TOKEN_EXPIRED
        );

        await NodeMailer.sendMail({
          to: [email],
          subject: "Email Verification",
          html: `<h1>Please input ${verification_token} to verify your email</h1>`,
        });
      }
      if (name) existingUser.name = name;
      if (phone) existingUser.phone = phone;

      await existingUser.save();

      const payload = {
        aud: existingUser._id,
        email: existingUser.email,
        type: existingUser.type,
      };
      const token = Jwt.jwtSign(payload);

      res.status(200).json({
        success: true,
        user: existingUser,
        token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getUserProfile(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    try {
      const profile = await UserModel.findById(user.aud);

      if (!profile) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        profile,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
