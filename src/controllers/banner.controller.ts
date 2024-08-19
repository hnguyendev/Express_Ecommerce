import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import BannerModel from "../models/banner.model";

export class BannerController {
  static async uploadBanner(req: Request, res: Response, next: NextFunction) {
    const path = req.file.path;
    try {
      const banner = await BannerModel.create({
        banner: path,
      });

      res.status(201).json({
        success: true,
        banner,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const banners = await BannerModel.find({ status: true });

      res.status(200).json({
        success: true,
        banners,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
