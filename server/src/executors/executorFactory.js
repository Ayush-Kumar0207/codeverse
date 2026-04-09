const runJavaScript = require("./javascriptExecutor");
const runPython = require("./pythonExecutor");
const runCpp = require("./cppExecutor");
const runJava = require("./javaExecutor");

function getExecutor(language) {
  switch (language.toLowerCase()) {
    case "javascript": return runJavaScript;
    case "python": return runPython;
    case "c":
    case "cpp": return runCpp;
    case "java": return runJava;
    default: throw new Error(`Unsupported language: ${language}`);
  }
}

module.exports = { getExecutor };
