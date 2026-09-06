"use client";

import { useEffect, useRef } from "react";
import styles from "./agency.module.css";

export function AgencySculpture({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

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
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.z = 8.1;
      const environment = new RoomEnvironment();
      const generator = new THREE.PMREMGenerator(renderer);
      const environmentMap = generator.fromScene(environment, 0.04);
      scene.environment = environmentMap.texture;
      environment.dispose();
      generator.dispose();

      const geometry = new THREE.TorusKnotGeometry(1.18, 0.43, 200, 40, 2, 3);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xf13c08,
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.22,
        envMapIntensity: 0.85,
      });
      const sculpture = new THREE.Mesh(geometry, material);
      sculpture.rotation.set(0.4, -0.45, -0.3);
      scene.add(sculpture);
      const light = new THREE.DirectionalLight(0xffd9bd, 2);
      light.position.set(-3, 5, 5);
      scene.add(light);
      container.appendChild(renderer.domElement);
      container.dataset.ready = "true";

      let visible = true;
      let pointerX = 0;
      let pointerY = 0;
      let phase = 0;
      let lastTime = 0;
      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        renderer.setSize(width, height);
        camera.aspect = width / Math.max(height, 1);
        camera.position.z = 8.1 / Math.min(camera.aspect, 1);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const pointer = (event: PointerEvent) => {
        const bounds = container.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
      };
      const resetPointer = () => {
        pointerX = 0;
        pointerY = 0;
      };
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      intersection.observe(container);
      container.addEventListener("pointermove", pointer);
      container.addEventListener("pointerleave", resetPointer);
      resize();
      renderer.setAnimationLoop((time: number) => {
        const delta = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;
        if (!visible || document.hidden || pausedRef.current) return;
        phase += delta;
        sculpture.rotation.y +=
          (phase * 0.13 + pointerX * 0.4 - sculpture.rotation.y) * 0.035;
        sculpture.rotation.x +=
          (0.4 +
            pointerY * 0.25 +
            window.scrollY * 0.00025 -
            sculpture.rotation.x) *
          0.035;
        sculpture.position.y = Math.sin(phase * 0.65) * 0.075;
        renderer.render(scene, camera);
      });
      cleanup = () => {
        renderer.setAnimationLoop(null);
        observer.disconnect();
        intersection.disconnect();
        container.removeEventListener("pointermove", pointer);
        container.removeEventListener("pointerleave", resetPointer);
        geometry.dispose();
        material.dispose();
        environmentMap.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        delete container.dataset.ready;
      };
    }
    void setup().catch(() => {
      cleanup();
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className={styles.sculpture} ref={host} aria-hidden="true">
      <svg className={styles.sculptureFallback} viewBox="0 0 400 400">
        <defs>
          <linearGradient id="forme-orange">
            <stop stopColor="#ffb36d" />
            <stop offset=".5" stopColor="#ec4716" />
            <stop offset="1" stopColor="#953518" />
          </linearGradient>
        </defs>
        <path
          d="M140 105 C290 0 380 215 235 285 C75 370 10 165 155 120 C330 50 345 320 165 305 C10 290 100 5 235 115 C380 235 125 385 90 220"
          fill="none"
          stroke="url(#forme-orange)"
          strokeWidth="52"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
