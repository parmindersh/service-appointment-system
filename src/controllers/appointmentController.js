const Appointment = require("../models/appointment");
const Provider = require("../models/provider");

const ALLOWED_TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const ALL_DAY_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

exports.getAllAppointments = async (req, res) => {
  let appointments = await Appointment.find().populate("providerId");
  res.render("index.ejs", { appointments });
};

exports.createAppointment = async (req, res) => {
  try {
    const { providerId, customerName, customerPhone, serviceType, date, time } =
      req.body;
    console.log(req.body);
    console.log("before create");
    const appointment = await Appointment.create({
      providerId,
      customerName,
      customerPhone,
      serviceType,
      date,
      time,
    });
    console.log("after create");
    console.log("saved appointment", appointment);

    res.redirect("/");
  } catch (err) {
    const providers = await Provider.find({ isActive: true });
    if (err.code === 11000) {
      return res.status(409).render("book", {
        title: "Book Appointment",
        providers,
        errorMessage:
          "Conflict: This provider is already booked for that date and time slot.",
      });
    }
    res.status(400).render("book", {
      title: "Book Appointment",
      providers,
      errorMessage: err.message || "Failed to create booking.",
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, cancellationReason } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }
    const currentStatus = appointment.status;
    const validNextStatus = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!validNextStatus.includes(newStatus)) {
      return res
        .status(400)
        .send(`Invalid status transection: ${currentStatus} to ${newStatus}`);
    }
    appointment.status = newStatus;

    if (cancellationReason) {
      appointment.cancellationReason = cancellationReason.trim();
    }

    await appointment.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error updating appointment status: " + err.message);
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }
    if (
      appointment.status === "COMPLETED" ||
      appointment.status === "CANCELLED"
    ) {
      return res
        .status(400)
        .send(
          `cannot cancel an appointment that. is already ${appointment.status}`,
        );
    }
    appointment.status = "CANCELLED";
    appointment.cancellationReason =
      cancellationReason || "Cancelled by staff/customer";

    await appointment.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send(" appointment cancelation failed: " + err.message);
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).send("Date query parameter is required");
    }

    const bookedAppointments = await Appointment.find({
      providerId: id,
      date: date,
      status: { $ne: "CANCELLED" },
    });

    const bookedTimes = bookedAppointments.map((app) => app.time); // filter time from whole bunch of data
    const availableSlots = ALL_DAY_SLOTS.filter(
      // compare that data with req date time
      (slot) => !bookedTimes.includes(slot),
    );

    res.json({
      providerId: id,
      date,
      availableSlots,
    });
  } catch (err) {
    res.status(500).json({ message: "Error checking slots: " + err.message });
  }
};

exports.renderBookingForm = async (req, res) => {
  try {
    const providers = await Provider.find({ isActive: true });
    res.render("book.ejs", { providers });
  } catch (err) {
    res.status(500).send("Error rendering booking form" + err.message);
  }
};
