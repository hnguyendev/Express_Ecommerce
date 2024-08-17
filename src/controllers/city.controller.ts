import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import CityModel from "../models/city.model";

export class CityController {
  static async createCity(req: Request, res: Response, next: NextFunction) {
    const { name, lat, lng } = req.body;
    try {
      const city = await CityModel.create({ name, lat, lng });

      res.status(201).json({
        success: true,
        city,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const cities = await CityModel.find({ status: "active" });

      res.status(200).json({
        success: true,
        cities,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
