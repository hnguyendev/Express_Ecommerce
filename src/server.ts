require("dotenv").config();
import { ErrorMiddleWare } from "./middleware/error";
import userRouter from "./routers/user.router";
import connectDB from "./utils/db";
import express from "express";
import cors from "cors";
import ErrorHandler from "./utils/ErrorHandler";

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
    this.app.use("/api/v1/user", userRouter);

    this.app.all("*", (req, res, next) => {
      const err = new ErrorHandler(`Route ${req.originalUrl} not found.`, 404);
      next(err);
    });
  }

  errorHandler() {
    this.app.use(ErrorMiddleWare);
  }
}
