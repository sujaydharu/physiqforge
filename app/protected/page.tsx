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

  return <PhysiqForgeDashboard />;
}