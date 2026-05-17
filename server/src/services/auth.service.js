const bcrypt = require("bcrypt");
const { supabase } = require("../config/db");
const { generateToken } = require("../utils/jwt");
const HttpError = require("../utils/httpError");
const localAuthStore = require("./localAuthStore.service");

function isSupabaseUnavailable(error) {
  const message = `${error?.message || ""} ${error?.cause?.message || ""}`;
  return (
    !supabase ||
    /fetch failed|getaddrinfo|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|network/i.test(message)
  );
}

async function withAuthStore(primary, fallback) {
  if (!supabase) return fallback();

  try {
    return await primary();
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      console.warn("[auth] Supabase unavailable; using local development auth store.");
      return fallback();
    }

    throw error;
  }
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateRegistration({ username, password, email }) {
  if (!username || !password || !email) {
    throw new HttpError(400, "Username, email, and password are required");
  }

  if (password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
  }
}

function validateLogin({ username, password }) {
  if (!username || !password) {
    throw new HttpError(400, "Username and password are required");
  }
}

function toAuthUser(user) {
  return {
    _id: user.id,
    username: user.username,
    email: user.email,
  };
}

function mapInsertError(error) {
  if (error?.code === "23505" || /duplicate key|already exists/i.test(error?.message || "")) {
    return new HttpError(400, "Username already taken");
  }

  return error;
}

async function registerUser({ username, password, email }) {
  const payload = {
    username: cleanText(username),
    password: cleanText(password),
    email: cleanText(email),
  };
  validateRegistration(payload);

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return withAuthStore(
    async () => {
      const { data: existingUser, error: lookupError } = await supabase
        .from("users")
        .select("username")
        .eq("username", payload.username)
        .maybeSingle();

      if (lookupError) throw lookupError;
      if (existingUser) {
        throw new HttpError(400, "Username already taken");
      }

      const { error } = await supabase
        .from("users")
        .insert([{ username: payload.username, password: hashedPassword, email: payload.email }]);

      if (error) throw mapInsertError(error);

      return { message: "User registered successfully" };
    },
    async () => {
      const existingUser = await localAuthStore.findByUsername(payload.username);
      if (existingUser) {
        throw new HttpError(400, "Username already taken");
      }

      await localAuthStore.createUser({
        username: payload.username,
        password: hashedPassword,
        email: payload.email,
      });

      return { message: "User registered successfully" };
    }
  );
}

async function loginUser({ username, password }) {
  const payload = {
    username: cleanText(username),
    password: cleanText(password),
  };
  validateLogin(payload);

  const localLogin = async () => {
    const user = await localAuthStore.findByUsername(payload.username);
    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    return buildLoginResponse(user, payload.password);
  };

  if (!supabase) return localLogin();

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", payload.username)
      .maybeSingle();

    if (error) throw error;
    if (!user) return localLogin();

    return buildLoginResponse(user, payload.password);
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      console.warn("[auth] Supabase unavailable; using local development auth store.");
      return localLogin();
    }

    throw error;
  }
}

async function getProfile(username) {
  const cleanUsername = cleanText(username);

  const localProfile = async () => {
    const user = await localAuthStore.findByUsername(cleanUsername);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return { user: toAuthUser(user) };
  };

  if (!supabase) return localProfile();

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email, github_id, created_at")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (error) throw error;
    if (!user) return localProfile();

    return { user: toAuthUser(user) };
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      console.warn("[auth] Supabase unavailable; using local development auth store.");
      return localProfile();
    }

    throw error;
  }
}

async function processGithubUser(githubUser) {
  const githubPayload = {
    username: cleanText(githubUser.username),
    email: cleanText(githubUser.email) || `${githubUser.githubId}@github.com`,
    github_id: githubUser.githubId,
  };

  return withAuthStore(
    async () => {
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("github_id", githubPayload.github_id)
        .maybeSingle();

      let user = existingUser;

      if (!user) {
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([githubPayload])
          .select()
          .single();

        if (insertError) throw insertError;
        user = newUser;
      }

      return buildTokenResponse(user);
    },
    async () => {
      let user = await localAuthStore.findByGithubId(githubPayload.github_id);

      if (!user) {
        user = await localAuthStore.createUser(githubPayload);
      }

      return buildTokenResponse(user);
    }
  );
}

async function buildLoginResponse(user, password) {
  const isMatch = await bcrypt.compare(password, user.password || "");
  if (!isMatch) {
    throw new HttpError(401, "Invalid credentials");
  }

  return buildTokenResponse(user);
}

function buildTokenResponse(user) {
  const token = generateToken({ username: user.username, _id: user.id });

  return {
    token,
    user: toAuthUser(user),
  };
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  processGithubUser,
};

