const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/", appointmentController.getAllAppointments);

router.post("/appointments", appointmentController.createAppointment);

router.patch("/appointments/:id/status", appointmentController.updateStatus);

router.delete("/appointments/:id", appointmentController.cancelAppointment);

router.get(
  "/providers/:id/availableSlots",
  appointmentController.getAvailableSlots,
);

router.get("/book", appointmentController.renderBookingForm);

module.exports = router;
