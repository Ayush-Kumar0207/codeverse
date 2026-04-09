const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { generateToken } = require("../../utils/jwt");
const HttpError = require("../utils/httpError");

async function registerUser({ username, password, email }) {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new HttpError(400, "Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, email });
  await user.save();

  return { message: "User registered successfully" };
}

async function loginUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = generateToken({ username: user.username, _id: user._id });

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  };
}

async function getProfile(username) {
  const user = await User.findOne({ username }).select("-password");
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return { user };
}

async function processGithubUser(githubUser) {
  let user = await User.findOne({ githubId: githubUser.githubId });

  if (!user) {
    user = new User({
      username: githubUser.username,
      email: githubUser.email || `${githubUser.githubId}@github.com`,
      githubId: githubUser.githubId,
      avatar: githubUser.avatar,
    });
    await user.save();
  }

  const token = generateToken({ username: user.username, _id: user._id });

  return { token, user };
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  processGithubUser,
};

