const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'NURSE'], default: 'NURSE' },
  phone: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
