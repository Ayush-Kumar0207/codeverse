const express = require("express");
const router = express.Router();
const User = require("../models/User"); // 👈 Import your schema

// Test route to create and save a dummy user
router.get("/test-user", async (req, res) => {
  try {
    const testUser = new User({
      username: "testuser",
      password: "hashedpassword123",
    });

    const savedUser = await testUser.save();
    res.json({ message: "✅ User saved successfully!", savedUser });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
