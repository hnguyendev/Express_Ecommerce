import express, { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { CategoryController } from "../controllers/category.controller";

class CategoryRouter {
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
      "/:id",
      GlobalMiddleware.auth,
      CategoryController.getCategoriesByRestaurant
    );
  }

  postRoutes() {}

  putRoutes() {}

  patchRoutes() {}

  deleteRoutes() {}
}

export default new CategoryRouter().router;
