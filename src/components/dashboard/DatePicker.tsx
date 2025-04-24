
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  onClose: () => void;
}

export function DatePicker({ date, setDate, onClose }: DatePickerProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Auto-open popover on mount and handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <Popover open={true}>
      <div style={{ position: 'absolute', left: 0, bottom: '100%', zIndex: 50 }}>
        <PopoverContent ref={popoverRef} className="w-auto p-0" align="start">
          <div className="flex flex-col p-2 gap-2 bg-[#1A1F2C]">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Due Date</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs"
                onClick={() => {
                  setDate(null);
                }}
              >
                Clear
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={(date) => setDate(date)}
              className="p-3 pointer-events-auto rounded-md border border-white/10 bg-[#222733]"
            />
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
