"use client";

import { useEffect, useMemo } from "react";
import socket from "@/lib/socket";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";

export function useSocket(roomId?: string) {
  const api = useMemo(
    () => ({
      socket,
      joinRoom: (nextRoomId = roomId) => {
        if (nextRoomId) socket.emit(SOCKET_EVENTS.JOIN_ROOM, nextRoomId);
      },
      off: socket.off.bind(socket),
      on: socket.on.bind(socket),
    }),
    [roomId]
  );

  useEffect(() => {
    if (!roomId) return;
    api.joinRoom(roomId);
  }, [api, roomId]);

  return api;
}

