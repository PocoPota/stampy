"use client";

import HourlyRateForm from "@/components/HourlyRateForm";
import LogoutButton from "@/components/LogoutButton";
import WorkToggleButton from "@/components/WorkToggleButton";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import SummaryCard from "@/components/SummaryCard";
import SummaryTabs from "@/components/SummaryTabs";

export default function Home() {
  const user = useUser();

  return (
    <main className="flex flex-col gap-3">
      <section className="text-center mt-5">
        <WorkToggleButton />
      </section>
      <section>
        <SummaryTabs/>
      </section>
      <section>
        <SummaryCard/>
      </section>
      <section>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>時給の更新</AccordionTrigger>
            <AccordionContent>
              <HourlyRateForm/>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>ログアウト</AccordionTrigger>
            <AccordionContent>
              {user && <LogoutButton/>}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}
