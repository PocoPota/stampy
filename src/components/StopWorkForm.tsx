"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onComplete: () => void;
};

type ActiveWorkRecord = {
  startTime: string;
  hourlyRate: number;
};

export default function StopWorkForm({ onComplete }: Props) {
  const user = useUser();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [record, setRecord] = useState<ActiveWorkRecord | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!user) return;
      const res = await fetch(`/api/work/active/detail?userId=${user.id}`);
      const data = await res.json();
      if (data.record) setRecord(data.record);
    };
    fetchRecord();
  }, [user]);

  // 経過時間を毎秒更新
  useEffect(() => {
    if (!record) return;

    const interval = setInterval(() => {
      const start = new Date(record.startTime).getTime();
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000); // 秒数
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [record]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}時間 ${m}分 ${s}秒`;
  };

  const wage = record ? Math.floor((elapsed / 3600) * record.hourlyRate) : 0;

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

      onComplete();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (!record) return <p>記録を読み込み中...</p>;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">経過時間:</p>
        <p className="text-lg font-bold">{formatTime(elapsed)}</p>
        <p className="text-sm text-muted-foreground mt-1">現在の報酬:</p>
        <p className="text-lg font-bold">¥{wage.toLocaleString()}</p>
      </div>

      {!showForm ? (
        <Button onClick={handleStopClick}>労働終了</Button>
      ) : (
        <>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="仕事内容を入力してください"
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "記録中..." : "完了"}
          </Button>
        </>
      )}
    </div>
  );
}
