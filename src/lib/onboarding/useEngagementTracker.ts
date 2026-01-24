"use client";

import { useState, useRef } from "react";
import { EngagementSignals } from "./types";

export function useEngagementTracker() {
    const [signals, setSignals] = useState<EngagementSignals>({
        responseTimeMs: 0,
        editCount: 0,
        hesitationCount: 0,
        answerLength: 0,
        skipEvents: 0,
        timeSpentInSessionMs: 0,
        dropOffRisk: 0,
    });

    const startTimeRef = useRef<number>(Date.now());
    const lastInputTimeRef = useRef<number>(Date.now());

    const resetForNewQuestion = () => {
        startTimeRef.current = Date.now();
        setSignals(prev => ({
            ...prev,
            responseTimeMs: 0,
            editCount: 0,
            hesitationCount: 0,
            answerLength: 0,
        }));
    };

    const recordInput = (value: string) => {
        const now = Date.now();
        const timeSinceLastInput = now - lastInputTimeRef.current;

        setSignals(prev => {
            let hesitationCount = prev.hesitationCount;
            // If user pauses for more than 2 seconds between keys, count as hesitation
            if (timeSinceLastInput > 2000) {
                hesitationCount++;
            }

            return {
                ...prev,
                editCount: prev.editCount + 1,
                answerLength: value.length,
                hesitationCount,
                responseTimeMs: now - startTimeRef.current,
                timeSpentInSessionMs: now - startTimeRef.current, // cumulative logic should be handled elsewhere
            };
        });

        lastInputTimeRef.current = now;
    };

    const recordSkip = () => {
        setSignals(prev => ({
            ...prev,
            skipEvents: prev.skipEvents + 1,
        }));
    };

    const recordChoice = () => {
        const now = Date.now();
        setSignals(prev => ({
            ...prev,
            responseTimeMs: now - startTimeRef.current,
        }));
    };

    return {
        signals,
        recordInput,
        recordChoice,
        recordSkip,
        resetForNewQuestion
    };
}
