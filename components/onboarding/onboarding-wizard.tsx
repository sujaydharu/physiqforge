
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "Personal Information",
  "Body & Fitness Goals",
  "Workout Preferences",
  "Nutrition & Recovery",
  "Review & Complete",
];

type OnboardingData = {
  fullName: string;
  dateOfBirth: string;
  sex: string;
  heightCm: string;
  currentWeightKg: string;
  fitnessGoal: string;
  experienceLevel: string;
  equipmentAccess: string;
  preferredWorkoutLocation: string;
  preferredWorkoutDays: string[];
  preferredWorkoutDurationMinutes: string;
  dietPreference: string;
  foodAllergies: string;
  dietaryRestrictions: string;
  sleepTargetHours: string;
};

const formatOption = (value: string) => {
  if (!value) return "Not provided";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatTextList = (value: string) => {
  if (!value.trim()) return "None provided";

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
};

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "",
    dateOfBirth: "",
    sex: "",
    heightCm: "",
    currentWeightKg: "",
    fitnessGoal: "",
    experienceLevel: "",
    equipmentAccess: "",
    preferredWorkoutLocation: "",
    preferredWorkoutDays: [],
    preferredWorkoutDurationMinutes: "",
    dietPreference: "",
    foodAllergies: "",
    dietaryRestrictions: "",
    sleepTargetHours: "8",
  });

  const [error, setError] = useState("");

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (
    field: Exclude<keyof OnboardingData, "preferredWorkoutDays">,
    value: string
  ) => {
    setFormData((previous) => ({
        ...previous,
        [field]: value,
    }));

    setError("");
  };
  const toggleWorkoutDay = (day: string) => {
    setFormData((previous) => ({
        ...previous,
        preferredWorkoutDays: previous.preferredWorkoutDays.includes(day)
        ? previous.preferredWorkoutDays.filter((item) => item !== day)
        : [...previous.preferredWorkoutDays, day],
    }));

    setError("");
  };

  const nextStep = () => {
    if (currentStep === 0) {
      if (!formData.fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (!formData.dateOfBirth) {
        setError("Please enter your date of birth.");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);

      if (formData.dateOfBirth > today) {
        setError("Date of birth cannot be in the future.");
        return;
      }
    }
    if (currentStep === 1) {
        const height = Number(formData.heightCm);
        const weight = Number(formData.currentWeightKg);

        if (!formData.heightCm || !Number.isFinite(height) || height <= 0) {
            setError("Please enter a valid height greater than zero.");
            return;
        }

        if (
            !formData.currentWeightKg ||
            !Number.isFinite(weight) ||
            weight <= 0
        ) {
            setError("Please enter a valid weight greater than zero.");
            return;
        }

        if (!formData.fitnessGoal) {
            setError("Please select your fitness goal.");
            return;
        }

        if (!formData.experienceLevel) {
            setError("Please select your experience level.");
            return;
        }
    }
    if (currentStep === 2) {
        if (!formData.equipmentAccess) {
            setError("Please select your available workout equipment.");
            return;
        }

        if (!formData.preferredWorkoutLocation) {
            setError("Please select your preferred workout location.");
            return;
        }

        if (formData.preferredWorkoutDays.length === 0) {
            setError("Please select at least one workout day.");
            return;
        }

        const duration = Number(formData.preferredWorkoutDurationMinutes);

        if (
            !formData.preferredWorkoutDurationMinutes ||
            !Number.isInteger(duration) ||
            duration <= 0
        ) {
            setError("Please select a valid workout duration.");
            return;
        }
    }
    if (currentStep === 3) {
      if (!formData.dietPreference) {
        setError("Please select your dietary preference.");
        return;
      }

      const sleepHours = Number(formData.sleepTargetHours);

      if (
        !formData.sleepTargetHours ||
        !Number.isFinite(sleepHours) ||
        sleepHours <= 0 ||
        sleepHours > 24
      ) {
        setError("Please enter a valid sleep target between 1 and 24 hours.");
        return;
      }
    }

    setError("");
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const previousStep = () => {
    setError("");
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  
  const handleComplete = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to save your profile.");
        return;
      }

      router.replace("/protected?onboarding=complete");
      router.refresh();
    } catch (error) {
      console.error("Profile submission failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const progress = ((currentStep + 1) / steps.length) * 100;

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0A090B] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#D73549]";

  return (
    <section className="mt-10 rounded-2xl border border-white/[0.08] bg-[#100E11] p-6 sm:p-8">
      {/* STEP HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D73549]">
            Step {currentStep + 1} of {steps.length}
          </p>

          <h2 className="mt-2 text-xl font-bold text-white">
            {steps[currentStep]}
          </h2>
        </div>

        <span className="text-sm text-zinc-400">
          {Math.round(progress)}%
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#D73549] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* STEP INDICATORS */}
      <div className="mt-8 flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`rounded-lg px-3 py-2 text-xs ${
              index === currentStep
                ? "bg-[#3A171F] text-red-300"
                : index < currentStep
                  ? "bg-white/[0.08] text-zinc-300"
                  : "bg-white/[0.03] text-zinc-500"
            }`}
          >
            {index + 1}. {step}
          </div>
        ))}
      </div>

      {/* STEP CONTENT */}
      <div className="mt-8 min-h-64">
        {currentStep === 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white">
              Let's get to know you
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              First, tell us a little about yourself.
            </p>

            <div className="mt-6 space-y-5">
              {/* FULL NAME */}
              <div>
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-zinc-300"
                >
                  Full Name <span className="text-red-400">*</span>
                </label>

                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    updateField("fullName", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* DATE OF BIRTH */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="text-sm font-medium text-zinc-300"
                >
                  Date of Birth <span className="text-red-400">*</span>
                </label>

                <input
                  id="dateOfBirth"
                  type="date"
                  autoComplete="bday"
                  value={formData.dateOfBirth}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) =>
                    updateField("dateOfBirth", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* SEX */}
              <div>
                <label
                  htmlFor="sex"
                  className="text-sm font-medium text-zinc-300"
                >
                  Sex <span className="text-zinc-500">(Optional)</span>
                </label>

                <select
                  id="sex"
                  value={formData.sex}
                  onChange={(e) => updateField("sex", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Prefer not to select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">
                    Prefer not to say
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
            <div>
                <h3 className="text-lg font-semibold text-white">
                Your body, your goals
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                Help us understand your current body measurements and what
                you want to achieve.
                </p>

                <div className="mt-6 space-y-5">
                {/* HEIGHT */}
                <div>
                    <label
                    htmlFor="heightCm"
                    className="text-sm font-medium text-zinc-300"
                    >
                    Height (cm) <span className="text-red-400">*</span>
                    </label>

                    <input
                    id="heightCm"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Example: 175"
                    value={formData.heightCm}
                    onChange={(e) =>
                        updateField("heightCm", e.target.value)
                    }
                    className={inputClass}
                    />
                </div>

                {/* CURRENT WEIGHT */}
                <div>
                    <label
                    htmlFor="currentWeightKg"
                    className="text-sm font-medium text-zinc-300"
                    >
                    Current Weight (kg) <span className="text-red-400">*</span>
                    </label>

                    <input
                    id="currentWeightKg"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Example: 65"
                    value={formData.currentWeightKg}
                    onChange={(e) =>
                        updateField("currentWeightKg", e.target.value)
                    }
                    className={inputClass}
                    />
                </div>

                {/* FITNESS GOAL */}
                <div>
                    <label
                    htmlFor="fitnessGoal"
                    className="text-sm font-medium text-zinc-300"
                    >
                    Fitness Goal <span className="text-red-400">*</span>
                    </label>

                    <select
                    id="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={(e) =>
                        updateField("fitnessGoal", e.target.value)
                    }
                    className={inputClass}
                    >
                    <option value="">Select your fitness goal</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="maintain_weight">Maintain Weight</option>
                    <option value="improve_strength">Improve Strength</option>
                    <option value="improve_endurance">Improve Endurance</option>
                    <option value="general_fitness">General Fitness</option>
                    </select>
                </div>

                {/* EXPERIENCE LEVEL */}
                <div>
                    <label
                    htmlFor="experienceLevel"
                    className="text-sm font-medium text-zinc-300"
                    >
                    Experience Level <span className="text-red-400">*</span>
                    </label>

                    <select
                    id="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={(e) =>
                        updateField("experienceLevel", e.target.value)
                    }
                    className={inputClass}
                    >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    </select>
                </div>
                </div>
            </div>
        )}

        {currentStep === 2 && (
            <div>
                <h3 className="text-lg font-semibold text-white">
                Design your workout routine
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                Tell us about your equipment, workout location, and availability.
                </p>

                <div className="mt-6 space-y-6">

                {/* EQUIPMENT ACCESS */}
                <div>
                    <label
                    htmlFor="equipmentAccess"
                    className="text-sm font-medium text-zinc-300"
                    >
                    Available Equipment <span className="text-red-400">*</span>
                    </label>

                    <select
                    id="equipmentAccess"
                    value={formData.equipmentAccess}
                    onChange={(e) =>
                        updateField("equipmentAccess", e.target.value)
                    }
                    className={inputClass}
                    >
                    <option value="">Select available equipment</option>
                    <option value="bodyweight_only">Bodyweight Only</option>
                    <option value="basic_home_equipment">
                        Basic Home Equipment
                    </option>
                    <option value="full_gym_access">Full Gym Access</option>
                    </select>
                </div>

                {/* WORKOUT LOCATION */}
                <div>
                    <label
                    htmlFor="preferredWorkoutLocation"
                    className="text-sm font-medium text-zinc-300"
                    >
                    Preferred Workout Location{" "}
                    <span className="text-red-400">*</span>
                    </label>

                    <select
                    id="preferredWorkoutLocation"
                    value={formData.preferredWorkoutLocation}
                    onChange={(e) =>
                        updateField("preferredWorkoutLocation", e.target.value)
                    }
                    className={inputClass}
                    >
                    <option value="">Select workout location</option>
                    <option value="home">Home</option>
                    <option value="gym">Gym</option>
                    <option value="outdoors">Outdoors</option>
                    <option value="mixed">Combination of Locations</option>
                    </select>
                </div>

                {/* WORKOUT DAYS */}
                <div>
                    <p className="text-sm font-medium text-zinc-300">
                    Available Workout Days{" "}
                    <span className="text-red-400">*</span>
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                    Select all the days when you are available to work out.
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: "Monday", value: "monday" },
                        { label: "Tuesday", value: "tuesday" },
                        { label: "Wednesday", value: "wednesday" },
                        { label: "Thursday", value: "thursday" },
                        { label: "Friday", value: "friday" },
                        { label: "Saturday", value: "saturday" },
                        { label: "Sunday", value: "sunday" },
                    ].map((day) => {
                        const selected = formData.preferredWorkoutDays.includes(
                        day.value
                        );

                        return (
                        <label
                            key={day.value}
                            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                            selected
                                ? "border-[#D73549] bg-[#3A171F] text-white"
                                : "border-white/10 bg-[#0A090B] text-zinc-400 hover:border-white/20"
                            }`}
                        >
                            <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleWorkoutDay(day.value)}
                            className="accent-[#D73549]"
                            />

                            {day.label}
                        </label>
                        );
                    })}
                    </div>
                </div>

                {/* WORKOUT DURATION */}
                <div>
                    <label
                    htmlFor="preferredWorkoutDurationMinutes"
                    className="text-sm font-medium text-zinc-300"
                    >
                    Preferred Workout Duration{" "}
                    <span className="text-red-400">*</span>
                    </label>

                    <select
                    id="preferredWorkoutDurationMinutes"
                    value={formData.preferredWorkoutDurationMinutes}
                    onChange={(e) =>
                        updateField(
                        "preferredWorkoutDurationMinutes",
                        e.target.value
                        )
                    }
                    className={inputClass}
                    >
                    <option value="">Select workout duration</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="75">75 Minutes</option>
                    <option value="90">90 Minutes</option>
                    <option value="120">120 Minutes</option>
                    </select>
                </div>

                </div>
            </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-white">
              Fuel your body and recover better
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Tell us about your eating preferences, food restrictions, and
              sleep goals so your AI trainer can create a more suitable plan.
            </p>

            <div className="mt-6 space-y-6">

              {/* DIET PREFERENCE */}
              <div>
                <label
                  htmlFor="dietPreference"
                  className="text-sm font-medium text-zinc-300"
                >
                  Dietary Preference <span className="text-red-400">*</span>
                </label>

                <select
                  id="dietPreference"
                  value={formData.dietPreference}
                  onChange={(e) =>
                    updateField("dietPreference", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select your dietary preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* FOOD ALLERGIES */}
              <div>
                <label
                  htmlFor="foodAllergies"
                  className="text-sm font-medium text-zinc-300"
                >
                  Food Allergies
                </label>

                <textarea
                  id="foodAllergies"
                  rows={3}
                  placeholder="Example: Peanuts, milk, soy, eggs. Enter 'None' if you have no known food allergies."
                  value={formData.foodAllergies}
                  onChange={(e) =>
                    updateField("foodAllergies", e.target.value)
                  }
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-zinc-500">
                  Separate multiple allergies with commas.
                </p>
              </div>

              {/* DIETARY RESTRICTIONS */}
              <div>
                <label
                  htmlFor="dietaryRestrictions"
                  className="text-sm font-medium text-zinc-300"
                >
                  Dietary Restrictions
                </label>

                <textarea
                  id="dietaryRestrictions"
                  rows={3}
                  placeholder="Example: Lactose-free, gluten-free, no added sugar."
                  value={formData.dietaryRestrictions}
                  onChange={(e) =>
                    updateField("dietaryRestrictions", e.target.value)
                  }
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-zinc-500">
                  Enter any dietary restrictions, separated by commas.
                </p>
              </div>

              {/* SLEEP TARGET */}
              <div>
                <label
                  htmlFor="sleepTargetHours"
                  className="text-sm font-medium text-zinc-300"
                >
                  Daily Sleep Target (Hours){" "}
                  <span className="text-red-400">*</span>
                </label>

                <input
                  id="sleepTargetHours"
                  type="number"
                  min="1"
                  max="24"
                  step="0.5"
                  placeholder="Example: 8"
                  value={formData.sleepTargetHours}
                  onChange={(e) =>
                    updateField("sleepTargetHours", e.target.value)
                  }
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-zinc-500">
                  Recommended starting target: 8 hours.
                </p>
              </div>

            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-white">
              Review your fitness profile
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Review the information below before completing your
              PhysiqForge profile. You can go back and edit any section.
            </p>

            <div className="mt-6 space-y-5">

              {/* PERSONAL INFORMATION */}
              <div className="rounded-xl border border-white/10 bg-[#0A090B] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    Personal Information
                  </h4>
                  <span className="text-xs font-medium text-[#D73549]">
                    STEP 1
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-zinc-500">Full Name</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formData.fullName || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Date of Birth</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formData.dateOfBirth || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Sex</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatOption(formData.sex)}
                    </p>
                  </div>
                </div>
              </div>

              {/* BODY AND FITNESS GOALS */}
              <div className="rounded-xl border border-white/10 bg-[#0A090B] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    Body & Fitness Goals
                  </h4>
                  <span className="text-xs font-medium text-[#D73549]">
                    STEP 2
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-zinc-500">Height</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formData.heightCm} cm
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Current Weight</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formData.currentWeightKg} kg
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Fitness Goal</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatOption(formData.fitnessGoal)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Experience Level</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatOption(formData.experienceLevel)}
                    </p>
                  </div>
                </div>
              </div>

              {/* WORKOUT PREFERENCES */}
              <div className="rounded-xl border border-white/10 bg-[#0A090B] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    Workout Preferences
                  </h4>
                  <span className="text-xs font-medium text-[#D73549]">
                    STEP 3
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-zinc-500">Available Equipment</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatOption(formData.equipmentAccess)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Workout Location</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatOption(formData.preferredWorkoutLocation)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Workout Days</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formData.preferredWorkoutDays
                        .map(formatOption)
                        .join(", ") || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Workout Duration</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formData.preferredWorkoutDurationMinutes} minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* NUTRITION PREFERENCES */}
              <div className="rounded-xl border border-white/10 bg-[#0A090B] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    Nutrition Preferences
                  </h4>
                  <span className="text-xs font-medium text-[#D73549]">
                    STEP 4
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500">Dietary Preference</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatOption(formData.dietPreference)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Food Allergies</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatTextList(formData.foodAllergies)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Dietary Restrictions</p>
                    <p className="mt-1 text-sm text-zinc-200">
                      {formatTextList(formData.dietaryRestrictions)}
                    </p>
                  </div>
                </div>
              </div>

              {/* RECOVERY AND SLEEP */}
              <div className="rounded-xl border border-white/10 bg-[#0A090B] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    Recovery & Sleep
                  </h4>
                  <span className="text-xs font-medium text-[#D73549]">
                    STEP 4
                  </span>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Daily Sleep Target</p>
                  <p className="mt-1 text-sm text-zinc-200">
                    {formData.sleepTargetHours} hours
                  </p>
                </div>
              </div>

            </div>

            {/* COMPLETION NOTICE */}
            <div className="mt-6 rounded-xl border border-[#D73549]/20 bg-[#3A171F]/30 p-4">
              <p className="text-sm font-medium text-white">
                Your PhysiqForge profile is almost ready!
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Check your details carefully. Your information will be
                used to personalize your fitness and nutrition experience.
              </p>
            </div>
          </div>
        )}

        {/* VALIDATION ERROR */}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </p>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-6">
        <button
          type="button"
          onClick={previousStep}
          disabled={currentStep === 0}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Previous
        </button>

        
        <button
          type="button"
          onClick={
            currentStep === steps.length - 1
              ? handleComplete
              : nextStep
          }
          disabled={isSubmitting}
          className="rounded-xl bg-[#D73549] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B9273B] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting
            ? "Saving Profile..."
            : currentStep === steps.length - 1
              ? "Complete Profile"
              : "Next Step"}
        </button>

      </div>
    </section>
  );
}
