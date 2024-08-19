require("dotenv").config();
import multer from "multer";

const storageOptions = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/" + file.fieldname);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    return cb(new Error("Wrong mimetype"), false);
  }
};

export class Utils {
  public TOKEN_EXPIRED = 5 * 60 * 1000;
  public multerStorage = multer({
    storage: storageOptions,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1025 },
  });

  static generateVerificationToken() {
    const digits = Math.floor(100_000 + Math.random() * 900_000);
    return digits;
  }
}
