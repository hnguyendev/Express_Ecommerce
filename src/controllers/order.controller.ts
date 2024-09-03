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
    const { page = 1 } = req.query;
    const limit = 10;
    try {
      const existingUser = await UserModel.findById(aud);
      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const total = await OrderModel.countDocuments({
        user_id: existingUser._id,
      });
      if (!total) {
        return res.status(200).json({
          success: true,
          orders: [],
        });
      }

      const pageCount = Math.ceil(total / limit);

      if (
        parseInt(page as string) > pageCount ||
        parseInt(page as string) < 1
      ) {
        return next(new ErrorHandler("Invalid page number", 400));
      }

      const options = {
        skip: (parseInt(page as string, 10) - 1) * limit,
        limit,
      };

      const orders = await OrderModel.find(
        { user_id: existingUser._id },
        { user_id: 0, __v: 0 },
        options
      ).sort("-createdAt");

      res.status(200).json({
        success: true,
        orders,
        pagination: {
          page,
          pageSize: limit,
          total,
          pageCount,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
