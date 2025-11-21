import { QuestionsByCategory } from "@/types/onboarding";
import {
  Clock,
  Zap,
  Target,
  CheckCircle2,
  TrendingUp,
  Brain,
  Heart,
  Battery,
  Users,
} from "lucide-react";

export const onboardingQuestions: QuestionsByCategory = {

  // ENTRY QUESTIONS (Always asked)
  primary_role: {
    id: "primary_role",
    title: "What brings you to TaskGenie?",
    description:
    "Understanding your primary focus helps us personalize your experience.",
    type: "multiple-choice",
    category: "context",
    options: [
      "Managing work projects",
      "Personal goals & habits",
      "Academic/Learning goals",
      "Side hustle/Business",
      "Life admin & household",
      "Mix of everything",
    ],
    icon: Target,
    aiPrompt:
      "Analyze the user's primary role and life context. What does this tell you about their priorities, time constraints, and stress factors?",
  },

  typical_day: {
    id: "typical_day",
    title: "Describe your typical day in one word",
    description:
      "There's no wrong answer - we want to understand your reality.",
    type: "multiple-choice",
    category: "context",
    options: [
      "Structured & predictable",
      "Busy & chaotic",
      "Flexible & varied",
      "Slow-paced & steady",
      "Intense & demanding",
      "Unpredictable",
    ],
    icon: Clock,
    aiPrompt:
      "This reveals their control over their schedule, stress levels, and need for flexibility vs structure. What personality traits and challenges does this suggest?",
    followUpTriggers: {
      "Busy & chaotic": ["stress_response", "energy_patterns"],
      "Structured & predictable": ["planning_style", "motivation"],
      Unpredictable: ["stress_response", "adaptability"],
    },
  },

  // WORK STYLE QUESTIONS
  work_pattern: {
    id: "work_pattern",
    title: "When do you do your best work?",
    description:
      "Understanding your natural rhythm helps us schedule tasks optimally.",
    type: "multiple-choice",
    category: "workstyle",
    options: [
      "Early morning (5am-9am)",
      "Late morning (9am-12pm)",
      "Afternoon (12pm-5pm)",
      "Evening (5pm-9pm)",
      "Late night (9pm-2am)",
      "It varies greatly",
    ],
    icon: Battery,
    aiPrompt:
      "Determine their energy pattern (Lark/Night Owl/Dual Peak). How does this affect their productivity and what scheduling strategies would work best?",
  },

  focus_style: {
    id: "focus_style",
    title: "How do you prefer to tackle your work?",
    description: "Everyone has a unique focus style.",
    type: "multiple-choice",
    category: "workstyle",
    options: [
      "Long, uninterrupted focus sessions",
      "Short bursts with frequent breaks",
      "Switch between different tasks",
      "One thing until it's completely done",
      "Whatever feels right that day",
    ],
    icon: Zap,
    aiPrompt:
      "This reveals their focus profile (Deep Worker/Task Switcher/Flow Seeker/Pomodoro). What does this tell you about their attention span and optimal work structure?",
  },

  // PSYCHOLOGY QUESTIONS
  past_attempts: {
    id: "past_attempts",
    title: "You've probably tried other productivity tools before...",
    description: "What usually happens?",
    type: "multiple-choice",
    category: "psychology",
    options: [
      "Start strong, but lose momentum",
      "Too complex, gave up quickly",
      "Worked great, then life got busy",
      "Never stuck with one long enough",
      "Actually haven't tried any",
      "Still using others successfully",
    ],
    icon: TrendingUp,
    aiPrompt:
      "Critical for understanding their consistency level, self-discipline, and what causes them to abandon systems. What personality traits and procrastination tendencies does this reveal?",
    followUpTriggers: {
      "Start strong, but lose momentum": ["motivation", "accountability"],
      "Too complex, gave up quickly": [
        "simplicity_preference",
        "learning_style",
      ],
      "Never stuck with one long enough": ["motivation", "commitment_style"],
    },
  },

  stress_response: {
    id: "stress_response",
    title: "When you're overwhelmed, you typically...",
    description:
      "Understanding how you handle stress helps us support you better.",
    type: "multiple-choice",
    category: "psychology",
    options: [
      "Make a plan and tackle it systematically",
      "Avoid it and do easier things first",
      "Power through everything at once",
      "Ask for help or talk it through",
      "Feel paralyzed, don't know where to start",
      "Take a break and come back refreshed",
    ],
    icon: Heart,
    aiPrompt:
      "This reveals their stress response type (Problem Solver/Avoider/Support Seeker/Systematic). What does this tell you about their resilience, coping strategies, and burnout risk?",
  },

  decision_speed: {
    id: "decision_speed",
    title: "When making decisions about what to work on...",
    description: "How do you typically choose?",
    type: "multiple-choice",
    category: "psychology",
    options: [
      "I plan everything in advance",
      "I go with my gut feeling",
      "I analyze all options carefully",
      "I ask others for input",
      "Whatever feels urgent at the moment",
      "I struggle to decide and procrastinate",
    ],
    icon: Brain,
    aiPrompt:
      "This shows their decision-making style (Analytical/Intuitive/Collaborative/Decisive). How does this affect their planning approach and task execution?",
  },

  // MOTIVATION QUESTIONS
  motivation: {
    id: "motivation",
    title: "What drives you to get things done?",
    description: "Select what resonates most with you.",
    type: "multiple-choice",
    category: "motivation",
    options: [
      "Checking things off my list (Achievement)",
      "Having control over my time (Autonomy)",
      "Making meaningful impact (Purpose)",
      "Learning and growing (Mastery)",
      "Recognition from others (Social)",
      "Rewards and benefits (Incentive)",
    ],
    icon: Target,
    aiPrompt:
      "Identify their primary motivation driver. This is crucial for how we frame tasks, reminders, and celebrate wins. What gamification/encouragement strategies would work best?",
  },

  // SELF-AWARENESS QUESTIONS
  self_assessment: {
    id: "self_assessment",
    title: "Be honest - how would you describe yourself?",
    description: "No judgment, just helping us understand you.",
    type: "multi-select",
    category: "psychology",
    options: [
      "Perfectionist (high standards)",
      "Procrastinator (last-minute rush)",
      "Consistent (steady progress)",
      "Impulsive (act first, think later)",
      "Planner (loves organizing)",
      "Flexible (goes with the flow)",
    ],
    icon: Users,
    aiPrompt:
      "Self-reported behavioral tendencies - reveals self-awareness and major personality traits. How do these combine to create their unique profile?",
  },

  energy_patterns: {
    id: "energy_patterns",
    title: "Throughout the day, your energy levels...",
    description: "Think about a typical weekday.",
    type: "multiple-choice",
    category: "workstyle",
    options: [
      "Start high, gradually decline",
      "Start low, build up through morning",
      "Peak in morning, dip after lunch, peak again",
      "Steady throughout the day",
      "Low until afternoon/evening",
      "Completely unpredictable",
    ],
    icon: Battery,
    aiPrompt:
      "Detailed energy pattern helps schedule demanding vs easy tasks. How does this correlate with their stated peak productivity time?",
  },

  // FOLLOW-UP QUESTIONS (Asked conditionally)
  planning_style: {
    id: "planning_style",
    title: "When starting something new, do you...",
    description: "There's no right way - just your way.",
    type: "multiple-choice",
    category: "workstyle",
    options: [
      "Plan every detail before starting",
      "Outline basics, figure out rest as I go",
      "Jump in and learn by doing",
      "Research extensively first",
    ],
    icon: Brain,
    aiPrompt:
      "Shows detail orientation, planning horizon, and structure preference. How should we present task breakdowns to them?",
  },

  accountability: {
    id: "accountability",
    title: "What helps you stay on track?",
    description: "How do you maintain momentum?",
    type: "multi-select",
    category: "motivation",
    options: [
      "External deadlines",
      "Sharing goals with others",
      "Tracking progress visually",
      "Rewards/consequences",
      "Just personal commitment",
      "Regular check-ins/reminders",
    ],
    icon: CheckCircle2,
    aiPrompt:
      "Reveals accountability needs and what features will be most effective for them. What level of external support do they need?",
  },

  simplicity_preference: {
    id: "simplicity_preference",
    title: "When using an app, you prefer...",
    description: "How much detail do you like?",
    type: "multiple-choice",
    category: "psychology",
    options: [
      "Simple and minimal",
      "Detailed with lots of options",
      "Customizable to my needs",
      "Guided with smart defaults",
    ],
    icon: Zap,
    aiPrompt:
      "This affects how we present features and the AI questioning depth. Do they want control or simplicity?",
  },

  adaptability: {
    id: "adaptability",
    title: "When plans change unexpectedly...",
    description: "How do you typically react?",
    type: "multiple-choice",
    category: "psychology",
    options: [
      "Easily adapt and replan",
      "Feel stressed but adjust",
      "Struggle to switch gears",
      "Prefer to stick to original plan",
    ],
    icon: TrendingUp,
    aiPrompt:
      "Measures adaptability level - crucial for how rigid vs flexible their scheduling should be.",
  },

  learning_style: {
    id: "learning_style",
    title: "You learn best through...",
    description: "How do you prefer to absorb new information?",
    type: "multiple-choice",
    category: "psychology",
    options: [
      "Reading and writing",
      "Listening and discussing",
      "Doing and experimenting",
      "Visual diagrams and videos",
    ],
    icon: Brain,
    aiPrompt:
      "Determines their learning style - affects how we present tips, tutorials, and coaching content.",
  },

  commitment_style: {
    id: "commitment_style",
    title: "When you commit to something, you...",
    description: "What's your typical pattern?",
    type: "multiple-choice",
    category: "psychology",
    options: [
      "All-in until it's done",
      "Steady progress over time",
      "Intense bursts, then breaks",
      "Often start strong, then fade",
    ],
    icon: Heart,
    aiPrompt:
      "Shows their consistency level and how to pace their tasks to match their natural commitment rhythm.",
  },
}


// export const onboardingQuestions: Question[] = [
//   {
//     id: "when",
//     title: "When do you want to work on this?",
//     description: "Understanding your preferred timing helps us schedule tasks perfectly.",
//     type: "multiple-choice",
//     options: ["Morning (5am-12pm)", "Afternoon (12pm-5pm)", "Evening (5pm-9pm)", "Night (9pm+)", "Anytime"],
//     icon: Clock,
//     validation: { required: true },
//   },
//   {
//     id: "duration",
//     title: "How much time can you dedicate daily?",
//     description: "This helps us break tasks into realistic chunks (in minutes).",
//     type: "slider",
//     icon: Zap ,
//     validation: { required: true, min: 15, max: 480 },
//   },
//   {
//     id: "location",
//     title: "Where will you work on this?",
//     description: "Context matters for task optimization.",
//     type: "multiple-choice", // ✅ Keep as multiple-choice for now (single selection)
//     options: ["Home", "Office", "Cafe", "Library", "Hybrid"],
//     icon: MapPin,
//     validation: { required: true },
//   },
//   {
//     id: "energy",
//     title: "What's your typical energy level?",
//     description: "We'll schedule demanding tasks when you're most productive.",
//     type: "multiple-choice",
//     options: ["Low", "Moderate", "High", "Variable"],
//     icon: Sparkles,
//     validation: { required: true },
//   },
//   {
//     id: "deadline",
//     title: "What's your target deadline?",
//     description: "Help us create a realistic timeline.",
//     type: "date",
//     icon: Calendar,
//     validation: { required: true },
//   },
// ]
