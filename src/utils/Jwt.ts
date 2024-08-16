require("dotenv").config();
import jwt from "jsonwebtoken";

export class Jwt {
  static jwtSign(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
      issuer: "test.com",
    });
  }

  static jwtVerify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        else if (!decoded) reject(new Error("Unauthorized"));
        else resolve(decoded);
      });
    });
  }
}
