import { create } from "zustand";

const useAppStore = create((set) => ({
  // Auth state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  // App state
  resume: "",
  jobDescription: "",
  result: null,
  improvedResume: "",
  loading: false,
  resumeFileName: "",
  theme: "dark",

  // Auth actions
  setUser: (user) => {
    if (typeof window !== "undefined" && user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user });
  },
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }
    }
    set({ token, isAuthenticated: !!token });
  },
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    if (typeof window !== "undefined") {
      const currentTheme = localStorage.getItem("theme") || "dark";
      localStorage.clear();
      localStorage.setItem("theme", currentTheme);
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      resume: "",
      jobDescription: "",
      result: null,
      improvedResume: "",
      loading: false,
      resumeFileName: "",
    });
  },

  // App actions
  setResume: (resume) => set({ resume }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setResult: (result) => set({ result }),
  setImprovedResume: (improvedResume) => set({ improvedResume }),
  setLoading: (loading) => set({ loading }),
  setResumeFileName: (resumeFileName) => set({ resumeFileName }),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ theme });
  },
  clearAnalysis: () =>
    set({
      resume: "",
      jobDescription: "",
      result: null,
      improvedResume: "",
      resumeFileName: "",
    }),
}));

export default useAppStore;
