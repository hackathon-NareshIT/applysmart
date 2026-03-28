"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, LogOut, Menu, X } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import ConfirmModal from "@/components/ConfirmModal";

export default function Navbar() {
  const router = useRouter();
  const { user, theme, setTheme, logout, isAuthenticated } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <>
      <ConfirmModal
        open={showLogoutModal}
        onConfirm={() => { setShowLogoutModal(false); handleLogout(); }}
        onCancel={() => setShowLogoutModal(false)}
        isDark={isDark}
        title="Log out?"
        message="You'll be signed out of your account."
        confirmLabel="Log out"
        icon={LogOut}
        iconColor={isDark ? "text-red-300" : "text-red-600"}
      />
      <header
        className={`border-b ${
        isDark
          ? "border-white/[0.07] bg-gradient-to-r from-indigo-950/60 via-violet-950/40 to-purple-950/60"
          : "border-indigo-200/30 bg-gradient-to-r from-indigo-50/80 via-violet-50/60 to-purple-50/80"
      } backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3">
          {/* <div
            className={`flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${
              isDark ? "from-indigo-500 to-violet-600" : "from-indigo-600 to-violet-700"
            }`}
          >
            <span className="text-base">🚀</span>
          </div> */}
          <span
            className={`hidden sm:inline font-bold text-xl ${
              isDark
                ? "bg-gradient-to-r from-indigo-300 via-violet-200 to-purple-300 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-indigo-600 via-violet-700 to-purple-700 bg-clip-text text-transparent"
            }`}
          >
            ApplySmart
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/analyze"
                className={`text-sm font-medium transition-colors ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Analyze
              </Link>
              <span
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {user?.name}
              </span>
            </>
          )}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              isDark
                ? "bg-white/[0.08] hover:bg-white/[0.12]"
                : "bg-gray-900/[0.08] hover:bg-gray-900/[0.12]"
            }`}
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                isDark
                  ? "bg-red-600/20 text-red-300 hover:bg-red-600/30"
                  : "bg-red-600/20 text-red-700 hover:bg-red-600/30"
              }`}
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              isDark
                ? "bg-white/[0.08] hover:bg-white/[0.12]"
                : "bg-gray-900/[0.08] hover:bg-gray-900/[0.12]"
            }`}
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              isDark
                ? "bg-white/[0.08] hover:bg-white/[0.12]"
                : "bg-gray-900/[0.08] hover:bg-gray-900/[0.12]"
            }`}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && isAuthenticated && (
        <div
          className={`md:hidden border-t ${
            isDark ? "border-white/[0.07]" : "border-gray-900/[0.07]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            <Link
              href="/dashboard"
              className={`block text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/analyze"
              className={`block text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Analyze
            </Link>
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                isDark
                  ? "bg-red-600/20 text-red-300 hover:bg-red-600/30"
                  : "bg-red-600/20 text-red-700 hover:bg-red-600/30"
              }`}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
