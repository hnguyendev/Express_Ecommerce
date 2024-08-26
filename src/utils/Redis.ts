require("dotenv").config();
import { createClient } from "redis";

export class Redis {
  private static client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
  });

  static async connectRedis() {
    this.client.on("error", (err) => console.log("Redis Client Error", err));
    await this.client.connect().then(() => {
      console.log("Redis connected");
    });
  }

  static async setValue(key: string, value: string, expire?: number) {
    try {
      const options: Record<string, any> = { NX: false };

      if (expire) {
        options.EX = expire;
      }

      await this.client.set(key, value, options);
    } catch (error: any) {
      throw new Error(`Redis error: ${error.message}`);
    }
  }

  static async getValue(key: string) {
    try {
      return await this.client.get(key);
    } catch (error: any) {
      throw new Error(`User doesn't exist`);
    }
  }

  static async deleteKey(key: string) {
    await this.client.del(key);
  }
}
