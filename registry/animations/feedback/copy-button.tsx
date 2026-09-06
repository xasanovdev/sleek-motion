"use client";

import { useEffect, useRef, useState } from "react";
import {
  AsyncButton,
  asyncButtonVariants,
  type AsyncButtonProps,
  type AsyncButtonStatus,
} from "./async-button";

export const copyButtonVariants = asyncButtonVariants;
export type CopyButtonProps = Omit<AsyncButtonProps, "status" | "type"> & {
  text: string;
  /** Seconds to keep success feedback. Errors remain until the next attempt. */
  resetAfter?: number;
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: unknown) => void;
};

/** Uses the Clipboard API in the click gesture; never reports success before it resolves. */
export function CopyButton({
  text,
  resetAfter = 2,
  onCopySuccess,
  onCopyError,
  onClick,
  children = "Copy",
  loadingContent = "Copying…",
  successContent = "Copied",
  errorContent = "Copy failed. Retry",
  ...props
}: CopyButtonProps) {
  const [result, setResult] = useState<{ text: string; status: AsyncButtonStatus }>({ text, status: "idle" });
  const attempt = useRef(0);
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  if (result.text !== text) setResult({ text, status: "idle" });

  useEffect(() => () => {
    // Ignore a pending write or old reset timer after a source change or unmount.
    attempt.current += 1;
    pending.current = false;
    clearTimeout(timer.current);
  }, [text]);

  return (
    <AsyncButton
      {...props}
      type="button"
      status={result.text === text ? result.status : "idle"}
      loadingContent={loadingContent}
      successContent={successContent}
      errorContent={errorContent}
      onClick={async (event) => {
        if (pending.current) return;
        onClick?.(event);
        if (event.defaultPrevented) return;
        const id = ++attempt.current;
        pending.current = true;
        clearTimeout(timer.current);
        setResult({ text, status: "loading" });
        try {
          if (!navigator.clipboard?.writeText) throw new Error("Clipboard API is unavailable.");
          await navigator.clipboard.writeText(text);
        } catch (error) {
          if (id !== attempt.current) return;
          pending.current = false;
          setResult({ text, status: "error" });
          onCopyError?.(error);
          return;
        }
        if (id !== attempt.current) return;
        pending.current = false;
        setResult({ text, status: "success" });
        timer.current = setTimeout(() => {
          if (id === attempt.current) setResult({ text, status: "idle" });
        }, Math.max(0, Number.isFinite(resetAfter) ? resetAfter : 2) * 1000);
        onCopySuccess?.(text);
      }}
    >
      {children}
    </AsyncButton>
  );
}
