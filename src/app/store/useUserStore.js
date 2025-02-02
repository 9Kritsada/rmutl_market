import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  setUser: (userData) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to save user to localStorage:", error);
      }
    }
    set({ user: userData });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Failed to remove user from localStorage:", error);
      }
    }
    set({ user: null });
  },
  initializeUser: () => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        set({ user: storedUser || null });
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        set({ user: null });
      }
    }
  },
}));

export default useUserStore;
