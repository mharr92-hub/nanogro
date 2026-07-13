"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { messages } = useLanguage();

  return (
    <section className="section">
      <div className="container max-w-2xl">
        <div className="card border-dashed p-6 sm:p-8">
          <h1 className="text-h3 text-foreground">{messages.errors.noErrorDetails}</h1>
          <p className="mt-2 max-w-prose text-body text-muted-foreground">{messages.hub.emptyBody}</p>
          <button className="btn btn-primary mt-4" type="button" onClick={reset}>
            {messages.common.view}
          </button>
        </div>
      </div>
    </section>
  );
}
