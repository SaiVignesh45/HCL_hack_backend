import { LOCAL_STORAGE_KEYS } from "../utils/constants";
import { apiPost } from "./api";

export const authService = {
  login: async (email, password) => {
    const data = await apiPost("/login", { email, password });
    
    // Store token and basic user info from login payload assumption
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ email }));

    return { token: data.token, user: { email } };
  },

  register: async (name, email, password) => {
    const data = await apiPost("/register", { name, email, password });
    
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ name, email }));

    return { token: data.token, user: { name, email } };
  },

  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  },
};
