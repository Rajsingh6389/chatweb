import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://chatweb-production-91d6.up.railway.app"
      : "/api",
});

export default api;
