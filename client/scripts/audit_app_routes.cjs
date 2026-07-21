const fs = require("fs");
const path = require("path");

const appDir = path.resolve(__dirname, "../app");
const sourceRoots = [
  appDir,
  path.resolve(__dirname, "../components"),
  path.resolve(__dirname, "../context"),
  path.resolve(__dirname, "../hooks"),
];

function walk(directory, predicate) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(target, predicate));
    else if (predicate(target)) files.push(target);
  }
  return files;
}

function routeFromPage(file) {
  const relative = path.relative(appDir, path.dirname(file)).replaceAll("\\", "/");
  return relative ? `/${relative}` : "/";
}

const routeFiles = walk(appDir, (file) => path.basename(file) === "page.tsx");
const routes = routeFiles.map(routeFromPage);
const routePatterns = routes.map((route) => {
  const source = route
    .split("/")
    .map((segment) => {
      if (/^\[\[\.\.\..+\]\]$/.test(segment)) return "(?:/.*)?";
      if (/^\[\.\.\..+\]$/.test(segment)) return "/.+";
      if (/^\[.+\]$/.test(segment)) return "/[^/]+";
      return segment ? `/${segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}` : "";
    })
    .join("");
  return { route, pattern: new RegExp(`^${source || "/"}$`) };
});

function isKnownRoute(target) {
  const pathname = target.split(/[?#]/, 1)[0] || "/";
  if (pathname.startsWith("/api/") || pathname.startsWith("/deployments/")) return true;
  return routePatterns.some(({ pattern }) => pattern.test(pathname));
}

function collectLiteralLinks(source) {
  const links = [];
  const jsxTag = /<(?:Link|a)\b[^>]*\bhref\s*=\s*(?:"([^"]+)"|'([^']+)'|\{\s*"([^"]+)"\s*\}|\{\s*'([^']+)'\s*\})[^>]*>/gms;
  const navigationCall = /(?:router\.(?:push|replace)|redirect)\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g;
  for (const match of source.matchAll(jsxTag)) {
    links.push({ target: match[1] || match[2] || match[3] || match[4], tag: match[0] });
  }
  for (const match of source.matchAll(navigationCall)) {
    links.push({ target: match[1] || match[2], tag: match[0] });
  }
  return links;
}

const failures = [];
const inspectedLinks = [];
const sourceFiles = sourceRoots.flatMap((root) =>
  walk(root, (file) => /\.(?:ts|tsx)$/.test(file))
);

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const link of collectLiteralLinks(source)) {
    const target = link.target.trim();
    inspectedLinks.push({ file, target });
    if (!target || target === "#" || /^javascript:/i.test(target)) {
      failures.push(`${path.relative(appDir, file)}: empty or unsafe link "${target}"`);
      continue;
    }
    if (target.startsWith("/") && !isKnownRoute(target)) {
      failures.push(`${path.relative(appDir, file)}: unresolved internal route "${target}"`);
    }
    if (
      /\btarget\s*=\s*["_']_blank["_']/.test(link.tag) &&
      !/\brel\s*=\s*["_'][^"']*(?:noopener|noreferrer)[^"']*["_']/.test(link.tag)
    ) {
      failures.push(`${path.relative(appDir, file)}: target="_blank" link lacks a safe rel`);
    }
  }
}

const duplicateRoutes = routes.filter(
  (route, index) => routes.indexOf(route) !== index
);
for (const route of new Set(duplicateRoutes)) {
  failures.push(`duplicate app route: ${route}`);
}

const emptySourceFiles = sourceFiles.filter((file) => fs.statSync(file).size === 0);
for (const file of emptySourceFiles) {
  failures.push(`${path.relative(appDir, file)}: empty source file`);
}

console.log(`Audited ${routes.length} app routes and ${inspectedLinks.length} literal navigation targets.`);
console.log(`Routes: ${routes.sort().join(", ")}`);

if (failures.length) {
  console.error(`Application route audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Application route audit passed.");
}
