const mongoose = require("mongoose");
const { Schema } = mongoose;
const AttendanceSchema = new mongoose.Schema({
  date: Date,
  year: String,
  department: String,
  class: String,
  total: Number,
  present: Number,
  regular: Number,
  absent: Number,
  absentees: String,
  facultyId: String,
});
const Attendance = mongoose.model("Attendance", AttendanceSchema);
module.exports = Attendance;
