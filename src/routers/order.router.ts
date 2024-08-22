import express, { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { OrderValidators } from "../validators/order.validator";
import { OrderController } from "../controllers/order.controller";

class OrderRouter {
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
    this.router.get("/", GlobalMiddleware.auth, OrderController.getOrders);
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleware.auth,
      OrderValidators.createOrder(),
      GlobalMiddleware.checkError,
      OrderController.createOrder
    );
  }

  putRoutes() {}

  patchRoutes() {}

  deleteRoutes() {}
}

export default new OrderRouter().router;
