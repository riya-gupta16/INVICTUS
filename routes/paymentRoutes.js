const express = require("express");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const WasteSubmission = require("../models/WasteSubmission");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY_ID",
  key_secret: "YOUR_RAZORPAY_SECRET"
});

router.post("/create-order", async (req, res) => {
  const { submissionId } = req.body;
  const submission = await WasteSubmission.findById(submissionId);

  const order = await razorpay.orders.create({
    amount: submission.worth * 100,
    currency: "INR",
    receipt: `receipt_${submissionId}`
  });

  const payment = new Payment({ submissionId, orderId: order.id, amount: submission.worth });
  await payment.save();

  res.json(order);
});

router.post("/success", async (req, res) => {
  const { orderId, paymentId } = req.body;
  const payment = await Payment.findOne({ orderId });
  payment.paymentId = paymentId;
  payment.status = "success";
  await payment.save();

  await WasteSubmission.findByIdAndUpdate(payment.submissionId, { status: "paid" });
  res.json({ message: "Payment successful" });
});

module.exports = router;
