const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

module.exports = function runJava(code) {
  return new Promise((resolve, reject) => {
    const id = uuidv4().split("-")[0];
    const javaFile = `Main${id}.java`;
    const className = `Main${id}`;
    const javaPath = path.join(__dirname, "..", "temp", javaFile);

    fs.writeFileSync(javaPath, code.replace(/Main/g, className)); // Rename class

    exec(`javac ${javaPath} && java -cp ${path.dirname(javaPath)} ${className}`, { timeout: 5000 }, (err, stdout, stderr) => {
      fs.unlinkSync(javaPath);
      const classPath = path.join(path.dirname(javaPath), `${className}.class`);
      if (fs.existsSync(classPath)) fs.unlinkSync(classPath);
      if (err) return resolve(stderr || err.message);
      resolve(stdout);
    });
  });
};
