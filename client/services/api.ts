import axios from "axios";
import { getApiBaseUrl } from "./runtime-config";

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "X-CodeVerse-Client": "web-v1",
  },
});

export default apiClient;
