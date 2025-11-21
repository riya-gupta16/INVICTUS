const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

// Import routes
const userRoutes = require("./routes/userRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const WasteSubmission = require("./models/WasteSubmission"); // ✅ Import model for dashboard

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/waste_optimization", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/users", userRoutes);
app.use("/waste", wasteRoutes);
app.use("/payments", paymentRoutes);

// Landing page
app.get("/", (req, res) => {
  res.render("index");
});

// Submit page
app.get("/submit", (req, res) => {
  res.render("submit");
});

// ✅ Dashboard page
app.get("/dashboard", async (req, res) => {
  try {
    const submissions = await WasteSubmission.find().sort({ createdAt: -1 });
    res.render("dashboard", { submissions });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.status(500).send("Failed to load dashboard");
  }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
