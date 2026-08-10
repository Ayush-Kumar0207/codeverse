const { readFileSync, readdirSync, statSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { spawnSync } = require("node:child_process");

const repositoryRoot = resolve(__dirname, "..");
const demoDirectory = join(repositoryRoot, "docs", "demo");
const rawDirectory = join(demoDirectory, "raw");
const outputVideo = join(demoDirectory, "codeverse-demo.mp4");
const outputPoster = join(demoDirectory, "codeverse-demo-poster.png");

function findFiles(directory, name) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return findFiles(entryPath, name);
    return entry.name === name ? [entryPath] : [];
  });
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.error) {
    throw new Error(`Unable to run ${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }
}

function readMp4DurationSeconds(filePath) {
  const file = readFileSync(filePath);
  const atomTypeOffset = file.indexOf(Buffer.from("mvhd"));
  if (atomTypeOffset < 0) {
    throw new Error("Packaged MP4 does not contain a movie header.");
  }

  const version = file.readUInt8(atomTypeOffset + 4);
  if (version === 0) {
    const timescale = file.readUInt32BE(atomTypeOffset + 16);
    const duration = file.readUInt32BE(atomTypeOffset + 20);
    return duration / timescale;
  }
  if (version === 1) {
    const timescale = file.readUInt32BE(atomTypeOffset + 24);
    const duration = file.readBigUInt64BE(atomTypeOffset + 28);
    return Number(duration) / timescale;
  }

  throw new Error(`Unsupported MP4 movie-header version: ${version}`);
}

const recordings = findFiles(rawDirectory, "video.webm").sort(
  (left, right) => statSync(right).mtimeMs - statSync(left).mtimeMs,
);

if (recordings.length === 0) {
  throw new Error("No Playwright video found. Run `npm run demo:record` first.");
}

const sourceVideo = recordings[0];
const subtitleFilter = [
  "subtitles=docs/demo/codeverse-demo.srt",
  "force_style='FontName=Segoe UI,FontSize=18,PrimaryColour=&H00FFFFFF,OutlineColour=&H00180B04,BorderStyle=1,Outline=2,Shadow=0,MarginV=34'",
].join(":");

run("ffmpeg", [
  "-y",
  "-i",
  sourceVideo,
  "-vf",
  `${subtitleFilter},tpad=stop_mode=clone:stop_duration=3`,
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "20",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  "-an",
  outputVideo,
]);

run("ffmpeg", [
  "-y",
  "-ss",
  "00:00:32",
  "-i",
  outputVideo,
  "-frames:v",
  "1",
  "-update",
  "1",
  "-vf",
  "scale=1440:-1",
  outputPoster,
]);

const duration = readMp4DurationSeconds(outputVideo);
if (!Number.isFinite(duration) || duration < 75 || duration > 90) {
  throw new Error(`Packaged demo must be 75–90 seconds; received ${duration.toFixed(2)} seconds.`);
}

console.log(`Packaged ${outputVideo} (${duration.toFixed(2)} seconds).`);
console.log(`Generated ${outputPoster}.`);
