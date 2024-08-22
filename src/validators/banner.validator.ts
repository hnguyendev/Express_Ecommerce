import { body } from "express-validator";

export class BannerValidators {
  static uploadBanner() {
    return [
      body("bannerImages", "Banner is required").custom((banner, { req }) => {
        if (!req.file) {
          throw new Error("File not found");
        }
        return true;
      }),
    ];
  }
}
