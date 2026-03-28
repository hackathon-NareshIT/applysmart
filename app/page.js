"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppStore from "@/store/useAppStore";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router, isAuthenticated]);

  return null;
}
