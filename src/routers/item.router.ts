import express, { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { ItemValidators } from "../validators/item.validator";
import { ItemController } from "../controllers/item.controller";
import { Utils } from "../utils/Utils";

class ItemRouter {
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
      "/menu-items/:restaurantId",
      GlobalMiddleware.auth,
      ItemValidators.getMenuItems(),
      GlobalMiddleware.checkError,
      ItemController.getMenuItems
    );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleware.auth,
      GlobalMiddleware.role("admin"),
      new Utils().multerStorage.single("itemImages"),
      ItemValidators.createItem(),
      GlobalMiddleware.checkError,
      ItemController.createItem
    );
  }

  putRoutes() {}

  patchRoutes() {}

  deleteRoutes() {}
}

export default new ItemRouter().router;
