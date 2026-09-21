const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      trim: true,
      required: true,
    },
    date: {
      type: String,
      trim: true,
      required: true,
    },
    time: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    cancelationReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

appointmentSchema.index(
  { providerId: 1, date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "CANCELLED" } },
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
