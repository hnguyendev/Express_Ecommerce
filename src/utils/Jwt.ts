require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { Redis } from "./Redis";

interface IPayload {
  aud: string | unknown;
  email: string;
  type: string;
}

interface CustomJwtPayload extends JwtPayload {
  aud: string;
}

export class Jwt {
  static signAccessToken(payload: IPayload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "15m",
      issuer: "test.com",
    });
  }

  static async signRefreshToken(payload: IPayload) {
    const expire = 3 * 24 * 3600;
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: expire,
      issuer: "test.com",
    });

    await Redis.setValue(payload.aud.toString(), refreshToken, expire);

    return refreshToken;
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
      jwt.verify(
        token,
        process.env.REFRESH_TOKEN,
        (err, decoded: CustomJwtPayload) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error("Refresh token expired"));
          else {
            Redis.getValue(decoded.aud)
              .then((value) => {
                if (value !== token) reject(new Error("Please login again"));

                resolve(decoded);
              })
              .catch((err) => reject(err));
          }
        }
      );
    });
  }
}
