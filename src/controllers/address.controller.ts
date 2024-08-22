import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import AddressModel from "../models/address.model";
import UserModel from "../models/user.model";

export class AddressController {
  static async createAddress(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const { aud } = req.user;
    try {
      const existingUser = await UserModel.findById(aud);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const address = await AddressModel.create({
        user_id: existingUser._id,
        title: data.title,
        address: data.address,
        landmark: data.landmark,
        house: data.house,
        lat: data.lat,
        lng: data.lng,
      });

      res.status(201).json({
        success: true,
        address,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getAddress(req: Request, res: Response, next: NextFunction) {
    const { aud } = req.user;
    const { id } = req.params;
    try {
      const existingUser = await UserModel.findById(aud);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const address = await AddressModel.findOne(
        {
          user_id: existingUser._id,
          _id: id,
        },
        { user_id: 0, __v: 0 }
      );

      res.status(200).json({
        success: true,
        address,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async getAddresses(req: Request, res: Response, next: NextFunction) {
    const { aud } = req.user;
    try {
      const existingUser = await UserModel.findById(aud);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const addresses = await AddressModel.find(
        {
          user_id: existingUser._id,
        },
        { user_id: 0, __v: 0 }
      );

      res.status(201).json({
        success: true,
        addresses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    const { aud } = req.user;
    const { id } = req.params;
    try {
      const existingUser = await UserModel.findById(aud);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      await AddressModel.findOneAndDelete({
        user_id: existingUser._id,
        _id: id,
      });

      res.status(204).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    const { aud } = req.user;
    const { id } = req.params;
    const data = req.body;
    try {
      const existingUser = await UserModel.findById(aud);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const address = await AddressModel.findOneAndUpdate(
        {
          user_id: existingUser._id,
          _id: id,
        },
        {
          title: data.title,
          address: data.address,
          landmark: data.landmark,
          house: data.house,
          lat: data.lat,
          lng: data.lng,
        },
        { new: true, projection: { user_id: 0, __v: 0 } }
      );

      if (!address) {
        return next(new ErrorHandler("Address not found", 404));
      }

      res.status(200).json({
        success: true,
        address,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  static async checkAddress(req: Request, res: Response, next: NextFunction) {
    const { aud } = req.user;
    const data = req.query;
    try {
      const existingUser = await UserModel.findById(aud);

      if (!existingUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      const address = await AddressModel.findOne({
        user_id: existingUser._id,
        lat: data.lat,
        lng: data.lng,
      });

      res.status(200).json({
        success: true,
        address,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
}
