// Renders structured data as a native <script type="application/ld+json">.
// Escapes "<" to prevent XSS via injected strings (per Next.js JSON-LD guidance).
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
