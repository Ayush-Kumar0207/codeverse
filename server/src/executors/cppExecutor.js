const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = function runCpp(code) {
  return new Promise((resolve, reject) => {
    const filename = `${uuidv4()}`;
    const cppPath = path.join(__dirname, "..", "temp", `${filename}.cpp`);
    const exePath = path.join(__dirname, "..", "temp", `${filename}.exe`);

    fs.writeFileSync(cppPath, code);

    exec(`g++ ${cppPath} -o ${exePath} && ${exePath}`, { timeout: 5000 }, (err, stdout, stderr) => {
      fs.unlinkSync(cppPath);
      if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
      if (err) return resolve(stderr || err.message);
      resolve(stdout);
    });
  });
};
