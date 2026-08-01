const asyncHandler = require("../middlewares/asyncHandler");
const evidenceService = require("../services/evidence.service");

const overview = asyncHandler(async (req, res) => {
  res.json(await evidenceService.getSnapshot(req.params.projectId));
});

const recordEvent = asyncHandler(async (req, res) => {
  const event = await evidenceService.recordEvent(req.params.projectId, req.body, req.user);
  res.status(201).json({ event });
});

const createPackage = asyncHandler(async (req, res) => {
  const evidencePackage = await evidenceService.createPackage(req.params.projectId, req.body, req.user);
  res.status(201).json({ package: evidencePackage });
});

const runReview = asyncHandler(async (req, res) => {
  const review = await evidenceService.runReview(req.params.projectId, req.body);
  res.status(201).json({ review });
});

const createChallenge = asyncHandler(async (req, res) => {
  const challenge = evidenceService.createChallenge(req.params.projectId, req.body);
  res.json({ challenge });
});

const verifyUnderstanding = asyncHandler(async (req, res) => {
  const verification = await evidenceService.verifyUnderstanding(req.params.projectId, req.body);
  res.status(201).json({ verification });
});

const createDigitalTwin = asyncHandler(async (req, res) => {
  const twin = evidenceService.createDigitalTwin(req.body);
  res.json({ twin });
});

module.exports = {
  overview,
  recordEvent,
  createPackage,
  runReview,
  createChallenge,
  verifyUnderstanding,
  createDigitalTwin,
};

