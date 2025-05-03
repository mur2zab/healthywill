const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema({
  patientName: String,
  address: String,
  status: {
    type: String,
    enum: ["created", "quoted", "approved", "in_progress", "completed"],
    default: "created",
	},
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobAssignment" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("JobRequest", jobRequestSchema);
