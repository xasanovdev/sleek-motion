"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type RefObject,
  type ReactNode,
} from "react";
import { AgencySculpture } from "./agency-sculpture";
import { projects, services, type Project } from "./agency-content";
import styles from "./agency.module.css";
import "lenis/dist/lenis.css";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {[0, 45, 90, 135].map((angle) => (
        <path
          key={angle}
          d="M50 3v94"
          stroke="currentColor"
          strokeWidth="19"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
    </svg>
  );
}

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProjectArt({ project }: { project: Project }) {
  return (
    <div className={`${styles.projectArt} ${styles[project.theme]}`}>
      {project.theme === "soma" && (
        <>
          <Image
            src="/experiments/agency/oranges.jpg"
            alt="Sunlit oranges in a yellow bowl on orange fabric"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
            className={styles.somaPhoto}
          />
          <div className={styles.somaStamp}>
            A LITTLE
            <br />
            SUNSHINE
            <br />
            GOES A LONG WAY.
          </div>
          <div className={styles.can}>
            <span className={styles.canRim} />
            <span className={styles.canSmall}>BOTANICAL SODA</span>
            <strong>
              soma<span>®</span>
            </strong>
            <span className={styles.canSun}>✳</span>
            <span className={styles.canFlavor}>
              BLOOD ORANGE
              <br />& A LITTLE OPTIMISM
            </span>
            <span className={styles.canVolume}>
              GOOD ENERGY. NATURALLY. &nbsp; 330 ML
            </span>
          </div>
          <span className={styles.artCorner}>SIP ON THE BRIGHT SIDE. ↗</span>
        </>
      )}
      {project.theme === "otherwhere" && (
        <>
          <Image
            src="/experiments/agency/architecture.jpg"
            alt="Sculptural concrete architecture under a clear sky"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <div className={styles.architectureShade} />
          <span className={styles.otherwhereTop}>
            STAY SOMEWHERE THAT STAYS WITH YOU.
          </span>
          <strong className={styles.otherwhereLogo}>
            Otherwhere<span>®</span>
          </strong>
          <span className={styles.otherwhereBottom}>
            Extraordinary places.
            <br />
            An entirely different pace.
          </span>
          <span className={styles.otherwhereCircle}>
            <Arrow diagonal />
          </span>
        </>
      )}
      {project.theme === "offscript" && (
        <>
          <span className={styles.festivalTop}>
            INDEPENDENT MINDS. SHARED FREQUENCIES.
          </span>
          <div className={styles.festivalWord}>
            OFF
            <br />
            <span>SCRIPT</span>
            <sup>®</sup>
          </div>
          <Asterisk className={styles.festivalStar} />
          <div className={styles.festivalBottom}>
            <span>
              MUSIC. ART.
              <br />
              WHATEVER’S NEXT.
            </span>
            <span>
              18—20.09
              <br />
              LONDON, UK
            </span>
          </div>
        </>
      )}
      {project.theme === "folio" && (
        <>
          <span className={styles.folioTag}>
            SPACE FOR YOUR NEXT BIG THING.
          </span>
          <div className={styles.folioWindow}>
            <div className={styles.folioToolbar}>
              <b>
                folio<span>✳</span>
              </b>
              <span>YOUR CREATIVE SPACE</span>
              <i>JD</i>
            </div>
            <div className={styles.folioBody}>
              <aside>
                <b>Workspace</b>
                <span>⌂ &nbsp; Overview</span>
                <span>▦ &nbsp; Projects</span>
                <span>◷ &nbsp; This week</span>
                <small>YOUR SPACE, YOUR PACE.</small>
              </aside>
              <div className={styles.folioMain}>
                <span>MONDAY, SEPTEMBER 7</span>
                <h3>
                  Good things
                  <br />
                  start here.
                </h3>
                <div className={styles.folioMiniCards}>
                  <div>
                    <i>↗</i>
                    <b>
                      The next
                      <br />
                      big idea
                    </b>
                    <small>IN PROGRESS · 4 TASKS</small>
                  </div>
                  <div>
                    <i>✳</i>
                    <b>
                      A little
                      <br />
                      room to play
                    </b>
                    <small>EXPLORATION · 6 IDEAS</small>
                  </div>
                </div>
                <div className={styles.folioTask}>
                  ○ &nbsp; Make something you believe in <span>Today ↗</span>
                </div>
              </div>
            </div>
          </div>
          <span className={styles.folioBottom}>LESS FRICTION. MORE FLOW.</span>
        </>
      )}
    </div>
  );
}

function ProjectDialog({
  project,
  onClose,
  returnFocus,
}: {
  project: Project | null;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog.Root
      open={!!project}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup
          className={`${styles.dialog} ${styles.caseDialog}`}
          finalFocus={returnFocus}
          data-lenis-prevent
        >
          {project && (
            <>
              <div className={styles.dialogTop}>
                <span>SELECTED WORK / {project.year}</span>
                <Dialog.Close
                  className={styles.close}
                  aria-label="Close case study"
                >
                  ×
                </Dialog.Close>
              </div>
              <Dialog.Title className={styles.caseTitle}>
                {project.name}
                <span>®</span>
              </Dialog.Title>
              <Dialog.Description className={styles.caseDescription}>
                {project.description}
              </Dialog.Description>
              <div className={styles.caseTags}>
                {project.disciplines.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <ProjectArt project={project} />
              <div className={styles.caseDetails}>
                <div>
                  <h3>The challenge</h3>
                  <p>{project.challenge}</p>
                </div>
                <div>
                  <h3>Our approach</h3>
                  <p>{project.approach}</p>
                </div>
              </div>
              <p className={styles.demoNote}>
                Concept project created for the Forme agency template.
              </p>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function InquiryDialog({
  open,
  setOpen,
  returnFocus,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const [brief, setBrief] = useState("");
  const downloadUrl = brief
    ? `data:text/plain;charset=utf-8,${encodeURIComponent(brief)}`
    : undefined;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setBrief(
      `FORME — PROJECT INQUIRY\n\nName: ${String(values.get("name")).trim()}\nEmail: ${String(values.get("email")).trim()}\nInterested in: ${values.get("service")}\n\nThe idea:\n${String(values.get("idea")).trim()}\n\nPrepared locally with the Forme demo. Nothing has been sent.`,
    );
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup
          className={styles.dialog}
          finalFocus={returnFocus}
          data-lenis-prevent
        >
          <div className={styles.dialogTop}>
            <span>A GOOD PLACE TO START</span>
            <Dialog.Close className={styles.close} aria-label="Close inquiry">
              ×
            </Dialog.Close>
          </div>
          <Dialog.Title className={styles.inquiryTitle}>
            {brief ? (
              "A little more real."
            ) : (
              <>
                Big idea?
                <br />
                We’re all ears.
              </>
            )}
          </Dialog.Title>
          <Dialog.Description className={styles.inquiryDescription}>
            {brief
              ? "Your project brief is ready to take with you."
              : "Tell us a little about what you have in mind."}
          </Dialog.Description>
          {brief ? (
            <div className={styles.briefReady} role="status">
              <Asterisk className={styles.briefStar} />
              <p>
                This is a demo, so nothing has been sent. Download your brief to
                keep a copy.
              </p>
              <a
                className={styles.pill}
                href={downloadUrl || undefined}
                download="forme-project-brief.txt"
              >
                Download your brief <Arrow diagonal />
              </a>
              <button
                className={styles.textButton}
                onClick={() => setBrief("")}
              >
                Create another brief
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className={styles.inquiryForm}>
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Alex Morgan"
                  pattern=".*\S.*"
                />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  placeholder="alex@yourstudio.com"
                />
              </label>
              <label>
                What can we help with?
                <select name="service" defaultValue="Branding + website">
                  <option>Branding + website</option>
                  <option>Brand strategy & identity</option>
                  <option>Website design & development</option>
                  <option>Something else entirely</option>
                </select>
              </label>
              <label>
                A little about your idea
                <textarea
                  name="idea"
                  required
                  maxLength={3000}
                  rows={3}
                  placeholder="The ambition, the challenge, the what-if…"
                />
              </label>
              <p className={styles.demoNote}>
                Demo form — creates a downloadable brief. Nothing is sent.
              </p>
              <button type="submit" className={styles.pill}>
                Prepare your brief <Arrow diagonal />
              </button>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AgencyPage() {
  const reducedMotion = useReducedMotion();
  const [motionPaused, setMotionPaused] = useState(false);
  const paused = !!reducedMotion || motionPaused;
  const [filter, setFilter] = useState("All work");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openService, setOpenService] = useState<number | null>(0);
  const lenis = useRef<import("lenis").default | null>(null);
  const overlayOpen = inquiryOpen || !!selectedProject || menuOpen;
  const overlayOpenRef = useRef(overlayOpen);
  const projectTrigger = useRef<HTMLButtonElement>(null);
  const inquiryTrigger = useRef<HTMLButtonElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);

  function openInquiry(event: MouseEvent<HTMLButtonElement>) {
    inquiryTrigger.current = event.currentTarget;
    setInquiryOpen(true);
  }

  useEffect(() => {
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    return () => {
      document.documentElement.style.scrollBehavior = previousBehavior;
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    let destroyed = false;
    let instance: import("lenis").default | null = null;
    void import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      instance = new Lenis({
        autoRaf: true,
        lerp: 0.085,
        smoothWheel: true,
        anchors: { offset: -24 },
      });
      lenis.current = instance;
      if (overlayOpenRef.current) instance.stop();
    });
    return () => {
      destroyed = true;
      // Reset scrolling before disposal so a pending native-scroll timeout cannot restore Lenis classes.
      instance?.stop();
      instance?.destroy();
      lenis.current = null;
    };
  }, [paused]);
  useEffect(() => {
    overlayOpenRef.current = overlayOpen;
    if (overlayOpen) lenis.current?.stop();
    else lenis.current?.start();
  }, [overlayOpen]);

  return (
    <MotionConfig reducedMotion={paused ? "always" : "user"}>
      <div className={styles.page} data-paused={paused}>
        <a className={styles.skipLink} href="#agency-main">
          Skip to content
        </a>
        <header className={styles.header}>
          <a href="#" className={styles.logo} aria-label="Forme home">
            forme<span>®</span>
          </a>
          <span className={styles.headerDescriptor}>
            INDEPENDENT MINDS.
            <br />
            EXTRAORDINARY POSSIBILITIES.
          </span>
          <nav aria-label="Main navigation" className={styles.desktopNav}>
            <a href="#work">
              Work <sup>04</sup>
            </a>
            <a href="#studio">Studio</a>
            <a href="#services">Expertise</a>
          </nav>
          <button className={styles.headerContact} onClick={openInquiry}>
            Let’s talk <Arrow diagonal />
          </button>
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger
              ref={menuTrigger}
              className={styles.menuButton}
              aria-label="Open navigation"
            >
              <span />
              <span />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className={styles.backdrop} />
              <Dialog.Popup
                className={`${styles.dialog} ${styles.mobileMenu}`}
                data-lenis-prevent
              >
                <div className={styles.dialogTop}>
                  <Dialog.Title>forme®</Dialog.Title>
                  <Dialog.Close
                    className={styles.close}
                    aria-label="Close navigation"
                  >
                    ×
                  </Dialog.Close>
                </div>
                <nav aria-label="Mobile navigation">
                  {[
                    ["Work", "work"],
                    ["Studio", "studio"],
                    ["Expertise", "services"],
                  ].map(([label, id]) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                      <Arrow diagonal />
                    </a>
                  ))}
                </nav>
                <button
                  className={styles.pill}
                  onClick={() => {
                    inquiryTrigger.current = menuTrigger.current;
                    setMenuOpen(false);
                    setInquiryOpen(true);
                  }}
                >
                  Let’s talk <Arrow diagonal />
                </button>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </header>

        <main id="agency-main">
          <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.heroEyebrow}>
              <span className={styles.dot} /> A BRAND & DIGITAL DESIGN STUDIO
            </div>
            <h1 id="hero-title" className={styles.heroTitle}>
              <span>Different</span>
              <span>
                by design<span className={styles.orangePeriod}>.</span>
              </span>
            </h1>
            <div className={styles.sculptureWrap}>
              <AgencySculpture paused={paused} />
              <span className={styles.sculptureCaption}>
                A NEW PERSPECTIVE, ALWAYS. ↗
              </span>
            </div>
            <div className={styles.heroBottom}>
              <a
                href="#work"
                className={styles.roundLink}
                aria-label="Explore selected work"
              >
                <Arrow />
              </a>
              <p>
                We shape brands and build digital experiences
                <br className={styles.desktopBreak} /> for people ready to do
                things differently.
              </p>
              <span className={styles.heroLocation}>
                BASED IN LONDON.
                <br />
                OPEN TO EVERYWHERE.
              </span>
            </div>
          </section>

          <section
            id="work"
            className={styles.work}
            aria-labelledby="work-title"
          >
            <div className={styles.sectionTop}>
              <h2 id="work-title">
                Selected work<span>(04)</span>
              </h2>
              <div className={styles.filters} aria-label="Filter projects">
                {["All work", "Branding", "Digital"].map((item) => (
                  <button
                    key={item}
                    aria-pressed={filter === item}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <motion.div layout className={styles.projectGrid}>
              <AnimatePresence mode="popLayout">
                {projects
                  .filter(
                    (project) =>
                      filter === "All work" || project.category === filter,
                  )
                  .map((project) => (
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: paused ? 0 : 0.45 }}
                      key={project.slug}
                      className={styles.project}
                    >
                      <button
                        className={styles.projectButton}
                        onClick={(event) => {
                          projectTrigger.current = event.currentTarget;
                          setSelectedProject(project);
                        }}
                        aria-label={`View ${project.name} case study`}
                      >
                        <ProjectArt project={project} />
                        <span className={styles.projectHover}>
                          Explore project <Arrow diagonal />
                        </span>
                      </button>
                      <div className={styles.projectMeta}>
                        <div>
                          <h3>{project.name}</h3>
                          <p>{project.line}</p>
                        </div>
                        <span>
                          {project.category} <Arrow diagonal />
                        </span>
                      </div>
                    </motion.article>
                  ))}
              </AnimatePresence>
            </motion.div>
            <div className={styles.workFoot}>
              <span>A FEW GOOD COLLABORATIONS. A LOT OF POSSIBILITIES.</span>
              <a href="#services">
                See what we can do <Arrow diagonal />
              </a>
            </div>
          </section>

          <section
            id="studio"
            className={styles.studio}
            aria-labelledby="studio-title"
          >
            <div className={styles.studioIntro}>
              <span className={styles.eyebrow}>01 / THE STUDIO</span>
              <Reveal>
                <h2 id="studio-title">
                  Small by choice.
                  <br />
                  Ambitious by nature<span>.</span>
                </h2>
              </Reveal>
            </div>
            <div className={styles.studioBody}>
              <Asterisk className={styles.studioStar} />
              <div>
                <p>
                  Good things happen when different minds come together. We’re
                  an independent team of strategists, designers, and developers
                  turning big questions into work that feels unmistakably you.
                </p>
                <p className={styles.muted}>
                  From the first “what if” to the final line of code, we bring
                  curiosity, care, and a healthy amount of obsession. One
                  close-knit team. Every part of the picture.
                </p>
                <a className={styles.underlinedLink} href="#services">
                  Meet your next creative partners <Arrow diagonal />
                </a>
              </div>
            </div>
            <div className={styles.values}>
              <span>Independent in spirit.</span>
              <span>Collaborative by default.</span>
              <span>Built on good chemistry.</span>
            </div>
          </section>

          <section
            id="services"
            className={styles.services}
            aria-labelledby="services-title"
          >
            <div className={styles.servicesIntro}>
              <span className={styles.eyebrow}>02 / WHAT WE DO</span>
              <h2 id="services-title">
                From the big
                <br />
                picture to the
                <br />
                <em>little details.</em>
              </h2>
              <p>
                Strategy, identity, and technology.
                <br />
                Better when they work together.
              </p>
            </div>
            <div className={styles.serviceList}>
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className={styles.service}
                  data-open={openService === index}
                >
                  <h3>
                    <button
                      onClick={() =>
                        setOpenService(openService === index ? null : index)
                      }
                      aria-expanded={openService === index}
                      aria-controls={`service-${index}`}
                    >
                      <span className={styles.serviceNumber}>0{index + 1}</span>
                      {service.title}
                      <span className={styles.servicePlus}>
                        {openService === index ? "−" : "+"}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`service-${index}`}
                    className={styles.serviceAnswer}
                    inert={openService !== index}
                    aria-hidden={openService !== index}
                  >
                    <div>
                      <p>{service.text}</p>
                      <span>{service.items}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.contact} aria-labelledby="contact-title">
            <div className={styles.contactTop}>
              <span className={styles.eyebrow}>HAVE SOMETHING IN MIND?</span>
              <span>
                <span className={styles.dot} /> GOOD CONVERSATIONS START HERE.
              </span>
            </div>
            <button className={styles.contactHeadline} onClick={openInquiry}>
              <h2 id="contact-title">
                Let’s make
                <br />
                <span>what’s next.</span>
              </h2>
              <span className={styles.contactArrow}>
                <Arrow diagonal />
              </span>
            </button>
            <div className={styles.contactBottom}>
              <p>
                A new brand. A better website. A brave idea.
                <br />
                We’d love to hear it.
              </p>
              <button className={styles.pill} onClick={openInquiry}>
                Start a conversation <Arrow diagonal />
              </button>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <a href="#" className={styles.logo} aria-label="Forme back to top">
              forme<span>®</span>
            </a>
            <span>
              GOOD PEOPLE.
              <br />
              GOOD WORK.
            </span>
            <a href="#agency-main">
              Back to top <span>↑</span>
            </a>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 FORME STUDIO</span>
            <span>FICTIONAL STUDIO. REAL POSSIBILITIES.</span>
            <button
              onClick={() => setMotionPaused(!motionPaused)}
              disabled={!!reducedMotion}
              aria-pressed={paused}
            >
              {reducedMotion
                ? "Reduced motion enabled"
                : motionPaused
                  ? "Resume motion ↗"
                  : "Pause motion Ⅱ"}
            </button>
          </div>
        </footer>
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          returnFocus={projectTrigger}
        />
        <InquiryDialog
          open={inquiryOpen}
          setOpen={setInquiryOpen}
          returnFocus={inquiryTrigger}
        />
      </div>
    </MotionConfig>
  );
}
