const mongoose = require("mongoose");

const wasteSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Optional: for user tracking
  category: { type: String, required: true },
  subOption: { type: String },
  weightOrCount: { type: Number, required: true },
  worth: { type: Number, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Approved", "Rejected"] }, // ✅ enum for clarity
  notes: { type: String }, // ✅ Optional: for admin comments or feedback
}, { timestamps: true }); // ✅ Adds createdAt and updatedAt automatically

module.exports = mongoose.model("WasteSubmission", wasteSubmissionSchema);
