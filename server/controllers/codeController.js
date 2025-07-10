const Project = require("../models/Project");

const getUserCodes = async (req, res) => {
  try {
    const userId = req.params.id;
    const codes = await Project.find({ user: userId }); // assuming `Project` stores code and has a `user` field
    res.json(codes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserCodes };
