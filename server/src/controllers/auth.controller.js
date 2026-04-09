const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/auth.service");
const HttpError = require("../utils/httpError");

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json(result);
});

const profile = asyncHandler(async (req, res) => {
  const result = await authService.getProfile(req.user.username);
  res.json(result);
});

const githubCallback = asyncHandler(async (req, res) => {
  const githubUser = req.user;
  if (!githubUser) {
    throw new HttpError(401, "GitHub authentication failed");
  }

  const { token } = await authService.processGithubUser(githubUser);
  res.redirect(`${process.env.NEXT_PUBLIC_API_BASE_URL}/github-success?token=${token}`);
});

module.exports = {
  register,
  login,
  profile,
  githubCallback,
};

