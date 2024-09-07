import { body, query } from "express-validator";
import UserModel from "../models/user.model";

export class UserValidators {
  static register() {
    return [
      body("name", "Name is required")
        .isString()
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
      body("phone", "Phone is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom(async (email: string) => {
          const user = await UserModel.findOne({ email });
          if (user) throw new Error("User already exists");
          return true;
        }),
      body("password", "Password is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5-20 characters"),
    ];
  }

  static verifyEmail() {
    return [body("verification_token", "Token is required").isNumeric()];
  }

  static login() {
    return [
      body("email", "Email is required").isEmail(),
      body("password", "Password is required").isString(),
    ];
  }

  static forgotPassword() {
    return [
      query("email", "Email is required")
        .isEmail()
        .custom(async (email) => {
          const user = await UserModel.findOne({ email });
          if (!user) throw new Error("User doesn't exist");
          return true;
        }),
    ];
  }

  static verifyResetPasswordToken() {
    return [
      query("email", "Email is required").isEmail(),
      query("reset_password_token", "Reset password token is required")
        .isNumeric()
        .custom(async (reset_password_token, { req }) => {
          const user = await UserModel.findOne({
            email: req.query.email,
            reset_password_token,
            reset_password_token_time: { $gt: Date.now() },
          });
          if (!user) throw new Error("Invalid token");
          return true;
        }),
    ];
  }

  static resetPassword() {
    return [
      body("email", "Email is required").isEmail(),
      body("new_password", "New password is required")
        .isString()
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5-20 characters"),
      body("confirm_password", "Password confirmation is required")
        .isString()
        .custom((confirm_password, { req }) => {
          return confirm_password === req.body.new_password;
        })
        .withMessage("Password confirmation doesn't match"),
      body(
        "reset_password_token",
        "Reset password token is required"
      ).isNumeric(),
    ];
  }

  static updatePassword() {
    return [
      body("old_password", "Current password is required").isString(),
      body("new_password", "New password is required")
        .isString()
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5-20 characters"),
    ];
  }

  static updateUserProfile() {
    return [
      body("name", "Name is required")
        .optional()
        .isString()
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
      body("phone", "Phone is required")
        .optional()
        .isString()
        .withMessage("Phone is required"),
      body("email", "Email is required")
        .optional()
        .isEmail()
        .custom(async (email, { req }) => {
          if (email === req.user.email) {
            throw new Error("Please provide a different email");
          }
          const user = await UserModel.findOne({ email });
          if (user) throw new Error("Email already in use");
          return true;
        }),
      body("password", "Password is required").isString(),
    ];
  }

  static updateAccessToken() {
    return [
      body("refresh_token", "Refresh token is required")
        .isString()
        .custom((refresh_token, { req }) => {
          if (!refresh_token) {
            throw new Error("No refresh token available");
          }
          return true;
        }),
    ];
  }

  static updateUserAvatar() {
    return [
      body("userImages").custom((userImage, { req }) => {
        if (!req.file) {
          throw new Error("File not found");
        }
        return true;
      }),
    ];
  }
}
