
const ANALYSIS_KEYS = ["resume", "jobDescription", "result", "improvedResume", "resumeFileName"];

/** Remove all analysis-related keys from localStorage. */
export function clearAnalysisFromStorage() {
  if (typeof window === "undefined") return;
  ANALYSIS_KEYS.forEach((key) => localStorage.removeItem(key));
}

/** Clear analysis state from the Zustand store and localStorage. */
export function clearAnalysisState(store) {
  clearAnalysisFromStorage();
  store.clearAnalysis();
}
