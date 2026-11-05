import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const instant = false;

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-[#0A090B] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold tracking-[0.25em] text-[#D73549]">
          PHYSIQFORGE
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Let's build your fitness profile.
        </h1>

        <p className="mt-3 text-sm text-zinc-400">
          Tell us about yourself so your AI personal trainer can create a
          fitness experience tailored to your goals.
        </p>

        <OnboardingWizard />
      </div>
    </main>
  );
}