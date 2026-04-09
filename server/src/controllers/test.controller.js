const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../../models/User");

const testUser = asyncHandler(async (req, res) => {
  const savedUser = await new User({
    username: "testuser",
    password: "hashedpassword123",
  }).save();

  res.json({ message: "✅ User saved successfully!", savedUser });
});

module.exports = {
  testUser,
};

