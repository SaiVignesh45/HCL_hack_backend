import { LOCAL_STORAGE_KEYS } from "../utils/constants";

// Mock user database for demonstration
const MOCK_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", password: "password123" },
];

export const authService = {
  login: async (email, password) => {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 800));

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) throw new Error("Invalid credentials. Try john@example.com / password123");

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    const userData = { id: user.id, name: user.name, email: user.email };

    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));

    return { token, user: userData };
  },

  register: async (name, email, password) => {
    await new Promise((res) => setTimeout(res, 800));

    const newUser = { id: Date.now(), name, email, password };
    MOCK_USERS.push(newUser);

    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };

    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));

    return { token, user: userData };
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
