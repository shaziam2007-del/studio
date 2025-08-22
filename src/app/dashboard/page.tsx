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
  CalendarCheck,
  Flame,
} from "lucide-react";
import Image from "next/image";

import type { Event, View } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { EventForm } from "@/components/event-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import Link from "next/link";

const today = startOfToday();
const startOfThisWeek = startOfWeek(today);

const dummyEvents: Event[] = [
  // Sunday (Healthy Routine)
  {
    id: "34",
    title: "Wake up & Meditate",
    start: add(startOfThisWeek, { days: 0, hours: 8, minutes: 0 }),
    end: add(startOfThisWeek, { days: 0, hours: 8, minutes: 30 }),
    category: "personal",
  },
  {
    id: "35",
    title: "Brunch with Family",
    start: add(startOfThisWeek, { days: 0, hours: 11, minutes: 0 }),
    end: add(startOfThisWeek, { days: 0, hours: 12, minutes: 30 }),
    category: "personal",
  },
  {
    id: "36",
    title: "Weekly Review & Plan",
    start: add(startOfThisWeek, { days: 0, hours: 14, minutes: 0 }),
    end: add(startOfThisWeek, { days: 0, hours: 15, minutes: 30 }),
    category: "work",
  },
  {
    id: "37",
    title: "Go for a walk outdoors",
    start: add(startOfThisWeek, { days: 0, hours: 16, minutes: 0 }),
    end: add(startOfThisWeek, { days: 0, hours: 17, minutes: 0 }),
    category: "personal",
  },
  {
    id: "38",
    title: "Prepare for Monday",
    start: add(startOfThisWeek, { days: 0, hours: 18, minutes: 0 }),
    end: add(startOfThisWeek, { days: 0, hours: 19, minutes: 0 }),
    category: "work",
  },
  {
    id: "39",
    title: "Read and Relax",
    start: add(startOfThisWeek, { days: 0, hours: 21, minutes: 0 }),
    end: add(startOfThisWeek, { days: 0, hours: 22, minutes: 0 }),
    category: "personal",
  },
  // Monday
  {
    id: "1",
    title: "Calculus II",
    start: add(startOfThisWeek, { days: 1, hours: 9, minutes: 0 }),
    end: add(startOfThisWeek, { days: 1, hours: 10, minutes: 30 }),
    category: "study",
    completed: true,
  },
  {
    id: "2",
    title: "Physics Lab",
    start: add(startOfThisWeek, { days: 1, hours: 11, minutes: 0 }),
    end: add(startOfThisWeek, { days: 1, hours: 12, minutes: 30 }),
    category: "study",
    completed: false,
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
    completed: true,
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
    completed: false,
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
    completed: true,
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
    completed: true,
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
  // Evening Activities
  {
    id: "17",
    title: "Dinner with family",
    start: add(startOfThisWeek, { days: 1, hours: 18, minutes: 0 }),
    end: add(startOfThisWeek, { days: 1, hours: 19, minutes: 0 }),
    category: "personal",
    completed: true,
  },
  {
    id: "18",
    title: "Read a book",
    start: add(startOfThisWeek, { days: 2, hours: 20, minutes: 0 }),
    end: add(startOfThisWeek, { days: 2, hours: 21, minutes: 0 }),
    category: "personal",
  },
  {
    id: "19",
    title: "Call friends",
    start: add(startOfThisWeek, { days: 3, hours: 19, minutes: 30 }),
    end: add(startOfThisWeek, { days: 3, hours: 20, minutes: 0 }),
    category: "personal",
  },
  {
    id: "20",
    title: "Hobby time: Painting",
    start: add(startOfThisWeek, { days: 4, hours: 18, minutes: 30 }),
    end: add(startOfThisWeek, { days: 4, hours: 19, minutes: 30 }),
    category: "personal",
  },
  {
    id: "21",
    title: "Movie night",
    start: add(startOfThisWeek, { days: 5, hours: 20, minutes: 0 }),
    end: add(startOfThisWeek, { days: 5, hours: 22, minutes: 0 }),
    category: "personal",
  },
  // Ideal Student Routine
  {
    id: "22",
    title: "Review today's notes",
    start: add(startOfThisWeek, { days: 1, hours: 17, minutes: 0 }),
    end: add(startOfThisWeek, { days: 1, hours: 18, minutes: 0 }),
    category: "study",
  },
  {
    id: "23",
    title: "Assignment Work",
    start: add(startOfThisWeek, { days: 2, hours: 17, minutes: 30 }),
    end: add(startOfThisWeek, { days: 2, hours: 19, minutes: 0 }),
    category: "work",
  },
  {
    id: "24",
    title: "Dinner",
    start: add(startOfThisWeek, { days: 2, hours: 19, minutes: 0 }),
    end: add(startOfThisWeek, { days: 2, hours: 19, minutes: 45 }),
    category: "personal",
  },
  {
    id: "25",
    title: "Evening Study Session",
    start: add(startOfThisWeek, { days: 3, hours: 18, minutes: 0 }),
    end: add(startOfThisWeek, { days: 3, hours: 19, minutes: 30 }),
    category: "study",
  },
  {
    id: "26",
    title: "Pack for tomorrow",
    start: add(startOfThisWeek, { days: 4, hours: 21, minutes: 0 }),
    end: add(startOfThisWeek, { days: 4, hours: 21, minutes: 30 }),
    category: "personal",
  },
  {
    id: "27",
    title: "Weekend Planning",
    start: add(startOfThisWeek, { days: 5, hours: 17, minutes: 0 }),
    end: add(startOfThisWeek, { days: 5, hours: 17, minutes: 30 }),
    category: "personal",
  },
  // Saturday (Healthy Routine)
  {
    id: "28",
    title: "Morning Workout",
    start: add(startOfThisWeek, { days: 6, hours: 9, minutes: 0 }),
    end: add(startOfThisWeek, { days: 6, hours: 10, minutes: 0 }),
    category: "personal",
  },
  {
    id: "29",
    title: "Study Session",
    start: add(startOfThisWeek, { days: 6, hours: 10, minutes: 30 }),
    end: add(startOfThisWeek, { days: 6, hours: 12, minutes: 30 }),
    category: "study",
  },
  {
    id: "30",
    title: "Lunch",
    start: add(startOfThisWeek, { days: 6, hours: 13, minutes: 0 }),
    end: add(startOfThisWeek, { days: 6, hours: 14, minutes: 0 }),
    category: "personal",
  },
  {
    id: "31",
    title: "Hobby Time",
    start: add(startOfThisWeek, { days: 6, hours: 15, minutes: 0 }),
    end: add(startOfThisWeek, { days: 6, hours: 17, minutes: 0 }),
    category: "personal",
  },
  {
    id: "32",
    title: "Dinner with Friends",
    start: add(startOfThisWeek, { days: 6, hours: 19, minutes: 0 }),
    end: add(startOfThisWeek, { days: 6, hours: 20, minutes: 30 }),
    category: "personal",
  },
  {
    id: "33",
    title: "Relax",
    start: add(startOfThisWeek, { days: 6, hours: 21, minutes: 0 }),
    end: add(startOfThisWeek, { days: 6, hours: 22, minutes: 0 }),
    category: "personal",
  },
];

const categoryIcons: Record<Event['category'], React.ReactElement> = {
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

const WelcomeScreen = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.5, delay: 2.5 }}
      onAnimationComplete={onFinish}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 100, duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <Image src="https://placehold.co/150x150.png" alt="TimeForge Logo" width={150} height={150} className="rounded-full" data-ai-hint="logo" />
        <h1 className="text-5xl font-bold font-headline">Welcome to TimeForge</h1>
        <p className="text-xl text-muted-foreground">Crafting your perfect schedule...</p>
      </motion.div>
    </motion.div>
  );
};

const DayTable = ({ day, events, onEventClick, onToggleComplete }: { day: Date, events: Event[], onEventClick: (event: Event) => void, onToggleComplete: (eventId: string) => void }) => {
  const dayEvents = events
    .filter((event) => isSameDay(event.start, day))
    .sort((a,b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="rounded-lg border shadow-md bg-white overflow-hidden">
      <div className={cn("p-4 text-lg font-semibold", isToday(day) && "text-primary")}>
        {format(day, "EEEE, MMMM d")}
      </div>
       {dayEvents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Done</TableHead>
                <TableHead className="w-[180px]">Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayEvents.map((event) => (
                <TableRow key={event.id} className={cn(event.completed && "bg-muted/50")}>
                  <TableCell>
                    <Checkbox
                      checked={event.completed}
                      onCheckedChange={() => onToggleComplete(event.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className={cn("font-medium", event.completed && "line-through text-muted-foreground")} onClick={() => onEventClick(event)} >
                    {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                  </TableCell>
                  <TableCell className={cn(event.completed && "line-through text-muted-foreground")} onClick={() => onEventClick(event)}>{event.title}</TableCell>
                  <TableCell onClick={() => onEventClick(event)}>
                    <div className="flex items-center">
                       {categoryIcons[event.category]}
                       <span className="capitalize">{event.category}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
       ) : (
         <p className="p-4 text-muted-foreground">No events scheduled for this day.</p>
       )}
    </div>
  )
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = React.useState(true);
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
      setEvents(events.map((e) => (e.id === id ? { ...event, id, completed: e.completed } : e)));
      toast({ title: "Event Updated!", description: "Your event has been successfully updated." });
    } else {
      const newId = (Math.random() * 1000).toString();
      setEvents([...events, { ...event, id: newId, completed: false }]);
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

  const handleToggleComplete = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ));
    const event = events.find(e => e.id === eventId);
    if (event && !event.completed) {
      toast({ title: "Task Complete!", description: `Great job on finishing "${event.title}"!` });
    }
  };

  const openEventForm = (event?: Event) => {
    setSelectedEvent(event || null);
    setIsFormOpen(true);
  };
  
  React.useEffect(() => {
    const handler = setInterval(() => {
      const now = new Date();
      events.forEach(event => {
        if (event.completed) return;
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


  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }
  
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
           <Link href="/streaks">
            <Button variant="outline" className="shadow-md">
                <Flame className="mr-2 h-4 w-4" /> Streaks
            </Button>
          </Link>
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
                      className={cn("w-full text-left p-1 rounded-md text-xs mb-1 truncate", categoryColors[event.category], event.completed && "opacity-50 line-through")}
                    >
                      <Checkbox checked={!!event.completed} className="mr-2" onClick={(e) => {e.stopPropagation(); handleToggleComplete(event.id)}}/>
                      {format(event.start, "ha")} {event.title}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      
      {view === 'day' && (
        <ScrollArea className="flex-1">
            <DayTable day={currentDate} events={events} onEventClick={openEventForm} onToggleComplete={handleToggleComplete} />
        </ScrollArea>
      )}

      {view === 'week' && (
        <ScrollArea className="flex-1">
           <div className="space-y-6">
             {weekDays.map(day => (
                <DayTable key={day.toString()} day={day} events={events} onEventClick={openEventForm} onToggleComplete={handleToggleComplete} />
             ))}
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
