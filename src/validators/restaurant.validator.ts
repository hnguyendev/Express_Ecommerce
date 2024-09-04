import { body, query } from "express-validator";
import UserModel from "../models/user.model";

export class RestaurantValidators {
  static createRestaurant() {
    return [
      body("name", "Owner name is required")
        .isString()
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
      body("phone", "Phone is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom(async (email: string) => {
          const user = await UserModel.findOne({ email });
          if (user) throw new Error("User already exists");
          return true;
        }),
      body("password", "Password is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be between 5-20 characters"),

      body("city_id", "City is required").isString(),
      body("restaurant_name", "Restaurant name is required").isString(),
      body("short_name", "Restaurant short name is required").isString(),
      body("description").optional().isString(),
      body("restaurantImages").custom((cover, { req }) => {
        if (!req.file) throw new Error("File not found");
        return true;
      }),
      body("cuisines", "Cuisines is required").isString(),
      body("location", "Location is required").isString(),
      body("open_time", "Openig time is required").isString(),
      body("close_time", "Closing time is required").isString(),
      body("price", "Price is required").isNumeric(),
      body("address", "Address is required").isString(),
      body("delivery_time", "Delivery time is required").isNumeric(),
    ];
  }

  static getNearbyRestaurants() {
    return [
      query("lat", "Latitude is required").isNumeric(),
      query("lng", "Longitude is required").isNumeric(),
      query("radius", "Radius is required").isNumeric(),
    ];
  }

  static searchNearbyRestaurants() {
    return [
      query("name", "Name is required")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),
      query("lat", "Latitude is required").isNumeric(),
      query("lng", "Longitude is required").isNumeric(),
      query("radius", "Radius is required").isNumeric(),
      query("Page", "Page is required").optional().isNumeric(),
    ];
  }
}
