const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  email: { type: String, unique: true },
  department: String,
  password: String, // hashed password
  role: {
    type: String,
    enum: ["faculty", "hod", "superadmin"],
    required: true,
  },
});

const Faculty = mongoose.model("Faculty", FacultySchema);

module.exports = Faculty;
