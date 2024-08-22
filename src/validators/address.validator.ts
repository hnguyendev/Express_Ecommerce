import { body, param, query } from "express-validator";
import { isValidObjectId } from "mongoose";

export class AddressValidators {
  static createAddress() {
    return [
      body("title", "Title is required").isString(),
      body("address", "Address is required").isString(),
      body("landmark", "Landmark is required").isString(),
      body("house", "House is required").isString(),
      body("lat", "Latitude is required").isNumeric(),
      body("lng", "Longitude is required").isNumeric(),
    ];
  }

  static deleteAddress() {
    return [
      param("id", "Address is required")
        .isString()
        .custom((id) => {
          if (!isValidObjectId(id)) throw new Error("Invalid id");
          return true;
        }),
    ];
  }

  static getAddress() {
    return [
      param("id", "Address is required")
        .isString()
        .custom((id) => {
          if (!isValidObjectId(id)) throw new Error("Invalid id");
          return true;
        }),
    ];
  }

  static updateAddress() {
    return [
      param("id", "Address is required")
        .isString()
        .custom((id) => {
          if (!isValidObjectId(id)) throw new Error("Invalid id");
          return true;
        }),
      body("title", "Title is required").isString(),
      body("address", "Address is required").isString(),
      body("landmark", "Landmark is required").isString(),
      body("house", "House is required").isString(),
      body("lat", "Latitude is required").isNumeric(),
      body("lng", "Longitude is required").isNumeric(),
    ];
  }

  static checkAddress() {
    return [
      query("lat", "Latitude is required").isNumeric(),
      query("lng", "Longitude is required").isNumeric(),
    ];
  }
}
