import axiosInstance from "./axios";

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  return axiosInstance.post("/auth/login", data);
};

export const logout = async () => {
  return axiosInstance.post("/auth/logout");
};

export const register = async (data: LoginData) => {
  return axiosInstance.post("/auth/register", data);
};

export const forgotPassword = async (email: string) => {
  return axiosInstance.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token: string, password: string) => {
  return axiosInstance.post("/auth/reset-password", { token, password });
};