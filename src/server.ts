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
    this.app.use("/api/v1/user", userRouter);
    this.app.use("/api/v1/banner", bannerRouter);
    this.app.use("/api/v1/city", cityRouter);
    this.app.use("/api/v1/restaurant", restaurantRouter);

    this.app.all("*", (req, res, next) => {
      next(new ErrorHandler(`Route ${req.originalUrl} not found.`, 404));
    });
  }

  errorHandler() {
    this.app.use(ErrorMiddleWare);
  }
}
