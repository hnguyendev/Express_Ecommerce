import express, { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { RestaurantValidators } from "../validators/restaurant.validator";
import { RestaurantController } from "../controllers/restaurant.controller";
import { Utils } from "../utils/Utils";

class RestaurantRouter {
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
      "/",
      GlobalMiddleware.auth,
      RestaurantController.getRestaurants
    );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleware.auth,
      GlobalMiddleware.role("admin"),
      new Utils().multerStorage.single("cover"),
      RestaurantValidators.createRestaurant(),
      GlobalMiddleware.checkError,
      RestaurantController.createRestaurant
    );
  }

  putRoutes() {}

  patchRoutes() {}

  deleteRoutes() {}
}

export default new RestaurantRouter().router;
