import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    banner: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banners", bannerSchema);
export default BannerModel;
