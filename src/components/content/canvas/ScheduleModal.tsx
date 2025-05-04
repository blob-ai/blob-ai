
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (content: string, date: Date) => void;
  content: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  content,
}) => {
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [timeHours, setTimeHours] = useState("12");
  const [timeMinutes, setTimeMinutes] = useState("00");
  const [timeAmPm, setTimeAmPm] = useState<"AM" | "PM">("PM");

  // Create the full scheduled date with time
  const getScheduledDateTime = (): Date => {
    const scheduledDate = new Date(scheduleDate);
    
    let hours = parseInt(timeHours, 10);
    const minutes = parseInt(timeMinutes, 10);
    
    // Convert to 24-hour format
    if (timeAmPm === "PM" && hours < 12) {
      hours += 12;
    } else if (timeAmPm === "AM" && hours === 12) {
      hours = 0;
    }
    
    scheduledDate.setHours(hours, minutes, 0);
    return scheduledDate;
  };

  const handleSubmit = () => {
    const scheduledDateTime = getScheduledDateTime();
    
    // Validate that the scheduled time is in the future
    if (scheduledDateTime <= new Date()) {
      toast.error("Please select a future date and time");
      return;
    }
    
    onSchedule(content, scheduledDateTime);
    onClose();
    toast.success(`Content scheduled for ${format(scheduledDateTime, "PPP 'at' h:mm a")}`);
  };

  // Generate time options
  const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? "12" : String(i + 1).padStart(2, "0")));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#12141A] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Schedule Content</DialogTitle>
          <DialogDescription className="text-white/70">
            Select when you want this content to be published.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block">
              <CalendarIcon className="h-4 w-4 inline-block mr-2" />
              Date
            </label>
            <div className="border border-white/10 rounded-md overflow-hidden">
              <Calendar
                mode="single"
                selected={scheduleDate}
                onSelect={(date) => date && setScheduleDate(date)}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className={cn("p-3 pointer-events-auto rounded-md border border-white/10 bg-[#222733]")}
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 block">
              <Clock className="h-4 w-4 inline-block mr-2" />
              Time
            </label>
            <div className="flex space-x-2">
              <select
                value={timeHours}
                onChange={(e) => setTimeHours(e.target.value)}
                className="bg-[#222733] border border-white/10 rounded-md px-3 py-1 flex-1"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span className="text-white/70 flex items-center">:</span>
              <select
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
                className="bg-[#222733] border border-white/10 rounded-md px-3 py-1 flex-1"
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <select
                value={timeAmPm}
                onChange={(e) => setTimeAmPm(e.target.value as "AM" | "PM")}
                className="bg-[#222733] border border-white/10 rounded-md px-3 py-1 flex-1"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-white/10 pt-4">
          <Button variant="outline" onClick={onClose} className="border-white/10">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500">
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
