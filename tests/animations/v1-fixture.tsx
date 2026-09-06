import { useRef, useState, type CSSProperties } from "react";
import { AsyncButton, CopyButton, IconSwapButton, SequentialContent, type AsyncButtonStatus } from "../../registry";
import { DropdownMotion, LoadingOverlay } from "../../registry/recipes/overlays";

export function V1Fixture() {
  const [step, setStep] = useState(0);
  const [rtl, setRtl] = useState(false);
  const [status, setStatus] = useState<AsyncButtonStatus>("idle");
  const [clicks, setClicks] = useState(0);
  const [submits, setSubmits] = useState(0);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("First source");
  const [copyMounted, setCopyMounted] = useState(true);
  const [copied, setCopied] = useState("");
  const [copyErrors, setCopyErrors] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refTag, setRefTag] = useState("");
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <section aria-label="V1 behavior checks">
      <button onClick={() => setStep((s) => s + 1)}>Sequence next</button>
      <button onClick={() => setStep((s) => s - 1)}>Sequence back</button>
      <button onClick={() => setRtl((v) => !v)}>Sequence RTL</button>
      <SequentialContent as="article" step={step} dir={rtl ? "rtl" : "ltr"}
        duration={0.3} distance={40} data-testid="sequence">
        Step {step}<button>Step action</button>
      </SequentialContent>

      <form onSubmit={(event) => { event.preventDefault(); setSubmits((v) => v + 1); }}>
        <AsyncButton ref={ref} type="submit" status={status} aria-label="Save sample"
          data-testid="async" onClick={() => setClicks((v) => v + 1)}>Save</AsyncButton>
      </form>
      {(["idle", "loading", "success", "error"] as const).map((value) => (
        <button key={value} onClick={() => setStatus(value)}>Async {value}</button>
      ))}
      <button onClick={() => setRefTag(ref.current?.tagName ?? "missing")}>Async ref</button>
      <output data-testid="async-ref">{refTag}</output>
      <output data-testid="async-clicks">{clicks}</output>
      <output data-testid="async-submits">{submits}</output>

      <IconSwapButton iconKey={String(active)} aria-label="Favorite" aria-pressed={active}
        data-testid="icon-button" onClick={() => setActive((v) => !v)}>
        <span data-testid="icon">{active ? "Filled star" : "Empty star"}</span>
      </IconSwapButton>

      <button onClick={() => setText((v) => v === "First source" ? "Second source" : "First source")}>Copy source</button>
      <button onClick={() => setCopyMounted((v) => !v)}>Copy mount</button>
      {copyMounted && <CopyButton text={text} resetAfter={0.8} data-testid="copy"
        onCopySuccess={setCopied} onCopyError={() => setCopyErrors((v) => v + 1)} />}
      <CopyButton text="Prevented" data-testid="copy-prevented" onClick={(event) => event.preventDefault()} />
      <CopyButton text="Disabled" data-testid="copy-disabled" disabled />
      <output data-testid="copied-value">{copied}</output>
      <output data-testid="copy-errors">{copyErrors}</output>

      <button onClick={() => setLoading((v) => !v)}>Overlay toggle</button>
      <div aria-busy={loading}>
        <div inert={loading}><button data-testid="busy-action">Busy region action</button></div>
        <LoadingOverlay loading={loading} label="Loading report" data-testid="loading-overlay" duration={0.3}>
          Loading report
        </LoadingOverlay>
      </div>

      <div style={{ "--transform-origin": "10px 5px" } as CSSProperties}>
        <DropdownMotion style={{ color: "red", width: 100, height: 40 }} data-testid="dropdown-styled">Menu</DropdownMotion>
        <DropdownMotion style={{ transformOrigin: "right top", width: 100, height: 40 }} data-testid="dropdown-origin">Menu</DropdownMotion>
      </div>
    </section>
  );
}
