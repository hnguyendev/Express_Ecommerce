import { body } from "express-validator";
import RestaurantModel from "../models/restaurant.model";
import CategoryModel from "../models/category.model";

export class ItemValidators {
  static createItem() {
    return [
      body("restaurant_id", "Restaurant is required")
        .isString()
        .custom(async (restaurant_id) => {
          const restaurant = await RestaurantModel.findById(restaurant_id);
          if (!restaurant) throw new Error("Restaurant not found");
          return true;
        }),
      body("category_id", "Category is required")
        .isString()
        .custom(async (category_id, { req }) => {
          const category = await CategoryModel.findOne({
            _id: category_id,
            restaurant_id: req.body.restaurant_id,
          });
          if (!category) throw new Error("Category not found");
          return true;
        }),
      body("name", "Name is required").isString(),
      body("description").optional().isString(),
      body("price", "Price is required").isNumeric(),
      body("veg", "Veg status is required").isBoolean(),
      body("status", "Status is required").isString(),

      body("itemImages", "Cover image is required").custom(
        (itemImages, { req }) => {
          if (!req.file) {
            throw new Error("File not found");
          }
          return true;
        }
      ),
    ];
  }
}
