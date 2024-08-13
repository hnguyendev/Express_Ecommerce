import { body, query } from "express-validator";
import UserModel from "../models/user.model";

export class UserValidators {
  static register() {
    return [
      body("name", "Name is required").isString(),
      body("phone", "Phone is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom((email: string) => {
          return UserModel.findOne({ email }).then((user) => {
            if (user) throw "User already exists";
            return true;
          });
        }),
      body("password", "Password is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5-20 characters"),
      // body("type", "User role is required").isString(),
      // body("status", "User status is required").isString(),
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
        .custom((email) => {
          return UserModel.findOne({ email }).then((user) => {
            if (!user) throw "User doesn't exist";
            return true;
          });
        }),
    ];
  }

  static resetPassword() {
    return [
      body("oldPassword", "Current password is required").isString(),
      body("newPassword", "New password is required")
        .isString()
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5-20 characters"),
    ];
  }
}
