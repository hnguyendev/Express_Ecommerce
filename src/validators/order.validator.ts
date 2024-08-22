import { body } from "express-validator";
import { isValidObjectId } from "mongoose";
import RestaurantModel from "../models/restaurant.model";

export class OrderValidators {
  static createOrder() {
    return [
      body("restaurant_id", "Restaurant is required")
        .isString()
        .custom(async (restaurant_id) => {
          if (!isValidObjectId(restaurant_id)) throw new Error("Invalid id");
          const restaurant = await RestaurantModel.findById(restaurant_id);
          if (!restaurant) throw new Error("Restaurant not found");
          return true;
        }),
      body("order", "Order is required").isArray(),
      body("instruction").optional().isString(),
      body("address", "Address is required").isObject(),
      body("status", "Status is required").isString(),
      body("total", "Total is required").isNumeric(),
      body("grand_total", "Grand total is required").isNumeric(),
      body("delivery_charge", "Delivery charge is required").isNumeric(),
      body("payment_status", "Payment status is required").isBoolean(),
      body("payment_mode", "Payment mode is required").isString(),
    ];
  }
}
