import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import RestaurantModel from "../models/restaurant.model";
import { Utils } from "../utils/Utils";
import UserModel from "../models/user.model";
import CategoryModel from "../models/category.model";

export class RestaurantController {
  static async createRestaurant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const data = req.body;
    const { path } = req.file;
    try {
      const verification_token = Utils.generateVerificationToken();

      const user = await UserModel.create({
        name: data.name,
        phone: data.phone,
        email: data.email,
        verification_token,
        verification_token_time: Date.now() + new Utils().TOKEN_EXPIRED,
        password: data.password,
        type: "restaurant",
      });

      const restaurant = await RestaurantModel.create({
        user_id: user._id,
        city_id: data.city_id,
        name: data.restaurant_name,
        short_name: data.short_name,
        description: data.description,
        cover: path,
        cuisines: JSON.parse(data.cuisines),
        location: JSON.parse(data.location),
        open_time: data.open_time,
        close_time: data.close_time,
        price: data.price,
        address: data.address,
        delivery_time: data.delivery_time,
      });

      const categories = JSON.parse(data.categories).map((category) => {
        return { name: category, restaurant_id: restaurant._id };
      });

      await CategoryModel.insertMany(categories);

      res.status(200).json({
        success: true,
        restaurant,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getRestaurants(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurants = await RestaurantModel.find({});

      res.status(200).json({
        success: true,
        restaurants,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
