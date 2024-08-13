import express from "express";
import * as DriverController from "../controllers/driver";

const router = express.Router();

router
  .route("/")
  .get(DriverController.searchDrivers)
  .post(DriverController.createDriver);
router
  .route("/:id")
  .get(DriverController.getDriverById)
  .patch(DriverController.editDriver)
  .delete(DriverController.deleteDriver);

export default router;
