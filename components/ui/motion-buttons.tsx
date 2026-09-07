"use client";

import { Button } from "@base-ui/react/button";
import { AsyncButton as MotionAsyncButton, type AsyncButtonProps } from "@/registry/animations/feedback/async-button";
import { CopyButton as MotionCopyButton, type CopyButtonProps } from "@/registry/animations/feedback/copy-button";

export function AsyncButton(props: AsyncButtonProps) {
  return <Button disabled={props.disabled} render={<MotionAsyncButton {...props} />} />;
}

export function CopyButton(props: CopyButtonProps) {
  return <Button disabled={props.disabled} render={<MotionCopyButton {...props} />} />;
}
