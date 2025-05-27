"use client";

import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import {
  parseISO,
  format,
  getISOWeek,
  startOfISOWeek,
  endOfISOWeek,
} from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

type Grouping = "day" | "week" | "month";

interface WorkRecord {
  startTime: string;
  endTime: string | null;
  hourlyRate: number;
  wage: number | null;
}

interface SummaryRow {
  period: string;
  totalMinutes: number;
  totalWage: number;
}

export default function SummaryTabs() {
  const user = useUser();
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [grouped, setGrouped] = useState<Record<Grouping, SummaryRow[]>>({
    day: [],
    week: [],
    month: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("WorkRecord")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error("Failed to fetch:", error);
        return;
      }

      const recs = data as WorkRecord[];
      setRecords(recs);

      const groups: Record<Grouping, Record<string, SummaryRow>> = {
        day: {},
        week: {},
        month: {},
      };

      recs.forEach((r) => {
        if (!r.endTime) return;

        const start = parseISO(r.startTime);
        const end = parseISO(r.endTime);
        const minutes = (end.getTime() - start.getTime()) / 60000;
        const wage = r.wage ?? (minutes / 60) * r.hourlyRate;

        const keys = {
          day: format(start, "yyyy-MM-dd"),
          week: `Week ${getISOWeek(start)} (${format(startOfISOWeek(start), "MM/dd")} - ${format(endOfISOWeek(start), "MM/dd")})`,
          month: format(start, "yyyy-MM"),
        };

        (["day", "week", "month"] as Grouping[]).forEach((key) => {
          const period = keys[key];
          if (!groups[key][period]) {
            groups[key][period] = {
              period,
              totalMinutes: 0,
              totalWage: 0,
            };
          }
          groups[key][period].totalMinutes += minutes;
          groups[key][period].totalWage += wage;
        });
      });

      const sortedGroups: Record<Grouping, SummaryRow[]> = {
        day: Object.values(groups.day).sort((a, b) => b.period.localeCompare(a.period)),
        week: Object.values(groups.week).sort((a, b) => b.period.localeCompare(a.period)),
        month: Object.values(groups.month).sort((a, b) => b.period.localeCompare(a.period)),
      };

      setGrouped(sortedGroups);
    };

    fetchData();
  }, [user]);

  const renderTable = (rows: SummaryRow[]) => (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2">期間</th>
          <th className="py-2">労働時間</th>
          <th className="py-2">給料</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.period} className="border-b">
            <td className="py-2">{r.period}</td>
            <td className="py-2">{(r.totalMinutes / 60).toFixed(2)} 時間</td>
            <td className="py-2">¥{Math.floor(r.totalWage).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 p-4">
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-bold">サマリー</h2>
        <Tabs defaultValue="day">
          <TabsList className="mb-4">
            <TabsTrigger value="day">日別</TabsTrigger>
            <TabsTrigger value="week">週別</TabsTrigger>
            <TabsTrigger value="month">月別</TabsTrigger>
          </TabsList>
          <TabsContent value="day">{renderTable(grouped.day)}</TabsContent>
          <TabsContent value="week">{renderTable(grouped.week)}</TabsContent>
          <TabsContent value="month">{renderTable(grouped.month)}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
