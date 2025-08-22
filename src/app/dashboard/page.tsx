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
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";


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
import { Toaster } from "@/components/ui/toaster";
import { useEvents } from "@/hooks/use-events";

const today = startOfToday();

const categoryIcons: Record<Event['category'], React.ReactElement> = {
  work: <Briefcase className="mr-2 h-4 w-4" />,
  personal: <User className="mr-2 h-4 w-4" />,
  study: <BookOpen className="mr-2 h-4 w-4" />,
  other: <MoreHorizontal className="mr-2 h-4 w-4" />,
};

const categoryColors = {
  work: "bg-red-100 border-red-300 text-red-800",
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
    <div className="rounded-lg border shadow-md bg-card overflow-hidden">
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
  const router = useRouter();
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [currentDate, setCurrentDate] = React.useState(today);
  const [view, setView] = React.useState<View>("week");
  const { events, setEvents } = useEvents();
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
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      console.error("Logout Error: ", error);
      toast({ title: "Logout Failed", description: "Something went wrong.", variant: "destructive" });
    }
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
          <h1 className="text-2xl font-bold text-foreground font-headline">TimeForge</h1>
          <div className="flex items-center gap-2 rounded-md border bg-card p-1">
            <Button variant="ghost" size="icon" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>Today</Button>
            <Button variant="ghost" size="icon" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-muted-foreground">
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
          <Button variant="outline" onClick={handleLogout} className="shadow-md">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      {view === 'month' && (
      <div className="flex-1 grid grid-cols-7 grid-rows-1 rounded-lg border overflow-hidden shadow-lg bg-card">
        <div className="grid grid-cols-7 col-span-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2 text-center font-semibold text-muted-foreground border-b border-r">
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
                !isSameMonth(day, firstDayOfCurrentMonth) && "text-muted-foreground bg-muted/50"
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
      <Toaster />
    </div>
  );
}

    
