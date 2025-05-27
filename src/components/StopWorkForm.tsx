"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onComplete: () => void;
};

export default function StopWorkForm({ onComplete }: Props) {
  const user = useUser();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleStopClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const res = await fetch("/api/work/stop", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          description,
        }),
      });

      if (!res.ok) throw new Error("勤務終了に失敗しました");

      onComplete(); // 状態を親に通知（Startボタンに戻す）
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return <Button onClick={handleStopClick}>労働終了</Button>;
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="仕事内容を入力してください"
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "記録中..." : "完了"}
      </Button>
    </div>
  );
}
