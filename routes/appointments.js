const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
} = require("../controllers/appointmentController");

router.get("/", getAppointments);
router.post("/", createAppointment);

module.exports = router;
