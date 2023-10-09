const mongoose = require("mongoose");

const YearlyStudentSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const totalStudentsSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  year1: YearlyStudentSchema,
  year2: YearlyStudentSchema,
  year3: YearlyStudentSchema,
  year4: YearlyStudentSchema,
});

module.exports = mongoose.model("TotalStudents", totalStudentsSchema);
