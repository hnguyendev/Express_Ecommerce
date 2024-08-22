import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurants",
      required: true,
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    cover: { type: String, required: true },
    price: { type: Number, required: true },
    veg: { type: Boolean, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const ItemModel = mongoose.model("Items", itemSchema);
export default ItemModel;
