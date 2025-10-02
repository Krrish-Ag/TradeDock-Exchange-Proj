"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function checkId() {
    await signIn("credentials", { userId, password, redirect: false });
    router.push("/markets");
  }
  return (
    <div className="flex justify-center">
      User ID:
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      Pass:
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={checkId}>Submit</button>
    </div>
  );
}
