
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedSex = [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
];

const allowedGoals = [
  "muscle_gain",
  "fat_loss",
  "maintain_weight",
  "improve_strength",
  "improve_endurance",
  "general_fitness",
];

const allowedExperience = [
  "beginner",
  "intermediate",
  "advanced",
];

const allowedEquipment = [
  "bodyweight_only",
  "basic_home_equipment",
  "full_gym_access",
];

const allowedLocations = [
  "home",
  "gym",
  "outdoors",
  "mixed",
];

const allowedDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const allowedDiets = [
  "vegetarian",
  "vegan",
  "eggetarian",
  "non_vegetarian",
  "pescatarian",
  "other",
];

const allowedDurations = [30, 45, 60, 75, 90, 120];

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value <= new Date().toISOString().slice(0, 10)
  );
}

function parseTextList(value: unknown): string[] {
  if (typeof value !== "string") return [];

  const normalized = value.trim();

  if (
    !normalized ||
    /^(none|no known allergies|n\/a)$/i.test(normalized)
  ) {
    return [];
  }

  return [
    ...new Set(
      normalized
        .split(",")
        .map((item) => item.trim())
        .filter(
          (item) =>
            item &&
            !/^(none|no known allergies|n\/a)$/i.test(item)
        )
    ),
  ];
}

function isOneOf(value: unknown, allowed: string[]) {
  return typeof value === "string" && allowed.includes(value);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify the authenticated user.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to complete your profile." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      fullName,
      dateOfBirth,
      sex,
      heightCm,
      currentWeightKg,
      fitnessGoal,
      experienceLevel,
      equipmentAccess,
      preferredWorkoutLocation,
      preferredWorkoutDays,
      preferredWorkoutDurationMinutes,
      dietPreference,
      foodAllergies,
      dietaryRestrictions,
      sleepTargetHours,
    } = body;

    // Personal information validation.
    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      fullName.trim().length > 100
    ) {
      return NextResponse.json(
        { error: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    if (
      typeof dateOfBirth !== "string" ||
      !isValidDate(dateOfBirth)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid date of birth." },
        { status: 400 }
      );
    }

    if (sex !== "" && sex !== null && !isOneOf(sex, allowedSex)) {
      return NextResponse.json(
        { error: "Invalid sex selection." },
        { status: 400 }
      );
    }

    // Body and fitness validation.
    const height = Number(heightCm);
    const weight = Number(currentWeightKg);

    if (!Number.isFinite(height) || height <= 0 || height > 300) {
      return NextResponse.json(
        { error: "Please enter a valid height." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(weight) || weight <= 0 || weight > 700) {
      return NextResponse.json(
        { error: "Please enter a valid weight." },
        { status: 400 }
      );
    }

    if (!isOneOf(fitnessGoal, allowedGoals)) {
      return NextResponse.json(
        { error: "Invalid fitness goal." },
        { status: 400 }
      );
    }

    if (!isOneOf(experienceLevel, allowedExperience)) {
      return NextResponse.json(
        { error: "Invalid experience level." },
        { status: 400 }
      );
    }

    if (!isOneOf(equipmentAccess, allowedEquipment)) {
      return NextResponse.json(
        { error: "Invalid equipment selection." },
        { status: 400 }
      );
    }

    // Workout preferences validation.
    if (!isOneOf(preferredWorkoutLocation, allowedLocations)) {
      return NextResponse.json(
        { error: "Invalid workout location." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(preferredWorkoutDays) ||
      preferredWorkoutDays.length === 0 ||
      preferredWorkoutDays.some(
        (day) => !isOneOf(day, allowedDays)
      ) ||
      new Set(preferredWorkoutDays).size !== preferredWorkoutDays.length
    ) {
      return NextResponse.json(
        { error: "Please select valid workout days." },
        { status: 400 }
      );
    }

    const duration = Number(preferredWorkoutDurationMinutes);

    if (
      !Number.isInteger(duration) ||
      !allowedDurations.includes(duration)
    ) {
      return NextResponse.json(
        { error: "Invalid workout duration." },
        { status: 400 }
      );
    }

    // Nutrition and recovery validation.
    if (!isOneOf(dietPreference, allowedDiets)) {
      return NextResponse.json(
        { error: "Invalid dietary preference." },
        { status: 400 }
      );
    }

    const sleep = Number(sleepTargetHours);

    if (!Number.isFinite(sleep) || sleep <= 0 || sleep > 24) {
      return NextResponse.json(
        { error: "Please enter a valid sleep target." },
        { status: 400 }
      );
    }

    const allergies = parseTextList(foodAllergies);
    const restrictions = parseTextList(dietaryRestrictions);

    if (
      allergies.some((item) => item.length > 100) ||
      restrictions.some((item) => item.length > 100)
    ) {
      return NextResponse.json(
        { error: "Each allergy or dietary restriction must be under 100 characters." },
        { status: 400 }
      );
    }

    // Save both records through the PostgreSQL function.
    const { error: saveError } = await supabase.rpc(
      "complete_onboarding",
      {
        p_full_name: fullName.trim(),
        p_date_of_birth: dateOfBirth,
        p_sex: sex || null,
        p_height_cm: height,
        p_current_weight_kg: weight,
        p_fitness_goal: fitnessGoal,
        p_experience_level: experienceLevel,
        p_equipment_access: equipmentAccess,
        p_preferred_workout_location: preferredWorkoutLocation,
        p_preferred_workout_days: preferredWorkoutDays,
        p_preferred_workout_duration_minutes: duration,
        p_diet_preference: dietPreference,
        p_food_allergies: allergies,
        p_dietary_restrictions: restrictions,
        p_sleep_target_hours: sleep,
      }
    );

    if (saveError) {
      console.error("Onboarding database error:", saveError);

      return NextResponse.json(
        { error: "We couldn't save your profile. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your PhysiqForge profile has been completed.",
    });
  } catch (error) {
    console.error("Onboarding API error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
