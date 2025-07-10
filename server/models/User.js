// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  githubId: { type: String }, // optional if using OAuth
  email: { type: String },
  password: { type: String }, // for local auth, hashed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
