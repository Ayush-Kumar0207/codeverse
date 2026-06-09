// client/lib/socket.ts
import { io } from "socket.io-client";
import { getApiBaseUrl } from "@/services/runtime-config";

const apiBaseUrl = getApiBaseUrl();
const socket = io(apiBaseUrl || undefined, {
  autoConnect: Boolean(apiBaseUrl),
});

export default socket;
