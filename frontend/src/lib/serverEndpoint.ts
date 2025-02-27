import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : `${import.meta.env.VITE_BASE_URL}/api`;

export const ServerEndpoint = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
