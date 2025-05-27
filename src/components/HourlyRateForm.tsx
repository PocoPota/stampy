"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export default function HourlyRateForm() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("ログインしてください");
      return;
    }

    const rate = parseInt(hourlyRate, 10);
    if (isNaN(rate) || rate < 0) {
      toast.error("正しい時給を入力してください");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/update-hourly-rate", {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        hourlyRate: rate,
      }),
    });

    if (res.ok) {
      toast.success("時給を更新しました");
      setHourlyRate("");
    } else {
      toast.error("更新に失敗しました");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <Input
        type="number"
        value={hourlyRate}
        onChange={(e) => setHourlyRate(e.target.value)}
        placeholder="例: 1500"
        min={0}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "更新中..." : "時給を更新する"}
      </Button>
    </form>
  );
}
