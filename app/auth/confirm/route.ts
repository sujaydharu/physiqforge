import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Allow only internal redirects within this application
  const requestedNext = searchParams.get("next") ?? "/protected";
  const requestedUrl = new URL(requestedNext, request.url);
  const currentUrl = new URL(request.url);

  const next =
    requestedUrl.origin === currentUrl.origin
      ? `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`
      : "/protected";

  const supabase = await createClient();

  // 1. Handle standard PKCE flow (code parameter)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirect(next);
    }
    redirect(
      `/auth/error?error=${encodeURIComponent(error.message)}`
    );
  }

  // 2. Handle Token Hash flow (token_hash & type parameters)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirect(next);
    }

    redirect(
      `/auth/error?error=${encodeURIComponent(error.message)}`
    );
  }

  // 3. Fallback error if neither code nor token_hash is present
  redirect(
    `/auth/error?error=${encodeURIComponent("No valid confirmation code or token provided")}`
  );
}