import { body } from "express-validator";

export class CityValidators {
  static createCity() {
    return [
      body("name", "Name is required").isString(),
      body("lat", "Latitude is required").isNumeric(),
      body("lng", "Longitude is required").isNumeric(),
    ];
  }
}
