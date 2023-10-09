const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Attendance = require("../models/Attendance");
const Faculty = require("../models/Faculty");
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "yourSecretKeyHere"; // Consider removing the default key in production

const TotalStudents = require("../models/TotalStudents");
// Middlewares

function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send({ error: "No token provided" });

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err)
      return res.status(401).send({ error: "Failed to authenticate token" });
    req.userId = decoded.id;
    req.userRole = decoded.role;

    if (decoded.role === "faculty" || decoded.role === "hod") {
      const faculty = await Faculty.findById(decoded.id);
      req.userDepartment = faculty.department;
    }

    next();
  });
}

router.post("/add-total-students", authenticateSuperAdmin, async (req, res) => {
  try {
    const { department, year1, year2, year3, year4 } = req.body;
    const totalStudents = new TotalStudents({
      department,
      year1,
      year2,
      year3,
      year4,
    });
    await totalStudents.save();
    res.status(201).send({
      message:
        "Total students for each year added successfully for the department",
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to add total students" });
  }
});

// Route to view total students for each year based on department
router.get("/view-total-students", async (req, res) => {
  try {
    const department = req.query.department;
    const totalStudents = await TotalStudents.findOne({ department });
    if (!totalStudents) {
      return res
        .status(404)
        .send({ message: "No data found for the specified department" });
    }
    res.status(200).send(totalStudents);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch total students" });
  }
});

// API Endpoints
router.post("/attendance", authenticate, async (req, res) => {
  try {
    const { year1, year2, year3, year4, class: classData } = req.body;

    const attendanceData = {
      year1: {
        total: year1.total,
        present: year1.present,
        absent: year1.absent,
        absentees: year1.absentees,
      },
      year2: {
        total: year2.total,
        present: year2.present,
        absent: year2.absent,
        absentees: year2.absentees,
      },
      year3: {
        total: year3.total,
        present: year3.present,
        absent: year3.absent,
        absentees: year3.absentees,
      },
      year4: {
        total: year4.total,
        present: year4.present,
        absent: year4.absent,
        absentees: year4.absentees,
      },
      facultyId: req.userId,
      department: req.userDepartment,
      class: classData,
    };

    const attendance = new Attendance(attendanceData);
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

function authenticateSuperAdmin(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send({ error: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).send({ error: "Failed to authenticate token" });
    if (decoded.role !== "superadmin")
      return res.status(403).send({ error: "Access denied" });
    next();
  });
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
    let query = { date: new Date(date) };

    if (req.userRole === "faculty" || req.userRole === "hod") {
      const faculty = await Faculty.findById(req.userId);
      query.department = faculty.department;
      const attendanceRecordsByDepartment = await Attendance.find({
        department: query.department,
      });
      res.status(200).send(attendanceRecordsByDepartment);
    } else {
      const allRecords = await Attendance.find({});
      res.status(200).send(allRecords);
    }

    console.log("Querying with:", query); // Log the query
  } catch (error) {
    console.error("Error fetching attendance records:", error); // Log the error
    res.status(500).send({ error: "Failed to fetch attendance records" });
  }
});

module.exports = router;
