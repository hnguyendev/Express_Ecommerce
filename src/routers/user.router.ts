import express, { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserValidators } from "../validators/user.validator";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";

class UserRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get(
      "/send/verification",
      GlobalMiddleware.auth,
      UserController.resendVerificationEmail
    );

    this.router.get(
      "/send/reset/password",
      UserValidators.forgotPassword(),
      GlobalMiddleware.checkError,
      UserController.forgotPassword
    );

    this.router.get(
      "/verify/reset-token",
      UserValidators.verifyResetPasswordToken(),
      GlobalMiddleware.checkError,
      UserController.verifyResetPasswordToken
    );

    this.router.get(
      "/profile",
      GlobalMiddleware.auth,
      UserController.getUserProfile
    );
  }

  postRoutes() {
    this.router.post(
      "/register",
      UserValidators.register(),
      GlobalMiddleware.checkError,
      UserController.register
    );

    this.router.post(
      "/login",
      UserValidators.login(),
      GlobalMiddleware.checkError,
      UserController.login
    );

    this.router.post(
      "/refresh-token",
      UserValidators.updateAccessToken(),
      GlobalMiddleware.checkError,
      UserController.updateAccessToken
    );
  }

  putRoutes() {}

  patchRoutes() {
    this.router.patch(
      "/verify/email",
      GlobalMiddleware.auth,
      UserValidators.verifyEmail(),
      GlobalMiddleware.checkError,
      UserController.verifyEmail
    );

    this.router.patch(
      "/reset/password",
      UserValidators.resetPassword(),
      GlobalMiddleware.checkError,
      UserController.resetPassword
    );

    this.router.patch(
      "/update/password",
      GlobalMiddleware.auth,
      UserValidators.updatePassword(),
      GlobalMiddleware.checkError,
      UserController.updatePassword
    );

    this.router.patch(
      "/update/profile",
      GlobalMiddleware.auth,
      UserValidators.updateUserProfile(),
      GlobalMiddleware.checkError,
      UserController.updateUserProfile
    );
  }

  deleteRoutes() {}
}

export default new UserRouter().router;
