"use client";

import LogoutButton from "@/components/LogoutButton";
import WorkToggleButton from "@/components/WorkToggleButton";
import { useUser } from "@supabase/auth-helpers-react";

export default function Home() {
  const user = useUser();
  
  return (
    <main>
      <div>勤怠管理アプリ</div>
      <WorkToggleButton/>
      {user && <LogoutButton />}
    </main>
  );
}
