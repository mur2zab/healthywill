const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
  addInventoryItem,
	uploadInventoryFromExcel,
	deleteInventoryItem,
	updateInventoryItem,
	getCriticalInventory,
	getExpiringSoonInventory,
	getInventoryItemById,
	getInventoryDashboard
} = require("../controllers/inventoryController");
const { verifyToken } = require("../middlewares/authmiddleware");
const { checkRole } = require("../middlewares/rolemiddleware");
const upload = multer(); // for memory storage


router.post("/", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN"]), addInventoryItem);
router.post("/bulk", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN"]), upload.single("file"), uploadInventoryFromExcel);

router.put("/:id", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN"]), updateInventoryItem);

router.delete("/:id", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN"]), deleteInventoryItem);

router.get("/dashboard", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN"]), getInventoryDashboard);
router.get("/critical", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN"]), getCriticalInventory);
router.get("/expiring-soon", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN"]), getExpiringSoonInventory);
router.get("/:id", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN", "NURSE"]), getInventoryItemById);


module.exports = router;
