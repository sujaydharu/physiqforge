
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const instant = false;

export default async function OnboardingPage() {
  const supabase = await createClient();

  // 1. Verify authentication.
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub;

  if (typeof userId !== "string") {
    redirect("/auth/login");
  }

  // 2. Fetch the user's profile.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(`
      full_name,
      date_of_birth,
      height_cm,
      current_weight_kg,
      fitness_goal,
      experience_level,
      equipment_access
    `)
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error("Unable to load your profile.");
  }

  // 3. Fetch the user's preferences.
  const { data: preferences, error: preferencesError } =
    await supabase
      .from("user_preferences")
      .select(`
        preferred_workout_location,
        preferred_workout_days,
        preferred_workout_duration_minutes,
        diet_preference,
        sleep_target_hours
      `)
      .eq("user_id", userId)
      .maybeSingle();

  if (preferencesError) {
    throw new Error("Unable to load your preferences.");
  }

  // 4. Check onboarding completion.
  const hasCompletedOnboarding = Boolean(
    profile &&
    preferences &&
    profile.full_name?.trim() &&
    profile.date_of_birth &&
    Number(profile.height_cm) > 0 &&
    Number(profile.current_weight_kg) > 0 &&
    profile.fitness_goal &&
    profile.experience_level &&
    profile.equipment_access &&
    preferences.preferred_workout_location &&
    preferences.preferred_workout_days?.length > 0 &&
    preferences.preferred_workout_duration_minutes &&
    preferences.diet_preference &&
    Number(preferences.sleep_target_hours) > 0
  );

  // 5. Completed users should return to the dashboard.
  if (hasCompletedOnboarding) {
    redirect("/protected");
  }

  // 6. Only users with incomplete profiles see onboarding.
  return <OnboardingWizard />;
}
