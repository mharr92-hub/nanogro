"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function trackEvent(event_name: string, input?: { page_path?: string; case_id?: string; lead_id?: string; metadata?: Record<string, unknown> }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from("analytics_events").insert({
    event_name,
    page_path: input?.page_path,
    case_id: input?.case_id,
    lead_id: input?.lead_id,
    metadata: input?.metadata ?? {}
  });
}
