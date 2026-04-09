const express = require("express");
const codeController = require("../controllers/code.controller");

const router = express.Router();

router.post("/save", codeController.saveCode);
router.get("/versions", codeController.getVersions);
router.get("/user/:userId", codeController.getUserCodes);

module.exports = router;

