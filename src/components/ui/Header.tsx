"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  const user = useUser();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 shadow-md bg-white">
      <h1 className="text-xl font-bold text-gray-800">Stampy</h1>

      <div>
        {!user ? (
          <Button onClick={handleLogin}>ログイン</Button>
        ) : (
          <Image
            src={user.user_metadata.avatar_url}
            alt="ユーザーアイコン"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </div>
    </header>
  );
}
