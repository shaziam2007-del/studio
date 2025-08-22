
"use client";

import React, { useState, useEffect } from 'react';
import { Flame, Star, Award, CheckCircle, CalendarDays, Shapes } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Event } from '@/lib/types';
import { isSameDay, subDays, startOfToday } from 'date-fns';

// We'll reuse the dummy data logic for consistency, but in a real app, this would come from a data store.
const today = startOfToday();
const startOfThisWeek = startOfToday();

const dummyEvents: Event[] = [
  // A sample of completed events to calculate streak
  { id: 's1', title: 'Calculus II', start: subDays(today, 1), end: subDays(today, 1), category: 'study', completed: true },
  { id: 's2', title: 'Gym Session', start: subDays(today, 2), end: subDays(today, 2), category: 'personal', completed: true },
  { id: 's3', title: 'Group Project', start: subDays(today, 4), end: subDays(today, 4), category: 'work', completed: true },
  { id: 's4', title: 'Morning Workout', start: subDays(today, 5), end: subDays(today, 5), category: 'personal', completed: true },
  { id: 's5', title: 'Read a book', start: subDays(today, 6), end: subDays(today, 6), category: 'personal', completed: true },
];


const calculateStreak = (events: Event[]): number => {
    let streak = 0;
    let currentDate = today;
    const completedEventDays = new Set(
        events.filter(e => e.completed).map(e => e.start.toDateString())
    );

    // Check if today has a completed task
    if (completedEventDays.has(currentDate.toDateString())) {
        streak++;
        currentDate = subDays(currentDate, 1);
    } else {
        // If today has no completed tasks, check from yesterday
        currentDate = subDays(currentDate, 1);
    }

    while (true) {
        if (completedEventDays.has(currentDate.toDateString())) {
            streak++;
            currentDate = subDays(currentDate, 1);
        } else {
            break; // Streak broken
        }
    }
    return streak;
};


const motivationalMessages = [
    "On fire! Keep up the great work.",
    "Consistency is key. You're nailing it!",
    "Another day, another win. You're unstoppable.",
    "Building great habits, one day at a time.",
    "Your dedication is inspiring. Keep it going!",
];

export default function StreaksPage() {
    const [streak, setStreak] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const currentStreak = calculateStreak(dummyEvents);
        setStreak(currentStreak);
        if (currentStreak > 0) {
            setMessage(motivationalMessages[currentStreak % motivationalMessages.length]);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Card className="shadow-2xl overflow-hidden">
                    <CardHeader className="bg-primary text-primary-foreground p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2, type: 'spring' } }}
                        >
                            <Shapes className="mx-auto h-24 w-24 mb-4 text-orange-300" />
                        </motion.div>
                        <CardTitle className="text-5xl font-bold">{streak} Day Streak!</CardTitle>
                        <CardDescription className="text-primary-foreground/80 text-lg mt-2">{message}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                                <Award className="h-10 w-10 text-yellow-500 mb-2" />
                                <p className="text-2xl font-semibold">15</p>
                                <p className="text-muted-foreground">Total Tasks Completed</p>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                                <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                                <p className="text-2xl font-semibold">5</p>
                                <p className="text-muted-foreground">Longest Streak</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4 text-center">Your Weekly Progress</h3>
                            <div className="flex justify-between items-center gap-2">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                    <div key={index} className="flex flex-col items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{day}</span>
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${index < streak ? 'bg-orange-400' : 'bg-muted'}`}>
                                            {index < streak && <CheckCircle className="h-5 w-5 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <Link href="/dashboard">
                                <Button size="lg" className="shadow-lg">
                                    <CalendarDays className="mr-2 h-5 w-5" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
