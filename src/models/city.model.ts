import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    status: { type: String, required: true, default: "active" },
  },
  { timestamps: true }
);

const CityModel = mongoose.model("Cities", citySchema);
export default CityModel;
