"use client";

import { supabase } from "@/lib/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function LoginPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <main>
      <Button onClick={handleLogin} className="mt-10">
        Googleでログイン
      </Button>
    </main>
  );
}
