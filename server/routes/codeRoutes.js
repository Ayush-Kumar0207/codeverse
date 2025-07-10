const express = require("express");
const router = express.Router();
const { saveCode } = require("../controllers/codeController");

router.post("/save", saveCode);
module.exports = router;
