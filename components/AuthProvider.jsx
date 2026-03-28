"use client";

import { useEffect } from "react";
import useAppStore from "@/store/useAppStore";

export default function AuthProvider({ children }) {
  const { setUser, setToken } = useAppStore();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (authToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUser(user);
        setToken(authToken);
      } catch (err) {
        console.error("Failed to restore auth state:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, [setUser, setToken]);

  return children;
}
