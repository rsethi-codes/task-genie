// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   onboardingFormSchema,
//   type OnboardingFormSchemaType,
// } from "@/lib/onboarding/validation";

// export function useOnboarding() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<OnboardingFormSchemaType>({
//     resolver: zodResolver(onboardingFormSchema),
//     mode: "onChange",
//     defaultValues: {
//       when: "",
//       duration: 60,
//       location: '',
//       energy: "",
//       deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//       goals: "",
//     },
//   });

//   const onSubmit = async (date: OnboardingFormSchemaType) => {
//     setIsSubmitting(true);
//     try {
//       // ! the below endpoint is not yet implemented
//       const response = await fetch("/api/onboarding", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(date),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "failed to save onboarding data");
//       }

//       router.push("/onboarding/success");
//     } catch (error) {
//       console.error("Onboarding error: ", error);
//       form.setError("root", {
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to complete onboarding",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const nextStep = async () => {
//     const currentQuestion = Object.keys(form.formState.dirtyFields)[currentStep];
//     const isValid = await form.trigger(currentQuestion as any);
//     if (isValid && currentStep < 5) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () =>{
//     if(currentStep > 0 ) setCurrentStep(currentStep - 1);
//   }

//   return{
//     form,
//     currentStep,
//     setCurrentStep,
//     isSubmitting,
//     onSubmit: form.handleSubmit(onSubmit),
//     nextStep,
//     prevStep
//   }
// }


"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingFormSchema,
  type OnboardingFormSchemaType,
} from "@/lib/onboarding/validation";
import { onboardingQuestions } from "@/config/onboarding-questions";

export function useOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert questions object to array
  const questionsArray = useMemo(() => {
    return Object.entries(onboardingQuestions).map(([key, question]) => ({
      ...question,
      id: key,
    }));
  }, []);

  const form = useForm<OnboardingFormSchemaType>({
    resolver: zodResolver(onboardingFormSchema),
    mode: "onChange",
    defaultValues: {
      primary_role: "",
      typical_day: "",
      work_pattern: "",
      focus_style: "",
      past_attempts: "",
      stress_response: "",
      decision_speed: "",
      motivation: "",
      self_assessment: [],
      energy_patterns: "",
      // Optional follow-up questions
      planning_style: "",
      accountability: [],
      simplicity_preference: "",
      adaptability: "",
      learning_style: "",
      commitment_style: "",
    },
  });

  const onSubmit = async (data: OnboardingFormSchemaType) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("🚀 ~ onSubmit ~ response:", JSON.stringify(response))

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save onboarding data");
      }

      router.push("/onboarding/success");
    } catch (error) {
      console.error("Onboarding error: ", error);
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to complete onboarding",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // Get current question ID
    const currentQuestion = questionsArray[currentStep];
    if (!currentQuestion) return;

    // Validate current field
    const isValid = await form.trigger(currentQuestion.id as any);
    
    if (isValid && currentStep < questionsArray.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const isCurrentStepValid = () =>{
    const currentQuestion = questionsArray[currentStep];
    if(!currentQuestion) return false;

    const fieldValue = form.getValues(currentQuestion.id as any);
    const fieldError = form.formState.errors[currentQuestion.id as keyof OnboardingFormSchemaType];

    if(Array.isArray(fieldValue)){
      return fieldValue.length > 0 && !fieldError;
    }
    return !!fieldValue && fieldValue !== "" && !fieldError
  }

  return {
    form,
    currentStep,
    setCurrentStep,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    nextStep,
    prevStep,
    questionsArray, // Export this so other components can use it
    isCurrentStepValid: isCurrentStepValid()
  };
}