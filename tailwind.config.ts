import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "380px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        // Laboratorio: color reservado a datos, metricas y senales de verificacion.
        data: "var(--data)",
        "data-foreground": "var(--data-foreground)",
        "data-tint": "var(--data-tint)",
        // Niveles de evidencia A/B/C/D.
        "level-a": "var(--level-a)",
        "level-b": "var(--level-b)",
        "level-c": "var(--level-c)",
        "level-d": "var(--level-d)"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-data)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1.1rem", letterSpacing: "0.02em" }],
        label: ["0.8125rem", { lineHeight: "1.15rem", letterSpacing: "0.06em" }],
        body: ["1rem", { lineHeight: "1.6rem" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        h5: ["1rem", { lineHeight: "1.4rem", fontWeight: "700" }],
        h4: ["1.125rem", { lineHeight: "1.55rem", fontWeight: "700" }],
        h3: ["1.375rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        h2: ["1.75rem", { lineHeight: "2.1rem", fontWeight: "600" }],
        h1: ["2.125rem", { lineHeight: "2.4rem", fontWeight: "600" }],
        display: ["2.75rem", { lineHeight: "2.95rem", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg": ["3.75rem", { lineHeight: "3.95rem", letterSpacing: "-0.025em", fontWeight: "600" }],
        // Cifras: siempre en la familia mono, alineadas en columna.
        metric: ["1.75rem", { lineHeight: "2rem", letterSpacing: "-0.01em", fontWeight: "600" }],
        "metric-lg": ["2.5rem", { lineHeight: "2.7rem", letterSpacing: "-0.02em", fontWeight: "600" }]
      },
      borderRadius: {
        DEFAULT: "6px",
        card: "10px",
        sheet: "4px",
        pill: "999px"
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        sheet: "var(--shadow-sheet)"
      },
      maxWidth: {
        prose: "68ch"
      }
    }
  },
  plugins: []
};

export default config;
