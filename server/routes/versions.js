// server/routes/versions.js
const express = require('express');
const router = express.Router();
const Version = require('../models/Version');

// Save version
router.post('/save', async (req, res) => {
  const { userId, fileName, code } = req.body;
  if (!userId || !fileName || !code) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const version = new Version({ userId, fileName, code });
    await version.save();
    res.status(201).json({ message: 'Version saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save version.' });
  }
});

// Get all versions
router.get('/:userId/:fileName', async (req, res) => {
  const { userId, fileName } = req.params;

  try {
    const versions = await Version.find({ userId, fileName }).sort({ createdAt: -1 });
    res.status(200).json({ versions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch versions.' });
  }
});

module.exports = router; // ✅ THIS IS CRITICAL
