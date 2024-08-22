import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    title: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, required: true },
    house: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("Addresses", addressSchema);
export default AddressModel;
