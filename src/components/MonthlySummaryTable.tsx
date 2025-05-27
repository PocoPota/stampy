"use client";

import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface MonthlySummary {
  month: string;
  totalMinutes: number;
  totalWage: number;
}

interface WorkRecord {
  startTime: string;
  endTime: string | null;
  hourlyRate: number;
  wage: number | null;
}

export default function MonthlySummaryTable() {
  const user = useUser();
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("WorkRecord")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error("Error fetching records:", error);
        return;
      }

      const records = data as WorkRecord[];

      const monthlyMap: Record<string, MonthlySummary> = {};

      for (const record of records) {
        if (!record.endTime) continue;

        const start = parseISO(record.startTime);
        const end = parseISO(record.endTime);
        const durationMin = (end.getTime() - start.getTime()) / 1000 / 60;
        const wage = record.wage ?? (durationMin / 60) * record.hourlyRate;

        const monthKey = format(start, "yyyy-MM");

        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {
            month: monthKey,
            totalMinutes: 0,
            totalWage: 0,
          };
        }

        monthlyMap[monthKey].totalMinutes += durationMin;
        monthlyMap[monthKey].totalWage += wage;
      }

      const sorted = Object.values(monthlyMap).sort((a, b) => b.month.localeCompare(a.month));
      setMonthlySummaries(sorted);
    };

    fetchMonthlyData();
  }, [user]);

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6 p-4 shadow rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">月別サマリー</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">月</th>
              <th className="py-2">労働時間</th>
              <th className="py-2">給料</th>
            </tr>
          </thead>
          <tbody>
            {monthlySummaries.map((summary) => (
              <tr key={summary.month} className="border-b">
                <td className="py-2">{summary.month}</td>
                <td className="py-2">
                  {(summary.totalMinutes / 60).toFixed(2)} 時間
                </td>
                <td className="py-2">
                  ¥{Math.floor(summary.totalWage).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
