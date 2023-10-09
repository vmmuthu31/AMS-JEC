const mongoose = require("mongoose");
const { Schema } = mongoose;

const YearlyAttendanceSchema = new Schema({
  total: Number,
  present: Number,
  absent: Number,
  absentees: String,
});

const AttendanceSchema = new mongoose.Schema({
  date: Date,
  year1: YearlyAttendanceSchema,
  year2: YearlyAttendanceSchema,
  year3: YearlyAttendanceSchema,
  year4: YearlyAttendanceSchema,
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  class: String,
  department: String,
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;
