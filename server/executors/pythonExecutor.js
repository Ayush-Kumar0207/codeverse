const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = function runPython(code) {
  return new Promise((resolve, reject) => {
    const filename = `${uuidv4()}.py`;
    const filepath = path.join(__dirname, "..", "temp", filename);
    fs.writeFileSync(filepath, code);

    exec(`python3 ${filepath}`, { timeout: 5000 }, (err, stdout, stderr) => {
      fs.unlinkSync(filepath);
      if (err) return resolve(stderr || err.message);
      resolve(stdout);
    });
  });
};
