import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import ItemModel from "../models/item.model";
import CategoryModel from "../models/category.model";
import { isValidObjectId } from "mongoose";
import RestaurantModel from "../models/restaurant.model";

export class ItemController {
  static async createItem(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const { path } = req.file;
    try {
      const item = await ItemModel.create({
        restaurant_id: data.restaurant_id,
        category_id: data.category_id,
        name: data.name,
        description: data.description,
        price: data.price,
        veg: data.veg,
        status: data.status,
        cover: path,
      });

      res.status(200).json({
        success: true,
        item,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getMenuItems(req: Request, res: Response, next: NextFunction) {
    const { restaurantId } = req.params;
    try {
      const restaurant = await RestaurantModel.findById(restaurantId);
      if (!restaurant) {
        return next(new ErrorHandler("Restaurant not found", 404));
      }

      const categories = await CategoryModel.find({
        restaurant_id: restaurant._id,
      });

      const items = await ItemModel.find({
        restaurant_id: restaurant._id,
      });

      res.status(200).json({
        success: true,
        restaurant,
        categories,
        items,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
