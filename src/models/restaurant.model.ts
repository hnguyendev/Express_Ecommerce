import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    city_id: { type: mongoose.Types.ObjectId, ref: "Cities", required: true },
    name: { type: String, required: true },
    short_name: { type: String, required: true },
    cover: { type: String, required: true },
    description: { type: String, default: "" },
    cuisines: { type: Array, required: true },
    location: { type: Object, required: true },
    open_time: { type: String, required: true },
    close_time: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    delivery_time: { type: Number, required: true },
    is_close: { type: Boolean, required: true, default: false },
    status: { type: String, required: true, default: "active" },
    rating: { type: Number, required: true, default: 0 },
    total_rating: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const RestaurantModel = mongoose.model("Restaurants", restaurantSchema);
export default RestaurantModel;
