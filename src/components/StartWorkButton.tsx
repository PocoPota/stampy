"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  onStart: () => void;
};

export default function StartWorkButton({ onStart }: Props) {
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleStartWork = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch("/api/work/start", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error("勤務開始に失敗しました");

      onStart(); // 状態を親に通知
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleStartWork} disabled={loading} className="cursor-pointer">
      {loading ? "記録中..." : "労働開始"}
    </Button>
  );
}
