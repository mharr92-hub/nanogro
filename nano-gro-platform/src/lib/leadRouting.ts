import "server-only";
import type { LeadScoreResult } from "./leadScore";

// Lead routing (spec §9). Fires a CRM webhook + email notification for new leads.
// All integrations are best-effort and log instead of throwing when unconfigured,
// so the capture flow never fails on a missing integration. WhatsApp routing is a
// documented Phase-2 stub.

export interface RoutableLead {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  country?: string | null;
  crop?: string | null;
  source?: string | null;
}

export async function notifyLead(lead: RoutableLead, score: LeadScoreResult): Promise<void> {
  const payload = { lead, score, at: new Date().toISOString() };

  // 1. CRM webhook
  const webhook = process.env.CRM_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("[lead] CRM webhook failed (non-fatal):", err);
    }
  } else {
    console.info("[lead] CRM webhook not configured; payload:", JSON.stringify(payload));
  }

  // 2. Email notification (hot leads get an SLA flag in the subject)
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (resendKey && to) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: "leads@nano-gro.local",
          to,
          subject: `[${score.band}] New lead: ${lead.name} (${lead.country ?? "—"})`,
          text: `Score ${score.score}. Source: ${lead.source ?? "—"}. Crop: ${lead.crop ?? "—"}.\nContact: ${lead.email ?? lead.phone ?? lead.whatsapp ?? "—"}`,
        }),
      });
    } catch (err) {
      console.error("[lead] email notify failed (non-fatal):", err);
    }
  } else {
    console.info(`[lead] notify (${score.band}, ${score.score}): ${lead.name}`);
  }

  // 3. WhatsApp routing — Phase 2 (WhatsApp Business API). Intentionally a stub.
}
