const express = require("express");
const router = express.Router();
const { createJob } = require("../controllers/jobController");
const { verifyToken } = require("../middlewares/authmiddleware");
const { checkRole } = require("../middlewares/rolemiddleware");

router.post("/", verifyToken, checkRole(["ADMIN", "SUPER_ADMIN"]), createJob);

module.exports = router;
