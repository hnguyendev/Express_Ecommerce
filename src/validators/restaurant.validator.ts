import { body } from "express-validator";
import UserModel from "../models/user.model";

// user_id: { type: mongoose.Types.ObjectId, required: true },
// city_id: { type: mongoose.Types.ObjectId, required: true },
// name: { type: String, required: true },
// short_name: { type: String, required: true },
// cover: { type: String },
// description: { type: String },
// cuisines: { type: Array, required: true },
// location: { type: Object, required: true },
// open_time: { type: String, required: true },
// close_time: { type: String, required: true },
// price: { type: Number, required: true },
// address: { type: String, required: true },
// delivery_time: { type: String, required: true },
// is_close: { type: Boolean, required: true, default: false },
// status: { type: String, required: true, default: "active" },
// rating: { type: Number, required: true, default: 0 },
// total_rating: { type: Number, required: true, default: 0 },

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
      body("cover").custom((cover, { req }) => {
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
}
