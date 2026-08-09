// client/lib/socket.ts
import { io } from "socket.io-client";
import { getApiBaseUrl } from "@/services/runtime-config";

const apiBaseUrl = getApiBaseUrl();
const socket = io(apiBaseUrl || undefined, {
  autoConnect: Boolean(apiBaseUrl),
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 250,
  reconnectionDelayMax: 4000,
  timeout: 12_000,
});

export default socket;
