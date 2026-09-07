"use client";

import { useEffect, useId, useRef } from "react";
import type { MotionValue } from "motion/react";
import type { BufferGeometry, Material, WebGLRenderer } from "three";
import { useAgencyMotion } from "./agency-motion";
import styles from "./agency.module.css";

export function AgencySculpture({
  progress,
  variant = "hero",
}: {
  progress: MotionValue<number>;
  variant?: "hero" | "studio";
}) {
  const host = useRef<HTMLDivElement>(null);
  const { paused, compact } = useAgencyMotion();
  const settings = useRef({ paused, compact });
  const refresh = useRef<() => void>(() => {});
  const gradientId = useId();
  useEffect(() => {
    settings.current = { paused, compact };
    refresh.current();
  }, [paused, compact]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    let cleanup = () => {};
    async function setup() {
      const [THREE, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/addons/environments/RoomEnvironment.js"),
      ]);
      if (disposed || !container) return;
      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      const resources: (BufferGeometry | Material)[] = [];
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      const environment = new RoomEnvironment();
      const generator = new THREE.PMREMGenerator(renderer);
      const environmentMap = generator.fromScene(environment, 0.04);
      scene.environment = environmentMap.texture;
      environment.dispose();
      generator.dispose();

      function material(color: number, metalness = 0.1, roughness = 0.3) {
        const value = new THREE.MeshPhysicalMaterial({
          color,
          metalness,
          roughness,
          clearcoat: 1,
          clearcoatRoughness: 0.22,
          envMapIntensity: 0.85,
        });
        resources.push(value);
        return value;
      }
      function mesh(geometry: BufferGeometry, surface: Material) {
        resources.push(geometry);
        return new THREE.Mesh(geometry, surface);
      }
      const orange = material(0xf13c08);
      const chrome = material(0xc5c8bc, 0.95, 0.16);
      const lime = material(0xd9e79e, 0.18, 0.3);
      let bodyGeometry: BufferGeometry;
      if (variant === "studio") {
        const star = new THREE.Shape();
        for (let i = 0; i < 32; i++) {
          const angle = (i / 32) * Math.PI * 2;
          const radius = i % 4 === 0 || i % 4 === 3 ? 1.32 : 0.65;
          const x = Math.cos(angle) * radius,
            y = Math.sin(angle) * radius;
          if (i === 0) star.moveTo(x, y);
          else star.lineTo(x, y);
        }
        star.closePath();
        bodyGeometry = new THREE.ExtrudeGeometry(star, {
          depth: 0.3,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: 0.085,
          bevelThickness: 0.08,
        });
        bodyGeometry.center();
      } else
        bodyGeometry = new THREE.TorusKnotGeometry(1.18, 0.43, 160, 32, 2, 3);
      const body = mesh(bodyGeometry, orange);
      const ring = mesh(
        new THREE.TorusGeometry(
          variant === "hero" ? 0.43 : 1.78,
          variant === "hero" ? 0.12 : 0.055,
          16,
          64,
        ),
        chrome,
      );
      const satellite = mesh(
        new THREE.SphereGeometry(variant === "hero" ? 0.25 : 0.2, 24, 16),
        lime,
      );
      const group = new THREE.Group();
      group.add(body, ring, satellite);
      scene.add(group);
      const light = new THREE.DirectionalLight(0xffd9bd, 2);
      light.position.set(-3, 5, 5);
      scene.add(light);
      container.appendChild(renderer.domElement);

      let visible = false,
        phase = 0,
        previousTime = 0,
        frame = 0,
        contextLost = false;
      let pointerX = 0,
        pointerY = 0,
        easedX = 0,
        easedY = 0;
      function pose(delta = 0) {
        const { paused: still, compact: small } = settings.current;
        const p = still
          ? variant === "studio"
            ? 0.5
            : 0
          : Math.max(0, Math.min(1, progress.get()));
        const gain = 1 - Math.exp(-delta * 7);
        easedX += ((still ? 0 : pointerX) - easedX) * gain;
        easedY += ((still ? 0 : pointerY) - easedY) * gain;
        const idle = still ? 0 : phase;
        if (variant === "hero") {
          body.rotation.set(
            0.4 + p * 0.9 + easedY * 0.2,
            -0.45 + p * 2.5 + Math.sin(idle * 0.18) * 0.24 + easedX * 0.35,
            -0.3 - p * 0.65,
          );
          body.scale.setScalar(0.9 - p * 0.12);
          body.position.set(
            -p * 0.22,
            p * 0.35 + Math.sin(idle * 0.7) * 0.035,
            0,
          );
          ring.position.set(1.52 - p * 0.55, 1.25 + p * 0.3, 0.15);
          ring.rotation.set(0.6 + p * 1.4, -0.5 + p * 0.7, idle * 0.12);
          satellite.position.set(
            -1.38 + p * 0.4,
            -1.48 + p * 0.4 + Math.sin(idle * 0.8) * 0.05,
            0.25,
          );
        } else {
          body.rotation.set(
            0.12 + easedY * 0.2,
            -0.5 + p * 1.3 + easedX * 0.3,
            -0.45 + p * 1.05 + Math.sin(idle * 0.2) * 0.06,
          );
          ring.rotation.set(0.9 + p * 0.9, 0.3 + p * 0.6, -0.2);
          satellite.position.set(
            Math.cos(p * 3.5 + 0.5) * 1.7,
            Math.sin(p * 3.5 + 0.5) * 1.7,
            0.5,
          );
          group.position.y = Math.sin(idle * 0.6) * 0.04;
        }
        group.scale.setScalar(small ? 0.92 : 1);
      }
      function render() {
        if (!contextLost) renderer.render(scene, camera);
      }
      function stop() {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
      }
      function tick(time: number) {
        frame = 0;
        if (
          !visible ||
          document.hidden ||
          settings.current.paused ||
          contextLost
        )
          return;
        const delta = previousTime
          ? Math.min((time - previousTime) / 1000, 0.05)
          : 0;
        previousTime = time;
        phase += delta;
        pose(delta);
        render();
        frame = requestAnimationFrame(tick);
      }
      function sync() {
        stop();
        pose(settings.current.paused ? 1 : 0);
        render();
        if (
          visible &&
          !document.hidden &&
          !settings.current.paused &&
          !contextLost
        )
          frame = requestAnimationFrame(tick);
      }
      function resize() {
        const width = container!.clientWidth;
        const height = container!.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z =
          (variant === "hero" ? 8.9 : 8) / Math.min(camera.aspect, 1);
        camera.updateProjectionMatrix();
        pose();
        render();
      }
      const pointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || settings.current.paused) return;
        const bounds = container!.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
      };
      const resetPointer = () => {
        pointerX = 0;
        pointerY = 0;
      };
      const lost = (event: Event) => {
        event.preventDefault();
        contextLost = true;
        stop();
        delete container!.dataset.ready;
      };
      const restored = () => {
        contextLost = false;
        container!.dataset.ready = "true";
        sync();
      };
      const observer = new ResizeObserver(resize);
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      cleanup = () => {
        stop();
        refresh.current = () => {};
        observer.disconnect();
        intersection.disconnect();
        container!.removeEventListener("pointermove", pointer);
        container!.removeEventListener("pointerleave", resetPointer);
        document.removeEventListener("visibilitychange", sync);
        renderer.domElement.removeEventListener("webglcontextlost", lost);
        renderer.domElement.removeEventListener(
          "webglcontextrestored",
          restored,
        );
        resources.forEach((resource) => resource.dispose());
        environmentMap.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        delete container!.dataset.ready;
      };
      observer.observe(container);
      intersection.observe(container);
      container.addEventListener("pointermove", pointer);
      container.addEventListener("pointerleave", resetPointer);
      document.addEventListener("visibilitychange", sync);
      renderer.domElement.addEventListener("webglcontextlost", lost);
      renderer.domElement.addEventListener("webglcontextrestored", restored);
      refresh.current = sync;
      resize();
      container.dataset.ready = "true";
    }
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loader.disconnect();
        void setup().catch(() => cleanup());
      },
      { rootMargin: "300px" },
    );
    loader.observe(container);
    return () => {
      disposed = true;
      loader.disconnect();
      cleanup();
    };
  }, [progress, variant]);

  return (
    <div
      className={styles.sculpture}
      ref={host}
      aria-hidden="true"
      data-scene={variant}
    >
      <svg className={styles.sculptureFallback} viewBox="0 0 400 400">
        <defs>
          <linearGradient id={gradientId}>
            <stop stopColor="#ffb36d" />
            <stop offset=".5" stopColor="#ec4716" />
            <stop offset="1" stopColor="#953518" />
          </linearGradient>
        </defs>
        {variant === "hero" ? (
          <path
            d="M140 105 C290 0 380 215 235 285 C75 370 10 165 155 120 C330 50 345 320 165 305 C10 290 100 5 235 115 C380 235 125 385 90 220"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="52"
            strokeLinecap="round"
          />
        ) : (
          <g stroke={`url(#${gradientId})`} strokeWidth="42">
            {[0, 45, 90, 135].map((angle) => (
              <path
                key={angle}
                d="M200 70v260"
                transform={`rotate(${angle} 200 200)`}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
