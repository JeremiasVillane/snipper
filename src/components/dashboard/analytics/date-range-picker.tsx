"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DateRange } from "react-day-picker";

export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialFrom = searchParams.get("from");
  const initialTo = searchParams.get("to");

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (initialFrom && initialTo) {
      const fromDate = new Date(initialFrom);
      const toDate = new Date(initialTo);

      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        return { from: fromDate, to: toDate };
      }
    }
    return undefined;
  });

  const updateURL = (selectedDate: DateRange | undefined) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (selectedDate?.from && selectedDate?.to) {
      current.set("from", format(selectedDate.from, "yyyy-MM-dd"));
      current.set("to", format(selectedDate.to, "yyyy-MM-dd"));
    } else {
      current.delete("from");
      current.delete("to");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    updateURL(selectedDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(undefined)}
            >
              Clear selection
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
