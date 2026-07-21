const fs = require("fs");
const path = require("path");

const cssPath = path.join(__dirname, "..", "app", "globals.css");
const css = fs.readFileSync(cssPath, "utf8");
const themes = ["midnight", "hacker", "solarized", "amoled"];
const pairs = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["sidebar-background", "sidebar-foreground"],
  ["sidebar-accent", "sidebar-accent-foreground"],
  ["editor-background", "editor-foreground"],
];

function readBlock(theme) {
  const marker = theme === "midnight" ? ":root, [data-theme='midnight']" : `[data-theme='${theme}']`;
  const markerIndex = css.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing ${theme} theme block`);
  const start = css.indexOf("{", markerIndex);
  let depth = 0;
  for (let index = start; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(start + 1, index);
  }
  throw new Error(`Unterminated ${theme} theme block`);
}

function readVariables(block) {
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()])
  );
}

function hslToRgb(value) {
  const match = value.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!match) throw new Error(`Unsupported color token: ${value}`);
  const hue = Number(match[1]) / 360;
  const saturation = Number(match[2]) / 100;
  const lightness = Number(match[3]) / 100;
  if (saturation === 0) return [lightness, lightness, lightness];
  const q = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channel = (offset) => {
    let position = hue + offset;
    if (position < 0) position += 1;
    if (position > 1) position -= 1;
    if (position < 1 / 6) return p + (q - p) * 6 * position;
    if (position < 1 / 2) return q;
    if (position < 2 / 3) return p + (q - p) * (2 / 3 - position) * 6;
    return p;
  };
  return [channel(1 / 3), channel(0), channel(-1 / 3)];
}

function luminance(value) {
  return hslToRgb(value)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(left, right) {
  const leftLuminance = luminance(left);
  const rightLuminance = luminance(right);
  return (Math.max(leftLuminance, rightLuminance) + 0.05)
    / (Math.min(leftLuminance, rightLuminance) + 0.05);
}

const failures = [];
const results = [];

for (const theme of themes) {
  const variables = readVariables(readBlock(theme));
  for (const [background, foreground] of pairs) {
    if (!variables[background] || !variables[foreground]) {
      failures.push(`${theme}: missing --${background} or --${foreground}`);
      continue;
    }
    const ratio = contrast(variables[background], variables[foreground]);
    results.push({ theme, pair: `${background}/${foreground}`, ratio });
    if (ratio < 4.5) {
      failures.push(`${theme}: ${background}/${foreground} is ${ratio.toFixed(2)}:1`);
    }
  }
}

for (const theme of themes) {
  const themeResults = results.filter((result) => result.theme === theme);
  const lowest = themeResults.reduce((current, result) => result.ratio < current.ratio ? result : current);
  console.log(`${theme}: lowest contrast ${lowest.ratio.toFixed(2)}:1 (${lowest.pair})`);
}

if (failures.length) {
  console.error(`Visual-system audit failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}

console.log(`Visual-system audit passed across ${themes.length} themes and ${results.length} semantic color pairs.`);
