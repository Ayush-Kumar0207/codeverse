import axios from "axios";
import { getToken } from "@/utils/auth";
import { getApiBaseUrl } from "./runtime-config";

const API_BASE_URL = getApiBaseUrl();

console.log(`[API] Initializing with Base URL: ${API_BASE_URL}`);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

