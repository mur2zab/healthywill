const mongoose = require("mongoose");

const inventoryRequestSchema = new mongoose.Schema({
  jobAssignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "JobAssignment", required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem", required: true },
  requestedQty: { type: Number, required: true },
  approvedQty: Number,
  price: { type: Number, required: true }, // Unit price
  status: {
    type: String,
    enum: ["requested", "approved", "rejected", "pending_modification"],
    default: "requested",
  },
	date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("InventoryRequest", inventoryRequestSchema);
