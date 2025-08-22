"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Sparkles, Trash2, Clock, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { getAiSuggestions } from "@/lib/actions";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  category: z.enum(["work", "personal", "study", "other"]),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  event: Event | null;
  onSave: (data: Omit<Event, "id">, id?: string) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  currentDate: Date;
}

export function EventForm({
  event,
  onSave,
  onDelete,
  onCancel,
  currentDate
}: EventFormProps) {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [aiSuggestions, setAiSuggestions] = React.useState<string[]>([]);
  const [aiPreferences, setAiPreferences] = React.useState("Find a slot in the afternoon.");
  const [duration, setDuration] = React.useState("60");


  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      date: event?.start || currentDate,
      startTime: event ? format(event.start, "HH:mm") : "09:00",
      endTime: event ? format(event.end, "HH:mm") : "10:00",
      category: event?.category || "work",
    },
  });

  const onSubmit = (data: EventFormValues) => {
    const [startHours, startMinutes] = data.startTime.split(":").map(Number);
    const [endHours, endMinutes] = data.endTime.split(":").map(Number);

    const start = new Date(data.date);
    start.setHours(startHours, startMinutes, 0, 0);

    const end = new Date(data.date);
    end.setHours(endHours, endMinutes, 0, 0);

    onSave({ title: data.title, start, end, category: data.category }, event?.id);
  };
  
  const handleGetAiSuggestions = async () => {
    setIsAiLoading(true);
    setAiSuggestions([]);
    
    // For demo, we'll use an empty schedule. In a real app, this would be the user's actual calendar data.
    const fakeIcsSchedule = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TimeForge//EN
END:VCALENDAR`;

    const result = await getAiSuggestions({
      schedule: fakeIcsSchedule,
      durationMinutes: parseInt(duration, 10),
      preferences: aiPreferences,
    });
    setIsAiLoading(false);

    if (result.success) {
      setAiSuggestions(result.suggestions);
      if (result.suggestions.length === 0) {
        toast({ title: "No slots found", description: "AI couldn't find any matching slots. Try different preferences.", variant: "destructive" });
      }
    } else {
      toast({ title: "AI Error", description: result.error, variant: "destructive" });
    }
  };

  const applySuggestion = (icsData: string) => {
    // Basic ICS parser for DTSTART and DTEND
    const startDateMatch = /DTSTART(?:;TZID=.*)?:(\d{8}T\d{6})/.exec(icsData);
    const endDateMatch = /DTEND(?:;TZID=.*)?:(\d{8}T\d{6})/.exec(icsData);
    if(startDateMatch && endDateMatch) {
      const parseDate = (t: string) => new Date(`${t.slice(0,4)}-${t.slice(4,6)}-${t.slice(6,8)}T${t.slice(9,11)}:${t.slice(11,13)}:${t.slice(13,15)}`);
      const start = parseDate(startDateMatch[1]);
      const end = parseDate(endDateMatch[1]);
      form.setValue('date', start);
      form.setValue('startTime', format(start, "HH:mm"));
      form.setValue('endTime', format(end, "HH:mm"));
      toast({ title: "Time applied!", description: "The suggested time has been set." });
    }
  };


  return (
    <>
      <DialogHeader>
        <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        <DialogDescription>
          {event ? "Update the details of your event." : "Fill in the details for your new event."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Controller
              name="date"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
             <Controller
              name="category"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" type="time" {...form.register("startTime")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" type="time" {...form.register("endTime")} />
          </div>
        </div>

        <div className="space-y-2 rounded-lg border p-4 bg-background/50">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" /> AI Scheduler</h3>
            <p className="text-sm text-muted-foreground">Let AI find the perfect time for your event.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label htmlFor="duration">Duration (minutes)</Label>
                 <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 60"/>
              </div>
               <div className="space-y-2">
                 <Label htmlFor="preferences">Preferences</Label>
                 <Textarea id="preferences" value={aiPreferences} onChange={(e) => setAiPreferences(e.target.value)} placeholder="e.g., Morning, not on Mondays" className="h-[40px]"/>
              </div>
            </div>
            <Button type="button" variant="outline" onClick={handleGetAiSuggestions} disabled={isAiLoading}>
              {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Suggest Times
            </Button>
            {aiSuggestions.length > 0 && (
              <div className="mt-2 space-y-2">
                  <Label>Suggestions:</Label>
                  <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((s, i) => {
                        const start = /DTSTART(?:;TZID=.*)?:(\d{8}T\d{6})/.exec(s);
                        const end = /DTEND(?:;TZID=.*)?:(\d{8}T\d{6})/.exec(s);
                        if (!start || !end) return null;
                        const startTime = `${start[1].slice(9,11)}:${start[1].slice(11,13)}`;
                        const endTime = `${end[1].slice(9,11)}:${end[1].slice(11,13)}`;

                        return (
                          <Button key={i} type="button" variant="ghost" className="bg-accent/30 hover:bg-accent/60" onClick={() => applySuggestion(s)}>
                             <Clock className="mr-2 h-4 w-4" /> {format(new Date(form.getValues('date')), 'MMM d')}, {startTime} - {endTime}
                          </Button>
                        )
                      })}
                  </div>
              </div>
            )}
        </div>


        <DialogFooter className="pt-4">
          {event && (
            <Button type="button" variant="destructive" onClick={() => onDelete(event.id)} className="mr-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </>
  );
}
