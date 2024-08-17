import { body } from "express-validator";

export class BannerValidator {
  static uploadBanner() {
    return [
      body("banner", "Banner is required").custom((banner, { req }) => {
        if (!req.file) {
          throw new Error("File not found");
        }
        return true;
      }),
    ];
  }
}
