// server/models/File.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., index.html, main.py
  language: { type: String, required: true },
  content: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
