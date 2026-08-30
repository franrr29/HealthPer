import api from "../services/api";

// Login con email y password
export async function loginRequest(email: string, password: string) {
  const response = await api.post("auth/login", { email, password });

  return response.data;
}

// Login rapido con datos de demo
export async function tryDemoRequest() {
  const response = await api.post("auth/try-demo");

  return response.data;
}
