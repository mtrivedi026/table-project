const express = require("express");
const router = express.Router();

const controller = require("../controllers/tableController");

// 👇 ये function होने चाहिए
router.get("/", controller.getTable);
router.get("/filters", controller.getFilters);

module.exports = router;