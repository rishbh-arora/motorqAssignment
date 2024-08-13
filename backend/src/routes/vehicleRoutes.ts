import express from "express";
import * as VehicleController from "../controllers/vehicle";

const router = express.Router();

router
  .route("/")
  .get(VehicleController.searchVehicles)
  .post(VehicleController.createVehicle);
router
  .route("/:id")
  .get(VehicleController.getVehicleById)
  .delete(VehicleController.deleteVehicle);

export default router;
