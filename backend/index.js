const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:admin@cluster0.rxnpu.mongodb.net/ams";

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.options("*", corsOptionsDelegate);

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Setup CORS
function corsOptionsDelegate(req, callback) {
  let corsOptions;
  corsOptions = {
    origin: "*", // replace '*' with your frontend domain in production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  callback(null, corsOptions);
}

// Connect to MongoDB
function connectToMongoDB() {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
}
connectToMongoDB();

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
