require("dotenv").config();
import jwt from "jsonwebtoken";

export class Jwt {
  static signAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "15m",
      issuer: "test.com",
    });
  }

  static signRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "3d",
      issuer: "test.com",
    });
  }

  static verifyAccessToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) reject(err);
        else if (!decoded) reject(new Error("Unauthorized"));
        else resolve(decoded);
      });
    });
  }

  static verifyRefreshToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN, (err, decoded) => {
        if (err) reject(err);
        else if (!decoded) reject(new Error("Refresh token expired"));
        else resolve(decoded);
      });
    });
  }
}
