const mongoose = require("mongoose");
const { Schema } = mongoose;

const FacultySchema = new mongoose.Schema({
  email: { type: String, unique: true },
  department: String,
  password: String, // hashed password
  role: String, // "faculty" or "head"
});

const Faculty = mongoose.model("Faculty", FacultySchema);

module.exports = Faculty;
