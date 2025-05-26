"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoginButton from "./LoginButton";

export default function Header() {
  const user = useUser();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white">
      <h1 className="text-xl font-bold text-gray-800">
        <Link href={"/"}>Stampy</Link>
      </h1>

      <div>
        {!user ? (
          <LoginButton/>
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
