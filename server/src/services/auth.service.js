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

function isMissingColumnError(error) {
  return error?.code === "42703" || /column .* does not exist/i.test(error?.message || "");
}

function makeOauthUsername(value, provider, providerId) {
  const base = cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (base) return base;

  const suffix = cleanText(providerId).slice(0, 8) || "user";
  return `${provider}-${suffix}`;
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
    githubId: user.githubId || user.github_id || undefined,
    avatar: user.avatar || user.avatar_url || undefined,
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
  return processOAuthUser("github", githubUser);
}

async function processGoogleUser(googleUser) {
  return processOAuthUser("google", googleUser);
}

async function processOAuthUser(provider, oauthUser) {
  const providerIdField = `${provider}_id`;
  const providerId =
    cleanText(oauthUser.providerId) ||
    cleanText(oauthUser[providerIdField]) ||
    cleanText(oauthUser.id) ||
    cleanText(oauthUser.githubId) ||
    cleanText(oauthUser.googleId);
  const email =
    cleanText(oauthUser.email) ||
    (providerId ? `${providerId}@${provider}.local` : "");
  const username = makeOauthUsername(
    oauthUser.username || oauthUser.login || oauthUser.displayName || email.split("@")[0],
    provider,
    providerId
  );
  const oauthPayload = {
    username,
    email,
    [providerIdField]: providerId,
  };

  return withAuthStore(
    async () => {
      const existingUser = await findSupabaseOAuthUser(providerIdField, providerId, email, username);

      let user = existingUser;

      if (!user) {
        user = await createSupabaseOAuthUser(oauthPayload, providerIdField);
      } else {
        user = await linkSupabaseOAuthProvider(user, providerIdField, providerId);
      }

      return buildTokenResponse(user);
    },
    async () => {
      let user =
        provider === "github"
          ? await localAuthStore.findByGithubId(providerId)
          : await localAuthStore.findByGoogleId(providerId);

      if (!user && email) {
        user = await localAuthStore.findByEmail(email);
      }

      if (!user) {
        user = await localAuthStore.findByUsername(username);
      }

      if (!user) {
        user = await localAuthStore.createUser(oauthPayload);
      } else {
        user = await localAuthStore.linkOAuthProvider(user.username, providerIdField, providerId);
      }

      return buildTokenResponse(user);
    }
  );
}

async function linkSupabaseOAuthProvider(user, providerIdField, providerId) {
  if (!providerId || user?.[providerIdField]) return user;

  const { data, error } = await supabase
    .from("users")
    .update({ [providerIdField]: providerId })
    .eq("id", user.id)
    .select()
    .single();

  if (!error) return data || { ...user, [providerIdField]: providerId };
  if (isMissingColumnError(error)) return user;

  throw error;
}

async function findSupabaseOAuthUser(providerIdField, providerId, email, username) {
  if (providerId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq(providerIdField, providerId)
      .maybeSingle();

    if (error && !isMissingColumnError(error)) throw error;
    if (data) return data;
  }

  if (email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;
  }

  if (username) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;
  }

  return null;
}

async function createSupabaseOAuthUser(oauthPayload, providerIdField) {
  const insertPayload = { ...oauthPayload };
  const { data, error } = await supabase
    .from("users")
    .insert([insertPayload])
    .select()
    .single();

  if (!error) return data;

  if (!isMissingColumnError(error)) throw error;

  delete insertPayload[providerIdField];
  const retry = await supabase
    .from("users")
    .insert([insertPayload])
    .select()
    .single();

  if (retry.error) throw retry.error;
  return retry.data;
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
  processGoogleUser,
};

