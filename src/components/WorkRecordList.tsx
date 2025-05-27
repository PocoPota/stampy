"use client";

import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkRecord {
  id: string;
  startTime: string;
  endTime: string | null;
  description: string;
  hourlyRate: number;
  wage: number | null;
}

export default function WorkRecordList() {
  const user = useUser();
  const [records, setRecords] = useState<WorkRecord[]>([]);

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

      setRecords(data as WorkRecord[]);
    };

    fetchRecords();
  }, [user]);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">これまでの記録一覧</h2>
        <ScrollArea className="h-[400px] pr-2">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="py-2">日付</th>
                <th className="py-2">時間</th>
                <th className="py-2">内容</th>
                <th className="py-2">給料</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const start = new Date(r.startTime);
                const end = r.endTime ? new Date(r.endTime) : null;
                const timeText = end
                  ? `${format(start, "MM/dd HH:mm")} - ${format(end, "HH:mm")}`
                  : `${format(start, "MM/dd HH:mm")} - 継続中`;

                return (
                  <tr key={r.id} className="border-b">
                    <td className="py-2">{format(start, "yyyy-MM-dd")}</td>
                    <td className="py-2">{timeText}</td>
                    <td className="py-2">{r.description || "（無記入）"}</td>
                    <td className="py-2">¥{(r.wage ?? 0).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
