const SOCKET_EVENTS = Object.freeze({
  JOIN_ROOM: "joinRoom",
  CODE_CHANGE: "codeChange",
  SYNC_CODE: "syncCode",
  CHAT_MESSAGE: "chatMessage",
  EXECUTION_START: "execution:start",
  EXECUTION_RESULT: "execution:result",
  EXECUTION_ERROR: "execution:error",
});

module.exports = { SOCKET_EVENTS };

