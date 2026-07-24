import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});


// pide un nuevo access token usando el refresh token de la cookie
async function refreshAccessToken() {
  await api.post("/auth/refresh");
}


// limpia el flag de auth y redirige al login
function logout() {
  localStorage.removeItem("isAuthenticated");
  window.location.href = "/login";
}


// si el token vence intenta renovarlo y repetir la request
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return api(originalRequest);
    } catch {
      logout();
      return Promise.reject(error);
    }
  }
);

export default api;