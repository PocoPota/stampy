"use client"

import { useUser } from "@supabase/auth-helpers-react";

export default function Home() {
  const user = useUser();
  if (user) {
    console.log("ログイン中:", user.email);
  }
  return <div>勤怠管理アプリ</div>;
}
