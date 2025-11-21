// import { z } from "zod";

// export const onboardingFormSchema = z.object({
//   when: z.string().min(1, "Please select a time preference"),
//   duration: z.number().min(15, "Minimum 15 minutes").max(480, "Maximum 8 hours"),
//   location: z.string().min(1, "Please select at least one location"),
//   energy: z.string().min(1, "Please select your energy level"),
//   deadline: z.date().min(new Date(), "Deadline must be in the future"),
//   goals: z.string().optional().nullable(),
// });

// export type OnboardingFormSchemaType = z.infer<typeof onboardingFormSchema>;


import { z } from "zod";

export const onboardingFormSchema = z.object({
  // Entry questions (REQUIRED)
  primary_role: z.string().min(1, "Please select your primary role"),
  typical_day: z.string().min(1, "Please describe your typical day"),
  
  // Work style questions (REQUIRED)
  work_pattern: z.string().min(1, "Please select your work pattern"),
  focus_style: z.string().min(1, "Please select your focus style"),
  
  // Psychology questions (REQUIRED)
  past_attempts: z.string().min(1, "Please select an option"),
  stress_response: z.string().min(1, "Please select how you handle stress"),
  decision_speed: z.string().min(1, "Please select your decision style"),
  
  // Motivation questions (REQUIRED)
  motivation: z.string().min(1, "Please select what drives you"),
  
  // Self-awareness questions (REQUIRED)
  self_assessment: z.array(z.string()).min(1, "Please select at least one trait"),
  energy_patterns: z.string().min(1, "Please describe your energy patterns"),
  
  // Follow-up questions (OPTIONAL - only validate if provided)
  planning_style: z.string().optional().or(z.literal("")),
  accountability: z.array(z.string()).optional().default([]),
  simplicity_preference: z.string().optional().or(z.literal("")),
  adaptability: z.string().optional().or(z.literal("")),
  learning_style: z.string().optional().or(z.literal("")),
  commitment_style: z.string().optional().or(z.literal("")),
});

export type OnboardingFormSchemaType = z.infer<typeof onboardingFormSchema>;