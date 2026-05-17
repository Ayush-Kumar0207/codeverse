"use client";

import { useEffect, useMemo } from "react";
import socket from "@/lib/socket";
import { SOCKET_EVENTS } from "@shared/constants/socket-events";

type RoomUser = {
  username?: string;
  avatar?: string;
  status?: string;
};

export function useSocket(roomId?: string) {
  const api = useMemo(
    () => ({
      socket,
      joinRoom: (nextRoomId = roomId, user?: RoomUser) => {
        if (nextRoomId) socket.emit(SOCKET_EVENTS.JOIN_ROOM, user ? { roomId: nextRoomId, user } : nextRoomId);
      },
      emit: socket.emit.bind(socket),
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

