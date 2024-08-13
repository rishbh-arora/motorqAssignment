import express from "express";
import * as BookingController from "../controllers/booking";

const router = express.Router();

router
  .route("/")
  .get(BookingController.searchBookings)
  .post(BookingController.createBooking);
router
  .route("/:id")
  .get(BookingController.getBookingById)
  //   .patch(BookingController.editDriver)
  .delete(BookingController.deleteBooking)
  .patch(BookingController.deleteBooking);
router.route("/status/:id").patch(BookingController.changeStatus);

export default router;
