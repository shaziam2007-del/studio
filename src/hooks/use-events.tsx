"use client";

import * as React from 'react';
import type { Event } from '@/lib/types';
import { add, startOfToday, startOfWeek } from 'date-fns';

const today = startOfToday();
const startOfThisWeek = startOfWeek(today);

const initialEvents: Event[] = [
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


const EventsContext = React.createContext<{
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
} | undefined>(undefined);


export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = React.useState<Event[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
          const parsed = JSON.parse(storedEvents);
          // Dates need to be converted back to Date objects from strings
          return parsed.map((e: any) => ({ ...e, start: new Date(e.start), end: new Date(e.end)}));
        }
      }
    } catch (error) {
        console.error("Failed to parse events from local storage", error);
    }
    return initialEvents;
  });
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};


export const useEvents = () => {
    const context = React.useContext(EventsContext);
    if(context === undefined) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
}
