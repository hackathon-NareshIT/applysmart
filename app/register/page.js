"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { User, Mail, Lock, Loader } from "lucide-react";
import useAppStore from "@/store/useAppStore";

const getDarkToastStyle = () => ({
  background: "#131929",
  color: "#e2e8f0",
  border: "1px solid rgba(129,140,248,0.2)",
  borderRadius: "12px",
  fontSize: "14px",
  padding: "12px 16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(129,140,248,0.08)",
  backdropFilter: "blur(12px)",
});

const getLightToastStyle = () => ({
  background: "#f8fafc",
  color: "#1a202c",
  border: "1px solid rgba(79, 70, 229, 0.2)",
  borderRadius: "12px",
  fontSize: "14px",
  padding: "12px 16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(79, 70, 229, 0.08)",
  backdropFilter: "blur(12px)",
});

export default function RegisterPage() {
  const router = useRouter();
  const { theme, setTheme, setUser, setToken, setIsAuthenticated } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, [setTheme]);

  const isDark = theme === "dark";

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields", {
        style: isDark ? getDarkToastStyle() : getLightToastStyle(),
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", {
        style: isDark ? getDarkToastStyle() : getLightToastStyle(),
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed", {
          style: isDark ? getDarkToastStyle() : getLightToastStyle(),
        });
        return;
      }

      // Store user and token
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);

      // Store in localStorage for persistence
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Registration successful! 🎉", {
        style: { ...getDarkToastStyle(), borderColor: "rgba(52,211,153,0.3)" } || { ...getLightToastStyle(), borderColor: "rgba(52,211,153,0.3)" },
      });
      router.push("/dashboard");
    } catch (err) {
      toast.error("Registration failed. Please try again.", {
        style: isDark ? getDarkToastStyle() : getLightToastStyle(),
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <main
      className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-[#0b0f1a] text-white" : "bg-white text-[#1a202c]"
      }`}
    >
      <Toaster position="top-right" gutter={10} toastOptions={{ style: isDark ? getDarkToastStyle() : getLightToastStyle() }} />
      
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
            <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[120px]" />
            <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
          </>
        )}
      </div>

      <div className="relative w-full max-w-md px-6">
        {/* Logo here */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${
              isDark
                ? "from-indigo-500 to-violet-600"
                : "from-indigo-600 to-violet-700"
            }`}
          >
            <span className="text-lg">🚀</span>
          </div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isDark
                ? "bg-gradient-to-r from-indigo-300 via-violet-200 to-purple-300 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-indigo-600 via-violet-700 to-purple-700 bg-clip-text text-transparent"
            }`}
          >
            ApplySmart
          </h1>
        </div>

        <div
          className={`rounded-2xl border ${
            isDark
              ? "border-white/[0.08] bg-white/[0.03]"
              : "border-gray-900/[0.08] bg-gray-900/[0.03]"
          } p-8 space-y-6`}
        >
          <div>
            <h2 className="text-xl font-bold mb-2">Create Account</h2>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Sign up to get started with ApplySmart
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all
                    ${isDark
                      ? "bg-white/[0.06] border-white/[0.1] text-gray-100 placeholder:text-gray-600 focus:border-indigo-500/60 focus:bg-white/[0.08]"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white"
                    }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all
                    ${isDark
                      ? "bg-white/[0.06] border-white/[0.1] text-gray-100 placeholder:text-gray-600 focus:border-indigo-500/60 focus:bg-white/[0.08]"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white"
                    }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all
                    ${isDark
                      ? "bg-white/[0.06] border-white/[0.1] text-gray-100 placeholder:text-gray-600 focus:border-indigo-500/60 focus:bg-white/[0.08]"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white"
                    }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white"
              }`}
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            className={`h-px ${isDark ? "bg-white/[0.08]" : "bg-gray-900/[0.08]"}`}
          />

          <p className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Already have an account?{" "}
            <Link
              href="/login"
              className={`font-semibold cursor-pointer ${
                isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
              }`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
