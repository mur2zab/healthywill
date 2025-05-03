const mongoose = require("mongoose");

const jobAssignmentSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobRequest", required: true },
  nurse: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  timeSlot: String,

	status: {
    type: String,
    enum: ["assigned", "accepted", "started", "in_progress", "completed"],
    default: "assigned",
  },

	inventoryRequestIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "InventoryRequest" }],
}, { timestamps: true });

module.exports = mongoose.model("JobAssignment", jobAssignmentSchema);
