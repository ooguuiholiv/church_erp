"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-zinc-300 rounded-full animate-spin"></div>
        <p>Carregando sistema...</p>
      </div>
    </div>
  );
}
