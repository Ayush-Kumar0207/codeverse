const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

// Supported languages & setup
const languageConfig = {
  python: { ext: "py", image: "python:3.11", cmd: "python3" },
  cpp: { ext: "cpp", image: "gcc:12.2", cmd: "g++ main.cpp -o main && ./main" },
  javascript: { ext: "js", image: "node:18", cmd: "node main.js" },
  java: { ext: "java", image: "openjdk:17", cmd: "javac Main.java && java Main" },
};

const TEMP_DIR = path.join(__dirname, "../temp");

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

module.exports = async function runInDocker(code, language) {
  const config = languageConfig[language.toLowerCase()];
  if (!config) throw new Error("Unsupported language");

  const filename = language === "java" ? "Main" : "main";
  const codeFile = `${filename}.${config.ext}`;
  const folder = path.join(TEMP_DIR, uuid());
  fs.mkdirSync(folder);

  const filePath = path.join(folder, codeFile);
  fs.writeFileSync(filePath, code);

  const dockerCmd = `docker run --rm -m 100m --cpus=".5" -v ${folder}:/app -w /app ${config.image} sh -c "${config.cmd}"`;

  return new Promise((resolve, reject) => {
    exec(dockerCmd, { timeout: 8000 }, (err, stdout, stderr) => {
      fs.rmSync(folder, { recursive: true, force: true });

      if (err) {
        return reject(stderr || err.message);
      }

      resolve(stdout);
    });
  });
};
