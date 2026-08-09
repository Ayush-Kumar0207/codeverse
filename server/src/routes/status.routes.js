const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { buildPublicStatus } = require("../services/status.service");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  res.set("Cache-Control", "public, max-age=10, stale-while-revalidate=30");
  const status = await buildPublicStatus(req.app.get("collaboration"));
  res.status(status.status === "partial-outage" ? 503 : 200).json(status);
}));

module.exports = router;
