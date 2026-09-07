import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { chromium } from "playwright";

const probe = createServer();
probe.listen(0, "127.0.0.1");
await once(probe, "listening");
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port), "--hostname", "127.0.0.1"], { stdio: ["ignore", "pipe", "pipe"] });
let logs = "";
server.stdout.on("data", (chunk) => { logs += chunk; });
server.stderr.on("data", (chunk) => { logs += chunk; });
const origin = `http://127.0.0.1:${port}`;
let browser;
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(origin)).ok) break; } catch {}
    if (attempt === 99 || server.exitCode !== null) throw new Error(logs);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && /hydrat|react|uncaught/i.test(message.text())) errors.push(message.text()); });
  if (process.argv.includes("--capture-project")) {
    await page.setViewportSize({ width: 1280, height: 920 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: "public/experiments/thread-preview/sleekmation.png" });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  const route = `${origin}/experiments/thread-preview`;
  const response = await page.goto(route);
  assert.equal(response.status(), 200);
  await page.evaluate(() => document.fonts.ready);
  const word = page.getByRole("button", { name: "interfaces", exact: true });
  const card = page.getByTestId("thread-project");
  const path = page.getByTestId("thread-path");
  async function checkArrival(direction) {
    const { points, heading } = await path.evaluate((node) => {
      const length = node.getTotalLength();
      const points = Array.from({ length: 101 }, (_, index) => {
        const point = node.getPointAtLength(length * index / 100);
        return { x: point.x, y: point.y };
      });
      // Measure the final half pixel; the full curve sample is too coarse for its tip.
      const tip = node.getPointAtLength(length);
      const before = node.getPointAtLength(length - 0.5);
      return { points, heading: { dx: tip.x - before.x, dy: tip.y - before.y } };
    });
    const { dx, dy } = heading;
    if (direction === "down") {
      assert.ok(dy > 0 && Math.abs(dx) < dy * 0.2, "Mobile arrow arrives pointing down");
    } else {
      assert.ok(dx > 0 && Math.abs(dy) < dx * 0.2, "Desktop arrow arrives pointing right");
    }
    for (let index = 1; index < points.length; index++) {
      assert.ok(points[index].y >= points[index - 1].y - 0.1, "Path flows downward without an upward hook");
    }
  }
  const closedPath = await path.getAttribute("d");
  const opacity = () => card.evaluate((node) => Number(getComputedStyle(node).opacity));
  const waitOpen = () => page.waitForFunction(() => getComputedStyle(document.querySelector('[data-testid="thread-project"]')).opacity === "1");
  const waitClosed = () => page.waitForFunction(() => getComputedStyle(document.querySelector('[data-testid="thread-project"]')).opacity === "0");
  assert.equal(await word.getAttribute("aria-expanded"), "false");
  assert.equal(await card.evaluate((node) => node.inert), true);
  assert.equal(await opacity(), 0);
  assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, nofollow");
  await page.screenshot({ path: "/private/tmp/thread-preview-rest.png" });

  await page.getByRole("checkbox", { name: "Slow motion", exact: true }).check();
  await word.hover();
  await page.waitForTimeout(120);
  assert.notEqual(await path.getAttribute("d"), closedPath, "Thread extends during the entrance");
  assert.equal(await opacity(), 0, "The image waits for the thread to reach it");
  const earlyClip = await card.evaluate((node) => getComputedStyle(node).clipPath);
  await page.screenshot({ path: "/private/tmp/thread-preview-opening.png" });
  await waitOpen();
  await page.waitForTimeout(1500);
  await checkArrival("right");
  assert.notEqual(await card.evaluate((node) => getComputedStyle(node).clipPath), earlyClip, "Image opens from the thread's end");
  assert.equal(await card.locator("img").evaluate((node) => node.complete && node.naturalWidth > 0), true);
  const wordBox = await word.boundingBox();
  const cardBox = await card.boundingBox();
  await page.mouse.move(wordBox.x + wordBox.width, wordBox.y + wordBox.height / 2);
  await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2, { steps: 30 });
  await page.waitForTimeout(250);
  assert.equal(await word.getAttribute("aria-expanded"), "true", "Preview remains available while crossing the bridge and hovering it");
  await page.screenshot({ path: "/private/tmp/thread-preview-desktop.png" });
  await page.mouse.move(10, 10);
  await waitClosed();
  assert.equal(await card.evaluate((node) => node.inert), true);
  await page.waitForFunction((expected) => document.querySelector('[data-testid="thread-path"]').getAttribute("d") === expected, closedPath);
  assert.equal(await path.getAttribute("d"), closedPath, "Thread returns to the original underline");
  await page.getByRole("checkbox", { name: "Slow motion", exact: true }).uncheck();

  // Interrupt both directions before the timeline completes.
  for (let index = 0; index < 3; index++) {
    await word.hover(); await page.waitForTimeout(80);
    await page.mouse.move(10, 10); await page.waitForTimeout(200);
  }
  await word.hover();
  await waitOpen();
  await word.click();
  await page.mouse.move(10, 10);
  await page.waitForTimeout(300);
  assert.equal(await word.getAttribute("aria-expanded"), "true", "Click pins the preview");
  await page.getByRole("button", { name: "Close project preview" }).click();
  await waitClosed();
  assert.equal(await word.evaluate((node) => node === document.activeElement), true);

  // Keyboard focus reveals immediately and hidden controls are unreachable.
  await page.getByRole("link", { name: "Library", exact: true }).focus();
  await page.keyboard.press("Tab");
  assert.equal(await word.evaluate((node) => node === document.activeElement), true);
  await page.waitForTimeout(40);
  assert.equal(await opacity(), 1);
  assert.equal(await card.evaluate((node) => getComputedStyle(node).clipPath), "none");
  await page.keyboard.press("Tab");
  assert.equal(await page.getByRole("button", { name: "Close project preview" }).evaluate((node) => node === document.activeElement), true);
  await page.keyboard.press("Escape");
  await waitClosed();
  assert.equal(await word.evaluate((node) => node === document.activeElement), true);
  await page.keyboard.press("Tab");
  assert.equal(await page.getByRole("checkbox", { name: "Slow motion", exact: true }).evaluate((node) => node === document.activeElement), true, "Dismissed preview is skipped by Tab");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await word.hover();
  await page.waitForTimeout(40);
  assert.equal(await opacity(), 1);
  assert.equal(await card.evaluate((node) => getComputedStyle(node).clipPath), "none");
  assert.equal(await page.getByRole("checkbox", { name: "Reduced motion (system)", exact: true }).isDisabled(), true);
  await page.mouse.move(10, 10);
  await waitClosed();
  await page.emulateMedia({ reducedMotion: "no-preference" });

  for (const width of [1024, 768, 721, 720, 600, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await word.click();
    await waitOpen();
    await page.waitForTimeout(700);
    await checkArrival(width <= 720 ? "down" : "right");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `No horizontal overflow at ${width}px`);
    const box = await card.boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= width, `Preview fits at ${width}px`);
    if (width === 375) await page.screenshot({ path: "/private/tmp/thread-preview-mobile.png", fullPage: true });
  }

  const touch = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  const touchPage = await touch.newPage();
  await touchPage.goto(route);
  const touchWord = touchPage.getByRole("button", { name: "interfaces", exact: true });
  await touchWord.tap();
  assert.equal(await touchWord.getAttribute("aria-expanded"), "true");
  await touchPage.waitForTimeout(700);
  await touchWord.tap();
  assert.equal(await touchWord.getAttribute("aria-expanded"), "false");
  await touch.close();

  if (process.argv.includes("--record")) {
    const recording = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: "/private/tmp/thread-preview-recording", size: { width: 1440, height: 1000 } } });
    const demo = await recording.newPage();
    await demo.goto(route);
    await demo.evaluate(() => document.fonts.ready);
    await demo.waitForTimeout(800);
    await demo.getByRole("button", { name: "interfaces", exact: true }).hover();
    await demo.waitForTimeout(1800);
    await demo.mouse.move(10, 10);
    await demo.waitForTimeout(1200);
    await demo.getByRole("button", { name: "interfaces", exact: true }).hover();
    await demo.waitForTimeout(1500);
    const video = demo.video();
    await recording.close();
    await video.saveAs("/private/tmp/thread-preview-demo.webm");
  }

  assert.deepEqual(errors, []);
  console.log("PASS: ThreadPreview entrance/return, hover bridge, reversals, pin/dismiss, keyboard focus, inert content, reduced motion, touch and 320–1440px layouts.");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  if (server.exitCode === null) await once(server, "exit");
}
