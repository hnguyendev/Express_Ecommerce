require("dotenv").config();
import multer from "multer";
import crypto from "crypto";

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
  private static algorithm = "aes-256-cbc";
  private static secretKey = crypto.randomBytes(32);
  private static iv = crypto.randomBytes(16);

  public multerStorage = multer({
    storage: storageOptions,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1025 },
  });

  static generateVerificationToken() {
    const digits = Math.floor(100_000 + Math.random() * 900_000);
    return digits;
  }

  static encryptCursor(id: string) {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      this.iv
    );
    let encrypted = cipher.update(id, "utf8", "hex");
    encrypted += cipher.final("hex");
    return this.iv.toString("hex") + ":" + encrypted;
  }

  static decryptCursor(encryptedId: string) {
    const [ivHex, encrypted] = encryptedId.split(":");
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(ivHex, "hex")
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
