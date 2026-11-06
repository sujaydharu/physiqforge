
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PhysiqForgeDashboard } from "@/components/dashboard/physiqforge-dashboard";

export const instant = false;

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  // Only authenticated users can access the dashboard
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub;

  if (typeof userId !== "string") {
    redirect("/auth/login");
  }

  // Fetch the user's profile
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

  // Fetch the user's preferences
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

  // Determine whether onboarding is complete
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
    Number(preferences.preferred_workout_duration_minutes) > 0 &&
    preferences.diet_preference &&
    Number(preferences.sleep_target_hours) > 0
  );

  return (
    <PhysiqForgeDashboard
      profileName={profile?.full_name?.trim() ?? ""}
      hasCompletedOnboarding={hasCompletedOnboarding}
    />
  );
}
