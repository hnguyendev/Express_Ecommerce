import express, { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { AddressValidators } from "../validators/address.validator";
import { AddressController } from "../controllers/address.controller";

class AddressRouter {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get("/", GlobalMiddleware.auth, AddressController.getAddresses);
    this.router.get(
      "/check",
      GlobalMiddleware.auth,
      AddressValidators.checkAddress(),
      GlobalMiddleware.checkError,
      AddressController.checkAddress
    );
    this.router.get(
      "/:id",
      GlobalMiddleware.auth,
      AddressValidators.getAddress(),
      GlobalMiddleware.checkError,
      AddressController.getAddress
    );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleware.auth,
      AddressValidators.createAddress(),
      GlobalMiddleware.checkError,
      AddressController.createAddress
    );
  }

  putRoutes() {
    this.router.put(
      "/:id",
      GlobalMiddleware.auth,
      AddressValidators.updateAddress(),
      GlobalMiddleware.checkError,
      AddressController.updateAddress
    );
  }

  patchRoutes() {}

  deleteRoutes() {
    this.router.delete(
      "/:id",
      GlobalMiddleware.auth,
      AddressValidators.deleteAddress(),
      GlobalMiddleware.checkError,
      AddressController.deleteAddress
    );
  }
}

export default new AddressRouter().router;
