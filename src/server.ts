require("dotenv").config();
import { ErrorMiddleWare } from "./middleware/error";
import connectDB from "./utils/db";
import express from "express";
import cors from "cors";
import ErrorHandler from "./utils/ErrorHandler";
import userRouter from "./routers/user.router";
import bannerRouter from "./routers/banner.router";
import cityRouter from "./routers/city.router";
import restaurantRouter from "./routers/restaurant.router";
import categoryRouter from "./routers/category.router";
import itemRouter from "./routers/item.router";
import addressRouter from "./routers/address.router";
import orderRouter from "./routers/order.router";

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.setRoutes();
    this.errorHandler();
  }

  setConfigs() {
    this.connectMongoDB();
    this.configureBodyParser();
    this.allowCors();
  }

  configureBodyParser() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  allowCors() {
    this.app.use(cors());
  }

  connectMongoDB() {
    connectDB();
  }

  setRoutes() {
    this.app.use("/src/uploads", express.static("src/uploads"));
    this.app.use("/api/v1/users", userRouter);
    this.app.use("/api/v1/banners", bannerRouter);
    this.app.use("/api/v1/cities", cityRouter);
    this.app.use("/api/v1/restaurants", restaurantRouter);
    this.app.use("/api/v1/categories", categoryRouter);
    this.app.use("/api/v1/items", itemRouter);
    this.app.use("/api/v1/address", addressRouter);
    this.app.use("/api/v1/orders", orderRouter);

    this.app.all("*", (req, res, next) => {
      next(new ErrorHandler(`Route ${req.originalUrl} not found.`, 404));
    });
  }

  errorHandler() {
    this.app.use(ErrorMiddleWare);
  }
}
