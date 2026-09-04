import clsx from "clsx";
import type { AnchorHTMLAttributes, ReactNode } from "react";

const styles = {
  primary:
    "bg-zinc-950 py-3 pr-3 pl-4 font-medium text-white ring-1 ring-zinc-950 focus-visible:outline-brand-500",
  secondary:
    "px-3 py-2 font-medium text-zinc-800 ring-1 ring-zinc-950/12 hover:bg-white focus-visible:outline-zinc-400",
  text: "font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950 hover:decoration-zinc-950 focus-visible:outline-brand-500",
} as const;

export function ButtonLink({
  children,
  className,
  variant = "secondary",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: keyof typeof styles;
}) {
  return (
    <a
      className={clsx(
        "pressable inline-flex items-center gap-2 rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
