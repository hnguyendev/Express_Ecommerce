import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    restaurant_id: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurants",
      required: true,
    },
    order: { type: Array, required: true },
    instruction: { type: String, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true },
    total: { type: Number, required: true },
    grand_total: { type: Number, required: true },
    delivery_charge: { type: Number, required: true },
    payment_status: { type: Boolean, required: true },
    payment_mode: { type: String, required: true },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Orders", orderSchema);
export default OrderModel;
