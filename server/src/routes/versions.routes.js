const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const versionController = require("../controllers/version.controller");

const router = express.Router();

router.use(authMiddleware);

router.post("/save", versionController.save);
router.get("/:userId/:fileName", versionController.list);

module.exports = router;

