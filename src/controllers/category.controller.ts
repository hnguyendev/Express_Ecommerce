import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import CategoryModel from "../models/category.model";
import { isValidObjectId } from "mongoose";

export class CategoryController {
  static async getCategoriesByRestaurant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      if (!isValidObjectId(id)) {
        return next(new ErrorHandler("Invalid id", 400));
      }

      const categories = await CategoryModel.find({
        restaurant_id: id,
      });

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
