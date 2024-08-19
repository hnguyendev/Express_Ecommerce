import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurants",
      required: true,
    },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Categories", categorySchema);
export default CategoryModel;
