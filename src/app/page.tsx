"use client";

import LogoutButton from "@/components/LogoutButton";
import WorkToggleButton from "@/components/WorkToggleButton";
import { useUser } from "@supabase/auth-helpers-react";

export default function Home() {
  const user = useUser();

  return (
    <main className="flex flex-col gap-3">
      <section>
        <WorkToggleButton />
      </section>
      <section>{user && <LogoutButton />}</section>
    </main>
  );
}
