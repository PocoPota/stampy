"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@supabase/auth-helpers-react";

export default function AuthCallback() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    const register = async () => {
      if (!user) return;

      await fetch("/api/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
        }),
      });

      router.push("/");
    };

    register();
  }, [user]);

  return <div>ログイン処理中...</div>;
}
