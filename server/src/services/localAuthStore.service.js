const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = path.join(__dirname, "../../.data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeUsers(users) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

async function findByUsername(username) {
  const users = await readUsers();
  return users.find((user) => user.username === username) || null;
}

async function findByGithubId(githubId) {
  const users = await readUsers();
  return users.find((user) => user.github_id === githubId) || null;
}

async function findByGoogleId(googleId) {
  const users = await readUsers();
  return users.find((user) => user.google_id === googleId) || null;
}

async function findByEmail(email) {
  const users = await readUsers();
  return users.find((user) => user.email === email) || null;
}

async function createUser({ username, password, email, github_id, google_id }) {
  const users = await readUsers();
  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    username,
    password,
    email,
    github_id: github_id || null,
    google_id: google_id || null,
    created_at: now,
  };

  users.push(user);
  await writeUsers(users);

  return user;
}

async function linkOAuthProvider(username, providerIdField, providerId) {
  if (!username || !providerId || !["github_id", "google_id"].includes(providerIdField)) {
    const existingUser = username ? await findByUsername(username) : null;
    return existingUser;
  }

  const users = await readUsers();
  const index = users.findIndex((user) => user.username === username);
  if (index === -1) return null;

  if (!users[index][providerIdField]) {
    users[index] = {
      ...users[index],
      [providerIdField]: providerId,
    };
    await writeUsers(users);
  }

  return users[index];
}

module.exports = {
  createUser,
  findByEmail,
  findByGithubId,
  findByGoogleId,
  findByUsername,
  linkOAuthProvider,
};
