const express = require("express");
const versionController = require("../controllers/version.controller");

const router = express.Router();

router.post("/save", versionController.save);
router.get("/:userId/:fileName", versionController.list);

module.exports = router;

