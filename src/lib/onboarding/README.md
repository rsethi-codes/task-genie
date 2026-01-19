# Adaptive AI-Driven Onboarding

TaskGenie's onboarding system is designed with **Variable Depth** and **Adaptive Intelligence**. The system can ask up to 10-12 questions but will intelligently end early based on engagement signals.

## 🎯 Core Philosophy

**Quality of Engagement > Quantity of Data**

The system is optimized for completion rate, not data completeness. A user who completes 3 questions with high engagement provides more value than one who grudgingly answers 10.

## 📊 Three-Phase Structure

### Phase 1: The Hook (Steps 1-3)
**Goal**: Build momentum and establish trust

- **100% Choice-Based**: Zero typing required
- **Playful Questions**: Personality quiz style ("What's your morning vibe?")
- **Max 6-8 words per option**
- **Instant Gratification**: Every click feels like progress
- **Early Exit Rule**: If engagement weakens, end immediately

### Phase 2: The Alignment (Steps 4-7)
**Goal**: Gather actionable insights for first task

- **70% Choices, 30% Text**: Mostly low-friction interactions
- **Task-Quality Focus**: Every question must improve first task recommendations
- **Examples**: "What's one goal you're working on?", "Pick your biggest time-waster"
- **Adaptive Routing**: If drop-off risk increases, skip to Phase 3 or end

### Phase 3: The Synthesis (Steps 8-10+) — OPTIONAL
**Goal**: Deep alignment for power users

- **Only for Engaged Users**: Requires high engagement score to unlock
- **Vision/Values Questions**: Slightly deeper exploration
- **All Skippable**: User maintains full control
- **Hair-Trigger Exit**: Any hesitation triggers graceful end

## 🚨 Rolling Drop-Off Risk Scoring

The system calculates a real-time risk score (0-1) based on:

1. **Response Time Trend** (30% weight): Slowing down = losing interest
2. **Skip Events** (25% weight): Multiple skips = low commitment
3. **Hesitation Patterns** (20% weight): Pauses > 2s = confusion/boredom
4. **Answer Quality** (15% weight): Very short text = low motivation
5. **Session Fatigue** (10% weight): Over 2 minutes = diminishing returns

### Risk Thresholds

- **< 0.3**: Continue normally
- **0.3-0.5**: Simplify next question, prefer choices
- **0.5-0.7**: Skip optional questions, critical only
- **> 0.7**: **END IMMEDIATELY**

## 🧠 Persona Learning Strategy

### During Onboarding
- Collect **low-confidence signals** only
- Accept uncertainty as a feature, not a bug
- Never insist on more questions
- Optimize for getting user into the app

### Post-Onboarding (Contextual Learning)
The persona continues to evolve through:

1. **Task Creation**: "What type of task is this?"
2. **Subtask Editing**: "How do you prefer to break this down?"
3. **Task Completion**: "How did that feel?"
4. **Task Abandonment**: "What got in the way?"

This approach provides **higher-quality signals** because they're tied to real behavior, not hypothetical preferences.

## 🎨 UX Principles

1. **Visual Progress**: Step counter and sync meter provide constant feedback
2. **Playful Interactions**: Staggered animations, glow effects, satisfying clicks
3. **Transparent AI**: Gemini explains its reasoning for each question
4. **User Control**: Skip button always visible, no guilt-tripping

## 📈 Success Metrics

- **Completion Rate**: Target 85%+ (vs. industry standard ~40%)
- **Average Steps**: 4-6 (adaptive depth working correctly)
- **Time to Dashboard**: < 90 seconds median
- **Persona Confidence**: 0.4-0.6 after onboarding (honest assessment)

---

Built for momentum. Optimized for humans. © 2026 TaskGenie Systems.
