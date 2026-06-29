import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});



// Agrega el access token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});






// Pide un nuevo acces token usando el refresh token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  const response = await axios.post(
    "http://localhost:4000/auth/refresh",
    { refreshToken }
  );

  const newToken = response.data.accessToken;

  localStorage.setItem("token", newToken);

  return newToken;
}





// Borra los tokens y manda al login
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";
}




// Si el token vence intenta renovarlo y repetir la request
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessToken();

      if (!newToken) {
        logout();
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch {
      logout();
      return Promise.reject(error);
    }
  }
);

export default api;