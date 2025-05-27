"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { format, differenceInMinutes } from "date-fns";

interface WorkRecord {
  id: string;
  startTime: string;
  endTime: string | null;
  description: string;
  hourlyRate: number;
  wage: number | null;
}

export default function SummaryCard() {
  const user = useUser();
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalWage, setTotalWage] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("WorkRecord")
        .select("*")
        .eq("userId", user.id)
        .order("startTime", { ascending: false });

      if (error) {
        console.error("Error fetching records:", error);
        return;
      }

      const recordsWithWage = data as WorkRecord[];

      let minutes = 0;
      let wage = 0;

      recordsWithWage.forEach((record) => {
        if (record.endTime) {
          const start = new Date(record.startTime);
          const end = new Date(record.endTime);
          const duration = differenceInMinutes(end, start);
          minutes += duration;
          wage += record.wage ?? (duration / 60) * record.hourlyRate;
        }
      });

      setRecords(recordsWithWage);
      setTotalMinutes(minutes);
      setTotalWage(Math.floor(wage));
    };

    fetchRecords();
  }, [user]);

  const totalHours = (totalMinutes / 60).toFixed(2);

  return (
    <Card className="w-full max-w-3xl mx-auto p-6 shadow-md rounded-2xl">
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-bold">これまでの労働まとめ</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">総労働時間</p>
            <p className="text-xl font-semibold">{totalHours} 時間</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">総支給額</p>
            <p className="text-xl font-semibold">¥{totalWage.toLocaleString()}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">直近の記録</p>
          <ul className="mt-2 space-y-2">
            {records.slice(0, 5).map((r) => (
              <li key={r.id} className="text-sm text-gray-700">
                {format(new Date(r.startTime), "MM/dd HH:mm")} -{" "}
                {r.endTime ? format(new Date(r.endTime), "HH:mm") : "進行中"}｜
                ¥{(r.wage ?? 0).toLocaleString()}｜{r.description || "（無記入）"}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
