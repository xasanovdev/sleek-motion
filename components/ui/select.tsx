"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

type Option<T> = { value: T; label: string };
export function Select<T extends string | number>({
  value,
  onValueChange,
  options,
  label,
  name,
  className,
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: Option<T>[];
  label: string;
  name?: string;
  className?: string;
}) {
  return (
    <BaseSelect.Root
      value={value}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
      items={options}
      name={name}
    >
      <BaseSelect.Trigger
        className={clsx("ui-select", className)}
        aria-label={label}
      >
        <BaseSelect.Value />
        <BaseSelect.Icon>
          <ChevronDownIcon aria-hidden="true" className="size-4" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          sideOffset={6}
          alignItemWithTrigger={false}
          className="ui-popup-positioner"
        >
          <BaseSelect.Popup className="ui-select-popup">
            <BaseSelect.ScrollUpArrow className="ui-select-scroll-arrow">
              ↑
            </BaseSelect.ScrollUpArrow>
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  className="ui-select-item"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator>
                    <CheckIcon aria-hidden="true" className="size-4" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
            <BaseSelect.ScrollDownArrow className="ui-select-scroll-arrow">
              ↓
            </BaseSelect.ScrollDownArrow>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
