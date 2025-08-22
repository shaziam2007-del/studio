'use server';

/**
 * @fileOverview AI-powered event slot suggestion flow.
 *
 * - suggestEventSlots - A function that suggests potential event slots based on user schedule and preferences.
 * - SuggestEventSlotsInput - The input type for the suggestEventSlots function.
 * - SuggestEventSlotsOutput - The return type for the suggestEventSlots function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEventSlotsInputSchema = z.object({
  schedule: z
    .string()
    .describe('The user schedule, in iCalendar format (ics).'),
  durationMinutes: z
    .number()
    .describe('The duration of the event in minutes.'),
  preferences: z
    .string()
    .describe('The user preferences for event scheduling.'),
});
export type SuggestEventSlotsInput = z.infer<typeof SuggestEventSlotsInputSchema>;

const SuggestEventSlotsOutputSchema = z.object({
  suggestedSlots: z
    .string()
    .array()
    .describe('Array of suggested event slots, in iCalendar format (ics).'),
});
export type SuggestEventSlotsOutput = z.infer<typeof SuggestEventSlotsOutputSchema>;

export async function suggestEventSlots(input: SuggestEventSlotsInput): Promise<SuggestEventSlotsOutput> {
  return suggestEventSlotsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEventSlotsPrompt',
  input: {schema: SuggestEventSlotsInputSchema},
  output: {schema: SuggestEventSlotsOutputSchema},
  prompt: `You are an AI assistant that suggests potential event slots to a user based on their existing schedule, event duration, and preferences.

  Given the user's schedule in iCalendar format, the duration of the event, and the user preferences, analyze the schedule and suggest 3 possible event slots.

  Output the suggested event slots as iCalendar entries.

  User Schedule (iCalendar format):
  {{{schedule}}}

  Event Duration (minutes):
  {{{durationMinutes}}}

  User Preferences:
  {{{preferences}}}
  `,
});

const suggestEventSlotsFlow = ai.defineFlow(
  {
    name: 'suggestEventSlotsFlow',
    inputSchema: SuggestEventSlotsInputSchema,
    outputSchema: SuggestEventSlotsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
