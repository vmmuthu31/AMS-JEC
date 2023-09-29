const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const SECRET_KEY = "yourSecretKeyHere";
// Middlewares
app.use(bodyParser.json());
app.use(cors());
const corsOptions = {
  origin: "http://localhost:3000", // replace with your frontend domain
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, // Allow cookies to be sent with the request (if using sessions/cookies)
};
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // replace '*' with your frontend domain in production
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

app.use(cors(corsOptions));

function authenticate(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ error: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

function ensureHoD(req, res, next) {
  if (req.userRole !== "head") {
    return res
      .status(403)
      .send({ error: "Access forbidden: Only HoD can access this." });
  }
  next();
}

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin:admin@cluster0.rxnpu.mongodb.net/ams", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Define the Attendance model
const AttendanceSchema = new mongoose.Schema({
  date: Date,
  year: String,
  class: String,
  total: Number,
  present: Number,
  absent: Number,
  absentees: String,
  facultyId: String,
});
const FacultySchema = new mongoose.Schema({
  email: { type: String, unique: true },
  department: String,
  password: String, // hashed password
  role: String, // "faculty" or "head"
});
const Attendance = mongoose.model("Attendance", AttendanceSchema);
const Faculty = mongoose.model("Faculty", FacultySchema);

// API Endpoints
app.post("/attendance", authenticate, async (req, res) => {
  try {
    const attendanceData = req.body;

    // You can access the facultyId here
    const facultyIdFromToken = req.userId;

    const attendance = new Attendance({
      ...attendanceData,
      facultyId: facultyIdFromToken, // Assuming you want to save this to the DB
    });
    await attendance.save();
    res.status(201).send({ message: "Attendance added successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to add attendance" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const faculty = await Faculty.findOne({ email });

    if (!faculty) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, faculty.password);
    if (!validPassword) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: faculty._id, role: faculty.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.send({ token, role: faculty.role });
  } catch (error) {
    res.status(500).send({ error: "Login failed" });
  }
});

function isAuthorizedToRegisterAsHead(email, department, secretCode) {
  const HOD_SECRET_CODE = "fosslab"; // You can change this to any code you prefer.
  return secretCode === HOD_SECRET_CODE;
}

app.post("/register", async (req, res) => {
  try {
    const { email, department, password, role, secretCode } = req.body;

    // Ensure that only certain authorized users can register as 'head'
    if (
      role === "head" &&
      !isAuthorizedToRegisterAsHead(email, department, secretCode)
    ) {
      return res
        .status(403)
        .send({ error: "You are not authorized to register as HoD" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = new Faculty({
      email,
      department,
      password: hashedPassword,
      role,
    });
    await faculty.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ error: "Registration failed" });
  }
});

app.get("/attendance", authenticate, ensureHoD, async (req, res) => {
  try {
    const date = req.query.date;
    const attendanceRecords = await Attendance.find({ date: new Date(date) });
    res.status(200).send(attendanceRecords);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch attendance records" });
  }
});
app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
