const mongoose = require("mongoose");
const { Schema } = mongoose;

const AttendanceSchema = new mongoose.Schema({
  date: Date,
  year: String,
  class: String,
  total: Number,
  present: Number,
  department: String,
  absent: Number,
  absentees: String,
  facultyId: String,
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;
