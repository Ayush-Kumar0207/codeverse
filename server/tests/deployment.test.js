const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const {
  escapeHtml,
  resolveDeployFile,
  sanitizeRelativeFileName,
  slugifyProjectId,
} = require("../src/services/deployment.service");

test("project identifiers are normalized and length bounded", () => {
  assert.equal(slugifyProjectId("  My Premium Workspace!  "), "my-premium-workspace");
  assert.equal(slugifyProjectId("___" ).startsWith("workspace-"), true);
  assert.equal(slugifyProjectId("a".repeat(100)).length, 64);
});

test("deployment file names cannot traverse outside their project", () => {
  const root = path.resolve("sandbox", "project");
  const result = resolveDeployFile(root, "../../assets/../index.html");

  assert.equal(result.safeRelativePath, "assets/index.html");
  assert.equal(path.relative(root, result.filePath).startsWith(".."), false);
  assert.equal(sanitizeRelativeFileName("folder\\script file.js"), "folder/script_file.js");
});

test("published HTML escapes untrusted content", () => {
  assert.equal(
    escapeHtml(`<script>alert("x")</script>`),
    "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
  );
});
