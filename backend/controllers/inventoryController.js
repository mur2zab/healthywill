const InventoryItem = require("../models/Inventory");
const { parseExcelFile } = require("../utils/excelParser");

const addInventoryItem = async (req, res) => {
	try {
		const {
			name,
			description,
			size,
			unit,
			quantity,
			threshold,
			price,
			batchNumber,
			expiryDate,
			location_id,
			parent_item_id
		} = req.body;

		if (!name || quantity == null || price == null) {
			return res.status(400).json({ message: "Name, quantity, and price are required" });
		}

		const newItem = new InventoryItem({
			name,
			description,
			size,
			unit,
			quantity,
			threshold,
			price,
			batchNumber,
			expiryDate,
			location_id,
			parent_item_id,
			lastAddedAt: new Date(),
		});

		await newItem.save();
		res.status(201).json({ message: "Inventory item added successfully", item: newItem });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

const uploadInventoryFromExcel = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const inventoryItems = parseExcelFile(req.file.buffer);

		await InventoryItem.insertMany(inventoryItems);
		res.status(201).json({ message: "Bulk inventory uploaded successfully", count: inventoryItems.length });
	} catch (error) {
		res.status(500).json({ message: "Error processing file", error: error.message });
	}
};

const updateInventoryItem = async (req, res) => {
	try {
		const itemId = req.params.id;
		const updates = req.body;

		const item = await InventoryItem.findByIdAndUpdate(itemId, updates, { new: true });

		if (!item) {
			return res.status(404).json({ message: "Inventory item not found" });
		}

		res.json({ message: "Inventory item updated successfully", item });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

const deleteInventoryItem = async (req, res) => {
	try {
		const itemId = req.params.id;

		const item = await InventoryItem.findByIdAndDelete(itemId);

		if (!item) {
			return res.status(404).json({ message: "Inventory item not found" });
		}

		res.json({ message: "Inventory item deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

const getCriticalInventory = async (req, res) => {
	try {
		const items = await InventoryItem.find({
			$expr: { $lte: ["$quantity", "$threshold"] }
		});

		res.json(items);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getExpiringSoonInventory = async (req, res) => {
	try {
		const beforeDate = new Date(req.query.before);

		const items = await InventoryItem.find({
			expiryDate: { $lte: beforeDate }
		});

		res.json(items);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

const getInventoryItemById = async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await InventoryItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getInventoryDashboard = async (req, res) => {
  try {
    const {
      search,
      sortBy = "name",
      order = "asc",
      critical,
      expiringBefore,
      page = 1,
      limit = 10,
    } = req.query;

		console.log("--------------------here---------------")
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (critical === "true") {
      query.$expr = { $lte: ["$quantity", "$threshold"] };
    }

    if (expiringBefore) {
      query.expiryDate = { $lte: new Date(expiringBefore) };
    }

    const sortOptions = {};
    if (["name", "expiryDate", "lastUsedAt", "quantity"].includes(sortBy)) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
		console.log("--------query----------", query)

    const totalCount = await InventoryItem.countDocuments(query);

		console.log("--------totalcount----------", totalCount)
    const items = await InventoryItem.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      items,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addInventoryItem,
  uploadInventoryFromExcel,
  updateInventoryItem,
  deleteInventoryItem,
  getCriticalInventory,
  getExpiringSoonInventory,
	getInventoryItemById,
	getInventoryDashboard
};
