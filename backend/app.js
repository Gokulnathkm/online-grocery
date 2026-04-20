require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const connectDB = require("./config/db");



const app = express();

/* ===============================
   DATABASE
================================= */
connectDB();

/* ===============================
   CORS (Frontend React App)
================================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


/* ===============================
   MIDDLEWARE
================================= */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===============================
   REQUEST LOGGER
================================= */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/* ===============================
   TEST ROUTE
================================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ===============================
   MAIN ROUTES
================================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


/* ===============================
   HEALTH CHECK
================================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState,
  });
});

/* ===============================
   404 HANDLER
================================= */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ===============================
   ERROR HANDLER
================================= */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Server Error",
  });
});

module.exports = app;

