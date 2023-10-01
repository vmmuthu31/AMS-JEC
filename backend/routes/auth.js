const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Attendance = require("../models/Attendance");
const Faculty = require("../models/Faculty");
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "yourSecretKeyHere"; // Consider removing the default key in production

// Middlewares

function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send({ error: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).send({ error: "Failed to authenticate token" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

// API Endpoints
router.post("/attendance", authenticate, async (req, res) => {
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

router.post("/login", async (req, res) => {
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
      { expiresIn: "7d" }
    );
    res.send({
      token,
      role: faculty.role,
      email: faculty.email,
      department: faculty.department,
    });
  } catch (error) {
    res.status(500).send({ error: "Login failed" });
  }
});

function isAuthorizedToRegisterAsHead(email, department, secretCode) {
  const HOD_SECRET_CODE = "fosslab"; // You can change this to any code you prefer.
  return secretCode === HOD_SECRET_CODE;
}

router.post("/register", async (req, res) => {
  try {
    const { email, department, password, role } = req.body;

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

router.get("/attendance", authenticate, async (req, res) => {
  try {
    const date = req.query.date;
    const attendanceRecords = await Attendance.find({ date: new Date(date) });
    res.status(200).send(attendanceRecords);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch attendance records" });
  }
});

module.exports = router;
