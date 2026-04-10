const bcrypt = require("bcrypt");
const { supabase } = require("../config/db");
const { generateToken } = require("../utils/jwt");
const HttpError = require("../utils/httpError");

async function registerUser({ username, password, email }) {
  const { data: existingUser } = await supabase
    .from("users")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUser) {
    throw new HttpError(400, "Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { error } = await supabase
    .from("users")
    .insert([{ username, password: hashedPassword, email }]);

  if (error) throw error;

  return { message: "User registered successfully" };
}

async function loginUser({ username, password }) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = generateToken({ username: user.username, _id: user.id });

  return {
    token,
    user: {
      _id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

async function getProfile(username) {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, email, github_id, created_at")
    .eq("username", username)
    .single();

  if (error || !user) {
    throw new HttpError(404, "User not found");
  }

  return { user };
}

async function processGithubUser(githubUser) {
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("github_id", githubUser.githubId)
    .single();

  let user = existingUser;

  if (!user) {
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{
        username: githubUser.username,
        email: githubUser.email || `${githubUser.githubId}@github.com`,
        github_id: githubUser.githubId,
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    user = newUser;
  }

  const token = generateToken({ username: user.username, _id: user.id });

  return { token, user };
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  processGithubUser,
};

