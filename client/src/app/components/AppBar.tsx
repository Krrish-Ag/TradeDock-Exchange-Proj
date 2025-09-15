"use client";
import { usePathname, useRouter } from "next/navigation";

export function AppBar() {
  const router = useRouter();
  const route = usePathname();
  return (
    <div className="flex gap-10 p-6 border-b border-slate-800 items-center">
      <div
        className="cursor-pointer text-white text-xl"
        onClick={() => router.push("/")}
      >
        Exchange
      </div>
      <div
        className={`cursor-pointer text-sm ${
          route.startsWith("/market") ? "text-white" : "text-slate-500"
        }`}
        onClick={() => router.push("/markets")}
      >
        Markets
      </div>
      <div
        className={`cursor-pointer text-sm ${
          route.startsWith("/trade") ? "text-white" : "text-slate-500"
        }`}
        onClick={() => router.push("/trade/SOLUSDC")}
      >
        Trade
      </div>
    </div>
  );
}
