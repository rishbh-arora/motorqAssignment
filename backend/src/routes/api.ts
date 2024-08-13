import express from "express";
import driverRouter from "./driverRoute";
import vehicleRouter from "./vehicleRoutes";
import bookingRouter from "./bookingRouter";

const router = express.Router();

router.use("/driver", driverRouter);
router.use("/vehicle", vehicleRouter);
router.use("/booking", bookingRouter);

export default router;
