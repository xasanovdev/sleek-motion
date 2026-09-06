"use client";

import { useState } from "react";
import { CopyButton } from "../../registry/animations/feedback/copy-button";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [notice, setNotice] = useState("");
  const text = "Good motion makes the next step clear.";
  return <div><p>{text}</p><CopyButton duration={.16 / speed} text={text} reducedMotion={reducedMotion} onCopySuccess={() => setNotice("Text copied.")} onCopyError={() => setNotice("Clipboard unavailable. Select the text above to copy it.")}>Copy sample text</CopyButton><p role="status">{notice}</p></div>;
}
