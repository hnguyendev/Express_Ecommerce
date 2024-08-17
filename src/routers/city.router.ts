import express, { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { Utils } from "../utils/Utils";
import { CityController } from "../controllers/city.controller";
import { CityValidators } from "../validators/city.validator";

class CityRouter {
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
    this.router.get("/cities", CityController.getCities);
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleware.auth,
      GlobalMiddleware.role("admin"),
      CityValidators.addCity(),
      GlobalMiddleware.checkError,
      CityController.createCity
    );
  }

  putRoutes() {}

  patchRoutes() {}

  deleteRoutes() {}
}

export default new CityRouter().router;
