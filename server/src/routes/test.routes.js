const express = require("express");
const testController = require("../controllers/test.controller");

const router = express.Router();

router.get("/test-user", testController.testUser);

module.exports = router;

