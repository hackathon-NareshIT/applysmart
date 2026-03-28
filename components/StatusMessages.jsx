"use client";

import { useState, useEffect, useRef } from "react";

/**
 * StatusMessages
 * Props:
 *   active   – boolean, whether to cycle messages
 *   messages – string[], list of status messages to cycle through
 *   interval – number (ms), how long each message shows (default 2000)
 *   isDark   – boolean, for theme-aware styling
 *   size     – "sm" | "md", controls text size (default "sm")
 */
export default function StatusMessages({
  active,
  messages = [],
  interval = 2000,
  isDark = false,
  size = "sm",
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  // Fade in when active starts, fade out when it stops
  useEffect(() => {
    if (active) {
      setIndex(0);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [active]);

  // Cycle through messages while active
  useEffect(() => {
    if (!active || messages.length === 0) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [active, messages, interval]);

  if (!messages.length) return null;

  return (
    // Fixed height prevents layout shift — taller for "md" size
    <div className={`flex items-center justify-center mt-3 ${size === "md" ? "h-10" : "h-6"}`}>
      <p
        className={`font-medium tracking-wide transition-all duration-500
          ${size === "md" ? "text-sm" : "text-xs"}
          ${visible ? "opacity-60 translate-y-0" : "opacity-0 translate-y-1"}
          ${isDark ? "text-gray-400" : "text-gray-800"}`}
      >
        {messages[index]}
      </p>
    </div>
  );
}
