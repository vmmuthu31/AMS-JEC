const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const YearSchema = new mongoose.Schema({
  classes: [ClassSchema], // Allow multiple classes within a year
});

const totalStudentsSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  year1: YearSchema,
  year2: YearSchema,
  year3: YearSchema,
  year4: YearSchema,
});

module.exports = mongoose.model("TotalStudents", totalStudentsSchema);
