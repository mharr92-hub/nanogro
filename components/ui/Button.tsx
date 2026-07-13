import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  whatsapp: "btn-whatsapp"
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-3 text-caption",
  md: "",
  lg: "px-6 text-body-lg"
};

export function buttonClass({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = ""
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return ["btn", variantClass[variant], sizeClass[size], fullWidth ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({ variant, size, fullWidth, className, children, ...rest }: ButtonProps) {
  return (
    <button className={buttonClass({ variant, size, fullWidth, className })} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

export function ButtonLink({ href, variant, size, fullWidth, className, children, ...rest }: ButtonLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const classes = buttonClass({ variant, size, fullWidth, className });
  if (isExternal) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link className={classes} href={href} {...rest}>
      {children}
    </Link>
  );
}
