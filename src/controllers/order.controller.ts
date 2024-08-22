import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/order.model";
import UserModel from "../models/user.model";

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    const { aud } = req.user;
    const data = req.body;
    try {
      const existingUser = await UserModel.findById(aud);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const order = await OrderModel.create({
        user_id: existingUser._id,
        restaurant_id: data.restaurant_id,
        order: data.order,
        instruction: data.instruction,
        address: data.address,
        status: data.status,
        total: data.total,
        grand_total: data.grand_total,
        delivery_charge: data.delivery_charge,
        payment_status: data.payment_status,
        payment_mode: data.payment_mode,
      });

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    const { aud } = req.user;
    try {
      const existingUser = await UserModel.findById(aud);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const orders = await OrderModel.find({
        user_id: existingUser._id,
      }).populate("restaurant_id");

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
