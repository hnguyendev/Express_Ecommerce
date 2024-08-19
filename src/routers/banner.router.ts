import express, { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { Utils } from "../utils/Utils";
import { BannerValidator } from "../validators/banner.validator";
import { BannerController } from "../controllers/banner.controller";

class BannerRouter {
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
    this.router.get("/", GlobalMiddleware.auth, BannerController.getBanners);
  }

  postRoutes() {
    this.router.post(
      "/upload",
      GlobalMiddleware.auth,
      GlobalMiddleware.role("admin"),
      new Utils().multerStorage.single("banner"),
      BannerValidator.uploadBanner(),
      GlobalMiddleware.checkError,
      BannerController.uploadBanner
    );
  }

  putRoutes() {}

  patchRoutes() {}

  deleteRoutes() {}
}

export default new BannerRouter().router;
