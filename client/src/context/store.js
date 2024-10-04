import { toast } from "react-toastify";
import { create } from "zustand";
import { api } from "../api/api.js";

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },
  initializeUser: async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
  logoutUser: async () => {
    try {
      set({ user: null });
      localStorage.removeItem("user");
      const response = await api.Users.logoutUser();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  isLoading: true,
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
