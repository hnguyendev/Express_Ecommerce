import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import RestaurantModel from "../models/restaurant.model";
import { Utils } from "../utils/Utils";
import UserModel from "../models/user.model";
import CategoryModel from "../models/category.model";
import mongoose from "mongoose";

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

  //admin
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

  // user
  static async getNearbyRestaurants(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { lat, lng, radius, sort, cursor } = req.query;
    const limit = 50;
    try {
      let query: Record<string, any> = { status: "active" };
      let cursorField = "_id";

      const [value, direction] = sort?.toString().split("-") || ["_id", "asc"];
      const allowedFields = ["price", "rating"];
      if (allowedFields.includes(value)) {
        cursorField = value;
      }

      const order = {
        key: direction === "desc" ? "$lt" : "$gt",
        sort_order: direction === "desc" ? -1 : 1,
      };

      const sortBy: any = {
        [cursorField]: order.sort_order,
        _id: order.sort_order,
      };

      if (cursor) {
        const decrypted = Utils.decryptCursor(cursor as string);
        const [lastId, lastValue] = decrypted.split("-");
        const cursorId = new mongoose.Types.ObjectId(lastId);

        query.$or = [
          { [cursorField]: { [order.key]: lastValue } },
          {
            [cursorField]: lastValue,
            _id: { [order.key]: cursorId },
          },
        ];
      }

      const restaurants = await RestaurantModel.find({
        ...query,
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(lng as string), parseFloat(lat as string)],
              parseFloat(radius as string) / 6378.1,
            ],
          },
        },
      })
        .sort(sortBy)
        .limit(limit);

      let newCursor = null;
      let hasNextPage = false;
      if (restaurants.length === limit) {
        hasNextPage = true;
        const lastRestaurant = restaurants[restaurants.length - 1];
        const encryptedData = `${lastRestaurant["_id"]}-${lastRestaurant[cursorField]}`;
        newCursor = Utils.encryptCursor(encryptedData);
      }
      console.log(restaurants.length);

      res.status(200).json({
        success: true,
        restaurants,
        pagination: {
          cursor: newCursor,
          hasNextPage,
        },
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
    const { name, lat, lng, radius, page = 1 } = req.query;
    const limit = 10;
    const skip = (parseInt(page as string, 10) - 1) * limit;
    try {
      const total = await RestaurantModel.countDocuments({
        status: "active",
        name: { $regex: name, $options: "i" },
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(lng as string), parseFloat(lat as string)],
              parseFloat(radius as string) / 6378.1,
            ],
          },
        },
      });

      if (!total) {
        return res.status(200).json({
          success: true,
          restaurants: [],
        });
      }

      const pageCount = Math.ceil(total / limit);

      if (
        parseInt(page as string) > pageCount ||
        parseInt(page as string) < 1
      ) {
        return next(new ErrorHandler("Invalid page number", 400));
      }

      const restaurants = await RestaurantModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [
                parseFloat(lng as string),
                parseFloat(lat as string),
              ],
            },
            key: "location",
            spherical: true,
            query: {
              status: "active",
              name: { $regex: name, $options: "i" },
            },
            distanceField: "calc_distance",
            maxDistance: parseFloat(radius as string) * 1000,
          },
        },
      ])
        .skip(skip)
        .limit(limit);

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
}
