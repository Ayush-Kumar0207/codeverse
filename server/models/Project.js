const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    language: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // ✅ Make optional
    isDemo: { type: Boolean, default: false }, // ✅ Added field
    code: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
