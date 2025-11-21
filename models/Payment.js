const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "WasteSubmission" },
  orderId: String,
  paymentId: String,
  amount: Number,
  currency: { type: String, default: "INR" },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
