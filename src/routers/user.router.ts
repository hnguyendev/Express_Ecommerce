import express, { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserValidators } from "../validators/UserValidators";
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
      "/reset/password",
      UserValidators.forgotPassword(),
      GlobalMiddleware.checkError,
      UserController.forgotPassword
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
  }

  putRoutes() {}

  patchRoutes() {
    this.router.patch(
      "/verify",
      UserValidators.verifyEmail(),
      GlobalMiddleware.checkError,
      GlobalMiddleware.auth,
      UserController.verifyEmail
    );
  }

  deleteRoutes() {}
}

export default new UserRouter().router;
