const express = require("express");
const router = express.Router();
const File = require("../models/File");
const Version = require("../models/Version"); // ✅ Mongoose model

// POST /api/code/save — Save a code snapshot (versioned)
router.post("/save", async (req, res) => {
  const { code, userId, fileName } = req.body;

  if (!code || !userId || !fileName) {
    return res.status(400).json({ error: "Missing code, fileName or userId" });
  }

  try {
    const newVersion = new Version({ userId, fileName, code });
    await newVersion.save();
    res.status(201).json({ message: "Code version saved successfully" });
  } catch (err) {
    console.error("Error saving version:", err);
    res.status(500).json({ error: "Failed to save code version" });
  }
});

// GET /api/code/versions?userId=xxx&fileName=yyy — Get latest versions
router.get("/versions", async (req, res) => {
  const { userId, fileName } = req.query;

  if (!userId || !fileName) {
    return res.status(400).json({ error: "Missing userId or fileName" });
  }

  try {
    const versions = await Version.find({ userId, fileName })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ versions });
  } catch (err) {
    console.error("Error fetching versions:", err);
    res.status(500).json({ error: "Failed to fetch code versions" });
  }
});

// GET /api/code/user/:userId — Fetch all saved versions for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const codes = await Version.find({ userId }).sort({ createdAt: -1 });
    res.json({ codes });
  } catch (err) {
    console.error("Error fetching saved codes:", err);
    res.status(500).json({ error: "Failed to fetch saved code snippets." });
  }
});

// ✅ ✅ ✅ ADD THIS LINE AT THE END ✅ ✅ ✅
module.exports = router;
