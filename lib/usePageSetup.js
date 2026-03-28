"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "@/store/useAppStore";

/**
 * Shared hook: restores theme, guards auth, returns { mounted, isDark, theme }
 * @param {boolean} requireAuth - redirect to /login if not authenticated
 */
export function usePageSetup(requireAuth = true) {
  const router = useRouter();
  const { isAuthenticated, setTheme, theme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, [setTheme]);

  useEffect(() => {
    if (!mounted) return;
    if (requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, requireAuth, router]);

  return { mounted, isDark: theme === "dark", theme };
}
