"use client";

import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
  startOfMonth,
  setDate,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Briefcase,
  User,
  BookOpen,
  MoreHorizontal,
  Clock,
} from "lucide-react";

import type { Event, View } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { EventForm } from "@/components/event-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const today = startOfToday();
const startOfThisWeek = startOfWeek(today);

const dummyEvents: Event[] = [
  // Monday
  {
    id: "1",
    title: "Calculus II",
    start: add(startOfThisWeek, { days: 1, hours: 9, minutes: 0 }),
    end: add(startOfThisWeek, { days: 1, hours: 10, minutes: 30 }),
    category: "study",
  },
  {
    id: "2",
    title: "Physics Lab",
    start: add(startOfThisWeek, { days: 1, hours: 11, minutes: 0 }),
    end: add(startOfThisWeek, { days: 1, hours: 12, minutes: 30 }),
    category: "study",
  },
  {
    id: "3",
    title: "Lunch with Mentor",
    start: add(startOfThisWeek, { days: 1, hours: 13, minutes: 0 }),
    end: add(startOfThisWeek, { days: 1, hours: 14, minutes: 0 }),
    category: "personal",
  },
  {
    id: "4",
    title: "English Literature Seminar",
    start: add(startOfThisWeek, { days: 1, hours: 14, minutes: 0 }),
    end: add(startOfThisWeek, { days: 1, hours: 15, minutes: 30 }),
    category: "study",
  },
  // Tuesday
  {
    id: "5",
    title: "Computer Science Lecture",
    start: add(startOfThisWeek, { days: 2, hours: 8, minutes: 30 }),
    end: add(startOfThisWeek, { days: 2, hours: 10, minutes: 0 }),
    category: "study",
  },
  {
    id: "6",
    title: "Part-time Job",
    start: add(startOfThisWeek, { days: 2, hours: 13, minutes: 0 }),
    end: add(startOfThisWeek, { days: 2, hours: 15, minutes: 0 }),
    category: "work",
  },
  {
    id: "7",
    title: "History of Arts",
    start: add(startOfThisWeek, { days: 2, hours: 15, minutes: 0 }),
    end: add(startOfThisWeek, { days: 2, hours: 16, minutes: 30 }),
    category: "study",
  },
  // Wednesday
  {
    id: "8",
    title: "Calculus II Tutorial",
    start: add(startOfThisWeek, { days: 3, hours: 9, minutes: 0 }),
    end: add(startOfThisWeek, { days: 3, hours: 10, minutes: 30 }),
    category: "study",
  },
  {
    id: "9",
    title: "Gym Session",
    start: add(startOfThisWeek, { days: 3, hours: 11, minutes: 0 }),
    end: add(startOfThisWeek, { days: 3, hours: 12, minutes: 0 }),
    category: "personal",
  },
  {
    id: "10",
    title: "Chemistry Lab",
    start: add(startOfThisWeek, { days: 3, hours: 14, minutes: 0 }),
    end: add(startOfThisWeek, { days: 3, hours: 16, minutes: 45 }),
    category: "study",
  },
  // Thursday
  {
    id: "11",
    title: "Computer Science Lab",
    start: add(startOfThisWeek, { days: 4, hours: 10, minutes: 0 }),
    end: add(startOfThisWeek, { days: 4, hours: 11, minutes: 30 }),
    category: "study",
  },
  {
    id: "12",
    title: "Group Project Meeting",
    start: add(startOfThisWeek, { days: 4, hours: 13, minutes: 0 }),
    end: add(startOfThisWeek, { days: 4, hours: 14, minutes: 30 }),
    category: "work",
  },
  {
    id: "13",
    title: "Economics Lecture",
    start: add(startOfThisWeek, { days: 4, hours: 15, minutes: 0 }),
    end: add(startOfThisWeek, { days: 4, hours: 16, minutes: 30 }),
    category: "study",
  },
  // Friday
  {
    id: "14",
    title: "Final Project Presentation Prep",
    start: add(startOfThisWeek, { days: 5, hours: 9, minutes: 0 }),
    end: add(startOfThisWeek, { days: 5, hours: 10, minutes: 30 }),
    category: "work",
  },
  {
    id: "15",
    title: "Foreign Language Class",
    start: add(startOfThisWeek, { days: 5, hours: 11, minutes: 0 }),
    end: add(startOfThisWeek, { days: 5, hours: 12, minutes: 30 }),
    category: "study",
  },
  {
    id: "16",
    title: "Career Services Workshop",
    start: add(startOfThisWeek, { days: 5, hours: 14, minutes: 0 }),
    end: add(startOfThisWeek, { days: 5, hours: 15, minutes: 45 }),
    category: "personal",
  },
];

const categoryIcons = {
  work: <Briefcase className="mr-2 h-4 w-4" />,
  personal: <User className="mr-2 h-4 w-4" />,
  study: <BookOpen className="mr-2 h-4 w-4" />,
  other: <MoreHorizontal className="mr-2 h-4 w-4" />,
};

const categoryColors = {
  work: "bg-blue-100 border-blue-300 text-blue-800",
  personal: "bg-green-100 border-green-300 text-green-800",
  study: "bg-purple-100 border-purple-300 text-purple-800",
  other: "bg-gray-100 border-gray-300 text-gray-800",
};

export default function DashboardPage() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = React.useState(today);
  const [view, setView] = React.useState<View>("week");
  const [events, setEvents] = React.useState<Event[]>(dummyEvents);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  const firstDayOfCurrentMonth = startOfMonth(currentDate);

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayOfCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayOfCurrentMonth)),
  });

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const prev = () => {
    const newDate = add(currentDate, { [view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days']: -1 });
    setCurrentDate(newDate);
  };
  const next = () => {
    const newDate = add(currentDate, { [view === 'month' ? 'months' : view === 'week' ? 'weeks' : 'days']: 1 });
    setCurrentDate(newDate);
  };
  const goToToday = () => setCurrentDate(today);

  const handleSaveEvent = (event: Omit<Event, "id">, id?: string) => {
    if (id) {
      setEvents(events.map((e) => (e.id === id ? { ...event, id } : e)));
      toast({ title: "Event Updated!", description: "Your event has been successfully updated." });
    } else {
      const newId = (Math.random() * 1000).toString();
      setEvents([...events, { ...event, id: newId }]);
      toast({ title: "Event Created!", description: "Your new event has been added to the schedule." });
    }
    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({ title: "Event Deleted", description: "The event has been removed.", variant: "destructive" });
    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  const openEventForm = (event?: Event) => {
    setSelectedEvent(event || null);
    setIsFormOpen(true);
  };
  
  React.useEffect(() => {
    const handler = setInterval(() => {
      const now = new Date();
      events.forEach(event => {
        const timeDiff = event.start.getTime() - now.getTime();
        if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000 && timeDiff > 4 * 60 * 1000) {
          toast({
            title: "Upcoming Event",
            description: `${event.title} starts in 5 minutes.`,
            action: <Clock className="h-6 w-6" />,
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(handler);
  }, [events, toast]);


  return (
    <div className="flex h-screen w-full flex-col p-4 sm:p-6 lg:p-8 bg-background">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 font-headline">TimeForge</h1>
          <div className="flex items-center gap-2 rounded-md border p-1">
            <Button variant="ghost" size="icon" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>Today</Button>
            <Button variant="ghost" size="icon" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-gray-600">
            {format(currentDate, view === 'month' ? 'MMMM yyyy' : view === 'week' ? 'MMMM yyyy' : 'do MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => openEventForm()} className="shadow-md">
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Button>
        </div>
      </header>

      {view === 'month' && (
      <div className="flex-1 grid grid-cols-7 grid-rows-1 rounded-lg border overflow-hidden shadow-lg bg-white">
        <div className="grid grid-cols-7 col-span-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2 text-center font-semibold text-gray-600 border-b border-r">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 col-span-7 grid-rows-5 flex-1">
          {days.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "p-2 border-r border-b relative flex flex-col",
                !isSameMonth(day, firstDayOfCurrentMonth) && "text-gray-400 bg-gray-50"
              )}
            >
              <time
                dateTime={format(day, "yyyy-MM-dd")}
                className={cn(
                  "text-sm font-medium",
                  isToday(day) && "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                )}
              >
                {format(day, "d")}
              </time>
              <div className="mt-1 flex-1 overflow-y-auto">
                {events
                  .filter((event) => isSameDay(event.start, day))
                  .sort((a,b) => a.start.getTime() - b.start.getTime())
                  .map((event) => (
                    <button
                      key={event.id}
                      onClick={() => openEventForm(event)}
                      className={cn("w-full text-left p-1 rounded-md text-xs mb-1 truncate", categoryColors[event.category])}
                    >
                      {format(event.start, "ha")} {event.title}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {(view === 'week' || view === 'day') && (
        <ScrollArea className="flex-1 rounded-lg border shadow-lg bg-white">
          <div className="grid grid-cols-[auto_1fr]">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white">
              <div className="h-16 border-b border-r"></div>
            </div>
            <div className="sticky top-0 z-20 bg-white grid grid-cols-7 border-b">
              {(view === 'week' ? weekDays : [currentDate]).map(day => (
                <div key={day.toString()} className="p-2 text-center border-r">
                   <p className="text-sm text-gray-500">{format(day, "EEE")}</p>
                   <p className={cn("text-2xl font-semibold", isToday(day) && "text-primary")}>{format(day, "d")}</p>
                </div>
              ))}
            </div>

             {/* Time column */}
            <div className="row-span-full">
                {timeSlots.map(time => (
                    <div key={time} className="h-24 text-right pr-2 pt-1 text-sm text-gray-500 border-r relative">
                       <span className="relative -top-3">{time}</span>
                    </div>
                ))}
            </div>
            
            {/* Events grid */}
            <div className="col-start-2 row-start-2 grid grid-cols-7 relative">
                {/* Grid lines */}
                {timeSlots.map((_, index) => (
                  <React.Fragment key={index}>
                    {Array.from({length: view === 'week' ? 7 : 1}).map((__, dayIndex) => (
                       <div key={dayIndex} className="h-24 border-b border-r"></div>
                    ))}
                  </React.Fragment>
                ))}

                {/* Render events */}
                {events.filter(event => (view === 'week' ? weekDays : [currentDate]).some(d => isSameDay(d, event.start))).map(event => {
                  const startHour = event.start.getHours();
                  const startMinutes = event.start.getMinutes();
                  const endHour = event.end.getHours();
                  const endMinutes = event.end.getMinutes();
                  
                  const top = (startHour + startMinutes / 60) * 96; // 24h * 4rem/h = 96rem
                  const height = ((endHour + endMinutes/60) - (startHour + startMinutes/60)) * 96;
                  
                  const dayIndex = view === 'week' ? getDay(event.start) : 0;
                  const daySpan = view === 'week' ? 7 : 1;
                  
                  return (
                    <button 
                      key={event.id}
                      onClick={() => openEventForm(event)}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `${(dayIndex / daySpan) * 100}%`,
                        width: `${(1 / daySpan) * 100}%`,
                      }}
                      className={cn("absolute p-2 text-left text-xs rounded-lg z-10 overflow-hidden flex flex-col transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02]", categoryColors[event.category])}
                      >
                       <p className="font-bold">{event.title}</p>
                       <p>{format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}</p>
                    </button>
                  )
                })}
            </div>
          </div>
        </ScrollArea>
      )}


      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <EventForm
            event={selectedEvent}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedEvent(null);
            }}
            currentDate={currentDate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
