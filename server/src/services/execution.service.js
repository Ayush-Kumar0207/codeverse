const axios = require("axios");
const HttpError = require("../utils/httpError");
const { SOCKET_EVENTS } = require("../../../shared/constants/socket-events");
const { SUPPORTED_LANGUAGES } = require("../../../shared/constants/languages");
const { getPistonRuntime } = require("../utils/languageRuntime");

const PISTON_EXECUTE_URL = "https://emkc.org/api/v2/piston/execute";

async function executeCode({ code, language, roomId, user }) {
  if (!code || !language) {
    throw new HttpError(400, "Code and language are required");
  }

  if (!roomId) {
    throw new HttpError(400, "roomId is required");
  }

  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new HttpError(400, `Unsupported language: ${language}`);
  }

  const runtime = getPistonRuntime(language);
  if (!runtime) {
    throw new HttpError(400, `No runtime mapping found for language: ${language}`);
  }

  const io = global._io;
  if (io) {
    io.to(roomId).emit(SOCKET_EVENTS.EXECUTION_START, { user });
  }

  const payload = {
    language: runtime.language,
    version: runtime.version,
    files: [
      {
        name: "main",
        content: code,
      },
    ],
  };

  try {
    const response = await axios.post(PISTON_EXECUTE_URL, payload, {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const run = response?.data?.run || {};
    const stdout = run.stdout || "";
    const stderr = run.stderr || "";
    const output = stdout || stderr || "✅ No output";
    return { output };
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new HttpError(504, "Execution timed out. Please try again.");
    }

    const status = error?.response?.status;
    if (status === 429) {
      throw new HttpError(429, "Execution service is rate-limited. Please retry shortly.");
    }

    const upstreamMessage =
      error?.response?.data?.message ||
      error?.response?.data?.run?.stderr ||
      error.message ||
      "Execution failed.";

    throw new HttpError(502, `Execution service error: ${upstreamMessage}`);
  }
}

module.exports = {
  executeCode,
};

