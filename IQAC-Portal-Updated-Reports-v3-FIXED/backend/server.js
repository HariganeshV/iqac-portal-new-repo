const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const submissionRoutes = require("./routes/submissions");
const hodRoutes = require("./routes/hod");
const deanRoutes = require("./routes/dean");
const adminRoutes = require("./routes/admin");
const analyticsRoutes = require("./routes/analytics");
const reportsRoutes = require("./routes/reports");
const excelRoutes = require("./routes/excel");

dotenv.config();

// Database Connection
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// ==========================
// UPLOADS STATIC FOLDER
// ==========================

app.use(
  "/uploads",
  express.static("uploads")
);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SRIHER IQAC Portal API Running"
  });
});

// API Routes

app.use("/api/auth", authRoutes);

app.use("/api/submissions", submissionRoutes);

app.use("/api/hod", hodRoutes);

app.use("/api/dean", deanRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/reports", reportsRoutes);

app.use("/api/excel", excelRoutes);

// 404 Handler

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// Server Start

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});