const RUNTIME_MAP = Object.freeze({
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  cpp: { language: "c++", version: "10.2.0" },
  "c++": { language: "c++", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  c: { language: "c", version: "10.2.0" },
});

function getPistonRuntime(language) {
  const runtime = RUNTIME_MAP[language];
  if (!runtime) return null;
  return runtime;
}

module.exports = {
  getPistonRuntime,
};

