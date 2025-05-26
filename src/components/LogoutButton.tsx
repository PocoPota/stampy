"use client";

import { supabase } from "@/lib/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const user = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    if (user) {
      await supabase.auth.signOut();
      router.push("/");
    }
  };

  return (
    <Button onClick={handleLogout} className="cursor-pointer">
      ログアウト
    </Button>
  );
}
