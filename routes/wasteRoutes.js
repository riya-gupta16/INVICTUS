const express = require("express");
const router = express.Router();
const WasteSubmission = require("../models/WasteSubmission");

router.post("/submit", async (req, res) => {
  console.log("Received body:", req.body);

  const body = req.body || {};
  const { category, product, subOption, weightRange } = body;

  if (!category || !product || !weightRange) {
    return res.status(400).send("Missing required fields");
  }

  const priceTable = {
    wires: {
      fairy_lights_clean: 20,
      fairy_lights_tangled: 15,
      cables_clean: 25,
      cables_tangled: 18,
    },
    plastic: {
      drink_bottles_barely_used: 20,
      drink_bottles_slightly_damaged: 15,
      drink_bottles_heavily_damaged: 10,
      jars_barely_used: 25,
      jars_slightly_damaged: 18,
      jars_heavily_damaged: 10,
      mixed_barely_used: 30,
      mixed_slightly_damaged: 20,
      mixed_heavily_damaged: 12,
    },
    paper: {
      newspapers: 10,
      cardboard: 12,
      notebooks: 15,
      books: 5, // ✅ Add if you're using "books" in form
    },
  };

  const key = subOption || product;
  const pricePerKg = priceTable[category]?.[key];

  if (typeof pricePerKg !== "number") {
    return res.status(400).send("Invalid category or sub-option. Please try again.");
  }

  let avgWeight = 5;
  if (weightRange.includes("-")) {
    const [min, max] = weightRange.split("-").map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      avgWeight = (min + max) / 2;
    } else {
      return res.status(400).send("Invalid weight range format.");
    }
  } else if (weightRange === "other") {
    avgWeight = 5; // default or prompt user for custom input
  }

  const worth = Math.round(pricePerKg * avgWeight);

  try {
    await WasteSubmission.create({
      userId: null,
      category,
      subOption: key,
      weightOrCount: avgWeight,
      worth,
      status: "Pending", // ✅ Optional: default status
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error saving submission:", err.message, err);
    res.status(500).send("Submission failed");
  }
});

module.exports = router;
