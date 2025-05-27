"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import StartWorkButton from "./StartWorkButton";
import StopWorkForm from "./StopWorkForm";

export default function WorkToggleButton() {
  const user = useUser();
  const [hasActiveWork, setHasActiveWork] = useState<boolean | null>(null);

  const fetchActiveWork = async () => {
    if (!user) return;

    const res = await fetch(`/api/work/active?userId=${user.id}`);
    const data = await res.json();
    setHasActiveWork(data.active);
  };

  useEffect(() => {
    fetchActiveWork();
  }, [user]);

  if (!user) return null;
  if (hasActiveWork === null) return <p>読み込み中...</p>;

  return hasActiveWork ? (
    <StopWorkForm onComplete={() => setHasActiveWork(false)} />
  ) : (
    <StartWorkButton onStart={() => setHasActiveWork(true)} />
  );
}
