const fs = require("fs");
const Module = require("module");
const path = require("path");
const { spawn, spawnSync } = require("child_process");
const ts = require("typescript");

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveTypeScriptModule(request, parent, isMain, options) {
  try {
    return originalResolveFilename.call(this, request, parent, isMain, options);
  } catch (error) {
    if (!request.startsWith(".") || !parent?.filename) throw error;
    const base = path.resolve(path.dirname(parent.filename), request);
    for (const candidate of [`${base}.ts`, path.join(base, "index.ts")]) {
      if (fs.existsSync(candidate)) return candidate;
    }
    throw error;
  }
};

require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
};

const { AT_ALGORITHMS } = require("../data/algos/index.ts");
const shouldCompile = !process.argv.includes("--no-compile");
const errors = [];
const compilationQueue = [];
const approachCounts = new Map();
let approachCount = 0;
let cppCount = 0;
let guidedCount = 0;
let runnableCount = 0;

function canonicalLanguage(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function addError(scope, message) {
  errors.push(`${scope}: ${message}`);
}

for (const algorithm of AT_ALGORITHMS) {
  approachCounts.set(algorithm.approaches.length, (approachCounts.get(algorithm.approaches.length) || 0) + 1);
  for (const approach of algorithm.approaches) {
    approachCount += 1;
    const scope = `${algorithm.title} [${algorithm.id}] / ${approach.name}`;
    const implementations = approach.implementations.filter((implementation) => {
      const language = canonicalLanguage(implementation.language);
      return language === "c++" || language === "cpp" || language === "cxx";
    });

    if (implementations.length !== 1) {
      addError(scope, `expected exactly one C++ implementation, found ${implementations.length}`);
      continue;
    }

    cppCount += 1;
    const code = implementations[0].code.trim();
    const hasPremiumGuide =
      code.includes("// CodeVerse solution guide")
      && code.includes("// Problem:")
      && code.includes("// Strategy:")
      && code.includes("// Key idea:")
      && code.includes("// Complexity:");
    if (!hasPremiumGuide) {
      addError(scope, "C++ solution is missing the premium teaching guide");
    } else {
      guidedCount += 1;
    }
    if (!/\bint\s+main\s*\(/.test(code)) {
      addError(scope, "C++ solution has no int main entry point");
    } else if (/\bint\s+main\s*\([^)]*\)\s*\{\s*return\s+0\s*;\s*\}/s.test(code)) {
      addError(scope, "C++ solution has a trivial main that does not exercise the algorithm");
    } else {
      runnableCount += 1;
    }
    if (!/#include\s*<bits\/stdc\+\+\.h>/.test(code) && !/#include\s*</.test(code)) {
      addError(scope, "C++ solution has no standard-library include");
    }
    const repeatedBitsInclude = code.match(/^[ \t]*#include\s*<bits\/stdc\+\+\.h>[ \t]*$/gm) || [];
    if (repeatedBitsInclude.length > 1) {
      addError(scope, "C++ solution repeats the bits/stdc++.h include");
    }
    const repeatedNamespace = code.match(/^[ \t]*using\s+namespace\s+std;[ \t]*$/gm) || [];
    if (repeatedNamespace.length > 1) {
      addError(scope, "C++ solution repeats using namespace std");
    }
    if (shouldCompile) compilationQueue.push({ scope, code });
  }
}

function locateCompiler() {
  const installedCompiler = "C:\\MinGW\\bin\\g++.exe";
  if (fs.existsSync(installedCompiler)) return installedCompiler;
  const result = spawnSync("where.exe", ["g++"], { encoding: "utf8" });
  const candidate = result.status === 0
    ? result.stdout.split(/\r?\n/).map((value) => value.trim()).find(Boolean)
    : "";
  if (!candidate) throw new Error("g++ was not found on PATH");
  return candidate;
}

function compileSource(compiler, item) {
  return new Promise((resolve) => {
    const child = spawn(compiler, ["-std=c++17", "-x", "c++", "-fsyntax-only", "-"], {
      stdio: ["pipe", "ignore", "pipe"],
      windowsHide: true,
    });
    let stderr = "";
    const timeout = setTimeout(() => child.kill(), 20000);
    child.stderr.on("data", (chunk) => {
      if (stderr.length < 5000) stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      resolve({ ...item, error: error.message });
    });
    child.on("close", (code, signal) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve(null);
        return;
      }
      resolve({
        ...item,
        error: signal
          ? `compiler terminated with ${signal}`
          : stderr.replace(/\r/g, "").trim().slice(0, 1200) || `compiler exited with ${code}`,
      });
    });
    child.stdin.end(item.code);
  });
}

async function compileAll(queue, concurrency) {
  const failures = [];
  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const item = queue[cursor];
      cursor += 1;
      const failure = await compileSource(compiler, item);
      if (failure) failures.push(failure);
    }
  }
  const compiler = locateCompiler();
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()));
  return failures;
}

async function main() {
  let compileFailures = [];
  if (shouldCompile) {
    compileFailures = await compileAll(compilationQueue, 4);
    for (const failure of compileFailures) {
      addError(failure.scope, `does not compile: ${failure.error}`);
    }
  }

  const distribution = [...approachCounts.entries()]
    .sort(([left], [right]) => left - right)
    .map(([count, algorithms]) => `${count} approach${count === 1 ? "" : "es"}=${algorithms}`)
    .join(", ");

  console.log(
    `Audited ${AT_ALGORITHMS.length} algorithms, ${approachCount} approaches, and ${cppCount} C++ implementations.`
  );
  console.log(`Approach distribution: ${distribution}.`);
  console.log(`Runnable main coverage: ${runnableCount}/${approachCount}; premium-guide coverage: ${guidedCount}/${cppCount}.`);
  if (shouldCompile) {
    console.log(`Compiler coverage: ${compilationQueue.length - compileFailures.length}/${compilationQueue.length}.`);
  }

  if (errors.length) {
    console.error(`C++ catalog audit failed with ${errors.length} issue(s).`);
    for (const error of errors.slice(0, 60)) console.error(`- ${error}`);
    if (errors.length > 60) console.error(`- ... ${errors.length - 60} additional issue(s) omitted`);
    process.exitCode = 1;
    return;
  }
  console.log("C++ catalog audit passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
