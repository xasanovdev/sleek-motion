"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

export function Checkbox({
  className,
  ...props
}: Omit<BaseCheckbox.Root.Props, "className"> & { className?: string }) {
  return (
    <BaseCheckbox.Root {...props} className={clsx("ui-checkbox", className)}>
      <BaseCheckbox.Indicator>
        <CheckIcon aria-hidden="true" className="size-4" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
