import { createRoot, hydrateRoot } from "react-dom/client";
import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { V1Fixture } from "./v1-fixture";
import {
  AnimatedList,
  AutoHeight,
  CheckboxMotion,
  CircularProgress,
  Collapse,
  ContentSwap,
  DirectionalContentSwap,
  DotsLoader,
  Fade,
  LayoutShift,
  LoadingSwap,
  PageTransition,
  Pressable,
  ProgressBar,
  PulseLoader,
  Reveal,
  ScaleFade,
  ScrollProgress,
  ScrollReveal,
  Shake,
  SharedElement,
  SharedIndicator,
  Shimmer,
  Skeleton,
  SlideFade,
  Spinner,
  Stagger,
  StaggerItem,
  ToggleMotion,
} from "../../registry";
import {
  Backdrop,
  DrawerMotion,
  DropdownMotion,
  ModalMotion,
  PopoverMotion,
  ToastMotion,
} from "../../registry/recipes/overlays";

export function Fixture() {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  const [large, setLarge] = useState(false);
  const [items, setItems] = useState([1, 2, 3]);
  const [reduce, setReduce] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [refTag, setRefTag] = useState("");
  const ref = useRef<HTMLLIElement>(null);
  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <nav
        style={{
          display: "flex",
          gap: 8,
          position: "sticky",
          top: 0,
          background: "white",
          padding: 8,
          zIndex: 1,
        }}
      >
        <button onClick={() => setShow((v) => !v)}>Toggle</button>
        <button onClick={() => setStep((v) => v + 1)}>Next</button>
        <button onClick={() => setLarge((v) => !v)}>Resize</button>
        <button
          onClick={() =>
            setItems((v) => (v.length === 3 ? [3, 1, 4] : [1, 2, 3]))
          }
        >
          List
        </button>
        <button onClick={() => setReduce((v) => !v)}>Reduce</button>
        <button onClick={() => setRtl((v) => !v)}>RTL</button>
        <button onClick={() => setRefTag(ref.current?.tagName ?? "missing")}>
          Ref
        </button>
        <output data-testid="ref-result">{refTag}</output>
      </nav>
      <ul>
        <Fade as="li" ref={ref} show={show} data-testid="fade">
          <button>Focusable child</button>
        </Fade>
      </ul>
      <ScaleFade show={show} reducedMotion={reduce} data-testid="scale">
        Scale
      </ScaleFade>
      <SlideFade show={show} reducedMotion={reduce} data-testid="slide">
        Slide
      </SlideFade>
      <Reveal show={show} reducedMotion={reduce}>
        Reveal
      </Reveal>
      <Stagger show={show} reducedMotion={reduce}>
        <StaggerItem>One</StaggerItem>
        <StaggerItem>Two</StaggerItem>
      </Stagger>
      <ContentSwap contentKey={step} data-testid="swap">
        Step {step}
      </ContentSwap>
      <div style={{ position: "relative" }}>
        <ContentSwap contentKey={step} mode="popLayout" data-testid="pop">
          Pop {step}
        </ContentSwap>
      </div>
      <DirectionalContentSwap
        contentKey={step}
        direction={1}
        dir={rtl ? "rtl" : "ltr"}
        reducedMotion={reduce}
        data-testid="directional"
      >
        Direction {step}
      </DirectionalContentSwap>
      <Collapse open={show} data-testid="collapse">
        <div style={{ height: large ? 160 : 40 }}>Resizable panel</div>
      </Collapse>
      <Collapse open={show} keepMounted data-testid="kept">
        <button>Kept child</button>
      </Collapse>
      <AutoHeight data-testid="auto">
        <div style={{ height: large ? 140 : 30 }}>Auto height</div>
      </AutoHeight>
      <AnimatedList
        items={items}
        getKey={(item) => item}
        renderItem={(item) => (
          <span data-testid={`item-${item}`}>Item {item}</span>
        )}
      />
      <LayoutShift>Layout</LayoutShift>
      <SharedElement layoutId="test-shared">Shared</SharedElement>
      <SharedIndicator layoutId="test-indicator" />
      <Pressable data-testid="press">Press</Pressable>
      <Shake trigger={step}>Shake</Shake>
      <CheckboxMotion checked={show} />
      <ToggleMotion checked={show} style={{ display: "inline-block" }}>
        Thumb
      </ToggleMotion>
      <div style={{ display: "flex", gap: 12, padding: 12 }}>
        <Spinner data-testid="spinner" />
        <DotsLoader />
        <PulseLoader />
        <Skeleton style={{ width: 80 }} />
        <Shimmer style={{ width: 80, height: 16 }} />
        <CircularProgress value={step * 30} data-testid="circle" />
      </div>
      <ProgressBar value={step * 30} data-testid="progress" />
      <ProgressBar data-testid="indeterminate" />
      <LoadingSwap loading={show} fallback={<span>Loading result</span>}>
        Loaded result
      </LoadingSwap>
      <PageTransition contentKey={step}>Page {step}</PageTransition>
      <Backdrop show={show}>Backdrop</Backdrop>
      <ModalMotion show={show}>Modal</ModalMotion>
      <PopoverMotion show={show}>Popover</PopoverMotion>
      <DropdownMotion show={show}>Menu</DropdownMotion>
      <DrawerMotion show={show}>Drawer</DrawerMotion>
      <ToastMotion show={show}>Toast</ToastMotion>
      <div style={{ height: 1200 }} />
      <ScrollReveal data-testid="scroll-reveal">Scroll reveal</ScrollReveal>
      <ScrollProgress style={{ height: 4, background: "blue" }} />
      <div style={{ height: 800 }} />
      <AnimatePresence>
        {show && <div key="outside">External presence</div>}
      </AnimatePresence>
      <V1Fixture />
    </main>
  );
}

if (typeof document !== "undefined") {
  const root = document.getElementById("root")!;
  if (root.hasChildNodes()) hydrateRoot(root, <Fixture />);
  else createRoot(root).render(<Fixture />);
}
