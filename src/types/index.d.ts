import express from "express";
import { IUser } from "../models/user.model";

interface IRequestUser extends IUser {
  aud: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}
