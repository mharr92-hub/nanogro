"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { messages } = useLanguage();
  const switchesToLight = theme === "dark";
  return (
    <button
      aria-label={switchesToLight ? messages.common.switchToLight : messages.common.switchToDark}
      className="btn btn-secondary theme-toggle"
      title={switchesToLight ? messages.common.switchToLight : messages.common.switchToDark}
      type="button"
      onClick={toggleTheme}
    >
      <span
        aria-hidden="true"
        className={`theme-toggle-icon ${switchesToLight ? "theme-toggle-sun" : "theme-toggle-moon"}`}
      />
    </button>
  );
}

