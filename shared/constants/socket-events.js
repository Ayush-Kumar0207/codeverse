const SOCKET_EVENTS = Object.freeze({
  JOIN_ROOM: "joinRoom",
  CODE_CHANGE: "codeChange",
  SYNC_CODE: "syncCode",
  CHAT_MESSAGE: "chatMessage",
  FILES_CHANGE: "filesChange",
  EXECUTION_START: "execution:start",
  EXECUTION_RESULT: "execution:result",
  EXECUTION_ERROR: "execution:error",
  CURSOR_MOVE: "cursorMove",
  USER_JOINED: "userJoined",
  USER_LEFT: "userLeft",
  PRESENCE_UPDATE: "presenceUpdate",
  REMOVE_COLLABORATOR: "collaborator:remove",
  COLLABORATOR_REMOVED: "collaborator:removed",
  EDIT_PERMISSION_UPDATE: "editPermission:update",
  EDIT_PERMISSION_STATE: "editPermission:state",
  EDIT_PERMISSION_DENIED: "editPermission:denied",
  REALTIME_PING: "realtime:ping",
  REALTIME_PONG: "realtime:pong",
});

module.exports = { SOCKET_EVENTS };

