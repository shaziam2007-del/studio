"use server";

import {
  suggestEventSlots,
  type SuggestEventSlotsInput,
} from "@/ai/flows/suggest-event-slots";

export async function getAiSuggestions(input: SuggestEventSlotsInput) {
  try {
    const result = await suggestEventSlots(input);
    return {
      success: true,
      suggestions: result.suggestedSlots || [],
    };
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return {
      success: false,
      error: "Failed to get suggestions from AI.",
      suggestions: [],
    };
  }
}
