const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const catalogFiles = [
  path.resolve(__dirname, "../data/algos/generated_cpp_approaches.json"),
  path.resolve(__dirname, "../data/algos/curated_cpp_variants.json"),
];

const style = [
  "BasedOnStyle: Google",
  "IndentWidth: 4",
  "ContinuationIndentWidth: 4",
  "ColumnLimit: 100",
  "AllowShortBlocksOnASingleLine: Never",
  "AllowShortFunctionsOnASingleLine: None",
  "AllowShortIfStatementsOnASingleLine: Never",
  "AllowShortLoopsOnASingleLine: false",
  "BreakBeforeBraces: Attach",
].join(", ");

function locateFormatter() {
  const candidates = [
    process.env.CLANG_FORMAT,
    "C:\\Users\\kumar\\.vscode\\extensions\\ms-vscode.cpptools-1.32.2-win32-x64\\LLVM\\bin\\clang-format.exe",
    "C:\\Users\\kumar\\AppData\\Local\\Programs\\arduino-ide\\resources\\app\\lib\\backend\\resources\\clang-format.exe",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  const lookup = spawnSync("where.exe", ["clang-format"], { encoding: "utf8" });
  if (lookup.status === 0) {
    const candidate = lookup.stdout.split(/\r?\n/).map((value) => value.trim()).find(Boolean);
    if (candidate) return candidate;
  }

  throw new Error("clang-format was not found. Set CLANG_FORMAT to its executable path.");
}

function formatCode(formatter, code, scope) {
  const result = spawnSync(formatter, [`-style={${style}}`], {
    input: code,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error(`${scope}: ${result.error?.message || result.stderr?.trim() || `clang-format exited with ${result.status}`}`);
  }
  return result.stdout.trimEnd();
}

const formatter = locateFormatter();
let formatted = 0;
let changed = 0;

for (const filename of catalogFiles) {
  const catalog = JSON.parse(fs.readFileSync(filename, "utf8"));
  for (const [algorithmId, approaches] of Object.entries(catalog)) {
    for (const approach of approaches) {
      const next = formatCode(formatter, approach.code, `${algorithmId} / ${approach.name}`);
      formatted += 1;
      if (next !== approach.code.trimEnd()) {
        approach.code = next;
        changed += 1;
      }
    }
  }
  fs.writeFileSync(filename, `${JSON.stringify(catalog, null, 2)}\n`);
}

console.log(`Formatted ${formatted} stored C++ approaches; ${changed} changed.`);
