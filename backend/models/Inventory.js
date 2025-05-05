const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  size: String,
  unit: String,
  quantity: { type: Number, required: true },
  threshold: { type: Number, default: 0 },
  price: { type: Number, required: true },
  batchNumber: String,
  expiryDate: Date,
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  parent_item_id: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem", default: null },
  lastAddedAt: Date,
	lastUsedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
