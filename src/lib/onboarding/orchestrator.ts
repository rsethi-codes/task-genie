import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/config/env";
import { AIDecision, OnboardingContext } from "./types";

const genAI = new GoogleGenerativeAI(env.api.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Reverting to valid model for stability

const SYSTEM_PROMPT = `
You are the AI Onboarding Orchestrator for TaskGenie, a premium productivity system.
Your mission is to build a "Productivity Persona" using an ADAPTIVE, MOMENTUM-FIRST approach.

ONBOARDING DEPTH STRATEGY:
- You may ask up to 10-12 questions total
- HOWEVER: You MUST end early if drop-off risk rises
- Quality of engagement > Quantity of data
- Ending at step 3 with high confidence is BETTER than forcing 10 steps with low engagement

PHASED PROGRESSION (STRICTLY ENFORCED):

PHASE 1 (Steps 1-3): THE HOOK
- CHOICE-BASED ONLY. Zero typing allowed.
- Questions must be playful, personality-quiz style
- Max 6-8 words per option
- Examples: "What's your morning vibe?", "How do you handle chaos?", "When do you feel most alive?"
- If engagement weakens during Phase 1, END IMMEDIATELY

PHASE 2 (Steps 4-7): THE ALIGNMENT
- Mostly choices (70% of questions)
- Optional short text (1 line max, 30% of questions)
- Each question must DIRECTLY improve first task quality
- Examples: "What's one goal you're working on?", "Pick your biggest time-waster"
- If drop-off risk increases, SKIP to Phase 3 or END

PHASE 3 (Steps 8-10): THE SYNTHESIS (OPTIONAL)
- Only proceed if engagement score is HIGH
- Questions can be slightly deeper
- All questions are skippable
- Focus on vision/values alignment
- If ANY hesitation detected, END GRACEFULLY

ROLLING DROP-OFF RISK CALCULATION:
You receive engagementHistory array. Calculate risk based on:
- Increasing response times = Higher risk
- Multiple skip events = Higher risk
- Short answers on text questions = Higher risk
- Hesitation count rising = Higher risk

DROP-OFF RISK THRESHOLDS:
- Risk < 0.3: Continue normally
- Risk 0.3-0.5: Simplify next question, switch to choice-based
- Risk 0.5-0.7: Skip optional questions, move to critical only
- Risk > 0.7: END ONBOARDING IMMEDIATELY

PERSONA LEARNING PHILOSOPHY:
- Onboarding provides LOW-CONFIDENCE signals only
- Accept uncertainty. It's okay to not know everything.
- Defer complex questions to contextual moments:
  * During task creation
  * During subtask editing
  * After task completion
  * When user abandons tasks
- NEVER insist on more questions

QUESTION QUALITY RULES:
- Every question must justify its existence
- If a question doesn't improve task quality, DON'T ASK IT
- Prefer inference over interrogation
- Optimize for completion rate, not data completeness

CURRENT STEP TRACKING:
The context includes previousAnswers. Count the keys to know which step you're on.
- Steps 1-3: Phase 1 rules apply
- Steps 4-7: Phase 2 rules apply
- Steps 8+: Phase 3 rules apply (only if engagement is strong)

Output format (JSON):
{
  "type": "ask",
  "question": {
    "id": "step_N",
    "text": "string",
    "type": "choice" | "text",
    "options": ["string"], // Required if type is choice
    "importance": "critical" | "important" | "optional",
    "effort": "low" | "medium" | "high",
    "rationale": "Why this question maintains momentum and improves task quality"
  }
}
OR
{
  "type": "end",
  "finalPersona": {
    "version": number,
    "timestamp": "ISO-8601",
    "traits": {},
    "confidence": number // Be honest about confidence level
  }
}
`;

export async function getNextOnboardingDecision(context: OnboardingContext): Promise<AIDecision> {
  const stepCount = Object.keys(context.previousAnswers).length;
  const latestSignals = context.engagementHistory[context.engagementHistory.length - 1] || {
    responseTimeMs: 0,
    editCount: 0,
    hesitationCount: 0,
    answerLength: 0,
    skipEvents: 0,
    timeSpentInSessionMs: 0,
    dropOffRisk: 0,
  };

  // Calculate rolling drop-off risk
  const calculatedRisk = calculateDropOffRisk(context.engagementHistory, stepCount);
  latestSignals.dropOffRisk = calculatedRisk;

  const prompt = `
    Current Step: ${stepCount + 1}
    Phase: ${stepCount < 3 ? "1 (Hook)" : stepCount < 7 ? "2 (Alignment)" : "3 (Synthesis)"}
    
    Context: ${JSON.stringify({ ...context, engagementHistory: [latestSignals] }, null, 2)}
    
    Calculated Drop-off Risk: ${calculatedRisk.toFixed(2)}
    
    Decide the next step for this user. Remember:
    - If risk > 0.7, you MUST end now
    - If risk > 0.5, simplify or skip to critical questions only
    - If step > 10, you SHOULD end unless engagement is exceptional
    - Quality over quantity always
  `;

  try {
    const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
    const responseText = result.response.text();
    // Clean JSON if needed (Gemini sometimes adds markdown blocks)
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr) as AIDecision;
  } catch (error) {
    console.error("Gemini Onboarding Error:", error);
    // Fallback decision to avoid breaking flow
    return {
      type: "end",
      finalPersona: {
        version: context.currentPersona.version + 1,
        timestamp: new Date().toISOString(),
        traits: context.previousAnswers,
        confidence: Math.min(0.3 + (stepCount * 0.05), 0.6) // Low confidence fallback
      }
    };
  }
}

function calculateDropOffRisk(history: any[], stepCount: number): number {
  if (history.length === 0) return 0;

  const recent = history.slice(-3); // Look at last 3 interactions
  let risk = 0;

  // Factor 1: Response time trend (30% weight)
  if (recent.length > 1) {
    const avgResponseTime = recent.reduce((sum, s) => sum + s.responseTimeMs, 0) / recent.length;
    if (avgResponseTime > 5000) risk += 0.3;
    else if (avgResponseTime > 3000) risk += 0.15;
  }

  // Factor 2: Skip events (25% weight)
  const totalSkips = recent.reduce((sum, s) => sum + (s.skipEvents || 0), 0);
  if (totalSkips > 1) risk += 0.25;
  else if (totalSkips > 0) risk += 0.1;

  // Factor 3: Hesitation (20% weight)
  const avgHesitation = recent.reduce((sum, s) => sum + (s.hesitationCount || 0), 0) / recent.length;
  if (avgHesitation > 2) risk += 0.2;
  else if (avgHesitation > 1) risk += 0.1;

  // Factor 4: Answer quality (15% weight)
  const avgLength = recent.reduce((sum, s) => sum + (s.answerLength || 0), 0) / recent.length;
  if (avgLength > 0 && avgLength < 10) risk += 0.15; // Very short text answers

  // Factor 5: Session fatigue (10% weight)
  const sessionTime = recent[recent.length - 1]?.timeSpentInSessionMs || 0;
  if (sessionTime > 120000) risk += 0.1; // Over 2 minutes

  return Math.min(risk, 1);
}
