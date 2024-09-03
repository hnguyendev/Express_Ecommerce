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
        price: parseInt(data.price),
        address: data.address,
        delivery_time: parseInt(data.delivery_time),
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
    const limit = 10;
    const { page = 1, sort } = req.query;
    try {
      const total = await RestaurantModel.countDocuments({ status: "active" });
      const pageCount = Math.ceil(total / limit);

      if (
        parseInt(page as string) > pageCount ||
        parseInt(page as string) < 1
      ) {
        return next(new ErrorHandler("Invalid page number", 400));
      }

      const sortBy = {};
      if (sort) {
        const [value, order] = sort.toString().split("-");
        const allowedFields = ["price", "rating"];
        if (allowedFields.includes(value)) {
          sortBy[value] = order === "desc" ? -1 : 1;
        }
      } else {
        sortBy["createdAt"] = -1;
      }

      const options = {
        skip: (parseInt(page as string) - 1) * limit,
        limit,
        sort: sortBy,
      };

      const restaurants = await RestaurantModel.find(
        { status: "active" },
        null,
        options
      );

      res.status(200).json({
        success: true,
        restaurants,
        pagination: {
          page,
          pageSize: limit,
          total,
          pageCount,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getNearbyRestaurants(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { lat, lng, radius }: any = req.query;
    try {
      const restaurants = await RestaurantModel.find({
        status: "active",
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(lng), parseFloat(lat)],
              parseFloat(radius) / 6378.1,
            ],
          },
        },
      });

      res.status(200).json({
        success: true,
        restaurants,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async searchNearbyRestaurants(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { name, lat, lng, radius }: any = req.query;
    try {
      const restaurants = await RestaurantModel.find({
        status: "active",
        name: { $regex: name, $options: "i" },
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(lng), parseFloat(lat)],
              parseFloat(radius) / 6378.1,
            ],
          },
        },
      });

      res.status(200).json({
        success: true,
        restaurants,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
