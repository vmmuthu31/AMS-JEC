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

router.put(
  "/update-total-students/:department",
  authenticateSuperAdmin,
  async (req, res) => {
    try {
      const { department } = req.params;
      const { year1, year2, year3, year4 } = req.body;
      const totalStudents = await TotalStudents.findOne({ department });
      if (!totalStudents) {
        return res
          .status(404)
          .send({ message: "Total students data not found" });
      }

      // Update the years' data.
      totalStudents.year1 = year1;
      totalStudents.year2 = year2;
      totalStudents.year3 = year3;
      totalStudents.year4 = year4;

      await totalStudents.save();

      res
        .status(200)
        .send({ message: "Total students data updated successfully" });
    } catch (error) {
      res.status(500).send({ error: "Failed to update total students data" });
    }
  }
);

router.put("/attendance/:id", authenticate, async (req, res) => {
  try {
    const attendanceId = req.params.id; // Get attendance record ID from the URL
    const updates = req.body; // Extract updated data from the request body

    const attendanceRecord = await Attendance.findById(attendanceId);
    if (!attendanceRecord) {
      return res.status(404).send({ error: "Attendance record not found" });
    }

    // Check if the logged-in user has the right to update this record
    // For example, if only the faculty who created the record or an admin can update it
    if (req.userId !== attendanceRecord.facultyId && req.userRole !== "admin") {
      return res
        .status(403)
        .send({ error: "You don't have permission to update this record" });
    }

    // Update the record
    Object.keys(updates).forEach(
      (key) => (attendanceRecord[key] = updates[key])
    );
    await attendanceRecord.save();

    res.status(200).send({
      message: "Attendance updated successfully",
      data: attendanceRecord,
    });
  } catch (error) {
    console.error("Error updating attendance record:", error);
    res.status(500).send({ error: "Failed to update attendance" });
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
    const dateStr = req.query.date;
    const startOfDay = new Date(new Date(dateStr).setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(dateStr).setUTCHours(23, 59, 59, 999));

    let query = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    if (req.userRole === "faculty" || req.userRole === "hod") {
      const faculty = await Faculty.findById(req.userId);
      query.department = faculty.department;
    }

    const attendanceRecords = await Attendance.find(query);
    res.status(200).send(attendanceRecords);

    console.log("Querying with:", query); // Log the query
  } catch (error) {
    console.error("Error fetching attendance records:", error); // Log the error
    res.status(500).send({ error: "Failed to fetch attendance records" });
  }
});

module.exports = router;
