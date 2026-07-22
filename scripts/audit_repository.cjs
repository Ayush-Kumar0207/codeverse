const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  ".editorconfig",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "LICENSE.txt",
  "README.md",
  "SECURITY.md",
  "client/.env.example",
  "server/.env.example",
];

const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missingFiles.length) {
  throw new Error(`Missing repository-quality files: ${missingFiles.join(", ")}`);
}

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  cwd: root,
  encoding: "utf8",
}).split("\0").filter(Boolean);

const forbiddenTrackedFiles = trackedFiles.filter((file) => {
  if (file === "deployments/.gitkeep" || file === "server/temp/.gitkeep") return false;
  return (
    file.startsWith("deployments/") ||
    file.startsWith("server/temp/") ||
    ["client/errors.txt", "client/tsc-errors.txt", "client/data/algos/line_debug.txt"].includes(file)
  );
});

if (forbiddenTrackedFiles.length) {
  throw new Error(`Generated artifacts are tracked:\n${forbiddenTrackedFiles.join("\n")}`);
}

for (const packagePath of ["package.json", "client/package.json", "server/package.json"]) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, packagePath), "utf8"));
  if (manifest.license !== "MIT") {
    throw new Error(`${packagePath} must declare the MIT license.`);
  }
}

const oversizedFiles = trackedFiles
  .filter((file) => fs.existsSync(path.join(root, file)))
  .map((file) => ({ file, size: fs.statSync(path.join(root, file)).size }))
  .filter(({ size }) => size > 10 * 1024 * 1024);

if (oversizedFiles.length) {
  throw new Error(`Tracked files exceed 10 MB: ${oversizedFiles.map(({ file }) => file).join(", ")}`);
}

for (const envPath of ["client/.env.example", "server/.env.example"]) {
  const contents = fs.readFileSync(path.join(root, envPath), "utf8");
  if (/\b(?:sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,})\b/.test(contents)) {
    throw new Error(`${envPath} appears to contain a live credential.`);
  }
}

console.log(`Repository audit passed: ${trackedFiles.length} tracked files, no generated artifacts or oversized files.`);
