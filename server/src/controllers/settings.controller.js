const asyncHandler = require("../middlewares/asyncHandler");
const settingsService = require("../services/settings.service");
const HttpError = require("../utils/httpError");

/**
 * Syncs the current settings config to the cloud as a new snapshot.
 */
const sync = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const { config } = req.body;

  if (!config) {
    throw new HttpError(400, "Configuration data required for sync.");
  }

  try {
    const result = await settingsService.insertSnapshot(userId, config);
    res.status(201).json({
      success: true,
      data: result,
      message: "Cloud Hub synchronization successful."
    });
  } catch (error) {
    throw new HttpError(error.statusCode || 500, error.message || "Cloud synchronization failed.");
  }
});

/**
 * Fetches the latest snapshot for retroactive sync initialization.
 */
const fetchLatest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const data = await settingsService.getLatestSnapshot(userId);
  res.json({ snapshot: data });
});

/**
 * Fetches the full temporal history for the user.
 */
const fetchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const history = await settingsService.getHistory(userId);
  res.json({ history });
});

module.exports = {
  sync,
  fetchLatest,
  fetchHistory,
};
