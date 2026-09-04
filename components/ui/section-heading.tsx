import clsx from "clsx";

export function SectionHeading({
  align = "left",
  className,
  description,
  eyebrow,
  title,
}: {
  align?: "left" | "center";
  className?: string;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <p className="font-mono text-base/7 font-medium tracking-wide text-brand-600 sm:text-sm/6">
        {eyebrow}
      </p>
      <h2
        className={clsx(
          "max-w-[24ch] text-4xl font-semibold tracking-tight text-balance text-zinc-950 sm:text-5xl",
          align === "center" && "mx-auto",
        )}
      >
        {title}
      </h2>
      <p
        className={clsx(
          "max-w-[48ch] text-lg/8 text-pretty text-zinc-600",
          align === "center" && "mx-auto",
        )}
      >
        {description}
      </p>
    </div>
  );
}
