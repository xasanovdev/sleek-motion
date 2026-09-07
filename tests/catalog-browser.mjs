import { checkBaseUI } from "./base-ui-browser.mjs";
import { checkExtended } from "./catalog-extended.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
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
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text) => { window.copiedSource = text; }, write: async (items) => { window.copiedSource = await (await items[0].getType("text/plain")).text(); } } }));
  const slugs = ["fade", "scale-fade", "slide-fade", "content-swap", "directional-content-swap", "collapse"];
  const names = ["Fade", "ScaleFade", "SlideFade", "ContentSwap", "DirectionalContentSwap", "Collapse"];
  await page.goto(`${origin}/animations`);
  assert.equal(await page.getByTestId("catalog-card").count(), 39);
  await page.getByRole("searchbox", { name: "Search animations" }).fill("collapse");
  assert.equal(await page.getByTestId("catalog-card").count(), 1);
  await page.getByRole("searchbox").fill("unmatched-pattern");
  assert.equal(await page.getByTestId("catalog-card").count(), 0);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("group", { name: "Animation category", exact: true }).getByRole("button", { name: "Content", exact: true }).click();
  assert.equal(await page.getByTestId("catalog-card").count(), 6);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.screenshot({ path: "/private/tmp/sleekmation-catalog-desktop.png", fullPage: false });

  for (const [index, slug] of slugs.entries()) {
    const response = await page.goto(`${origin}/animations/${slug}`);
    assert.equal(response.status(), 200);
    assert.equal(await page.getByRole("heading", { level: 1 }).textContent(), names[index]);
    assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute("href")).pathname, `/animations/${slug}`);
    assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 0, "English technical pages do not inherit landing hreflang");
    const folder = index < 3 ? "presence" : slug === "collapse" ? "layout" : "content";
    const sourcePath = `registry/animations/${folder}/${slug}.tsx`;
    await page.getByRole("button", { name: "Copy component", exact: true }).click();
    assert.equal(await page.evaluate(() => window.copiedSource), await readFile(sourcePath, "utf8"));
    await page.getByRole("button", { name: "Copy required files", exact: true }).click();
    const bundle = await page.evaluate(() => window.copiedSource);
    assert.ok(bundle.startsWith(`// --- file: ${sourcePath} ---\n`));
    assert.ok(bundle.includes("// --- file: registry/motion-tokens.ts ---"));
    assert.ok(bundle.includes("// --- file: registry/internal/use-motion-preference.ts ---"));
    assert.equal(await page.getByRole("link", { name: "View on GitHub" }).getAttribute("href"), `https://github.com/xasanovdev/sleek-motion/blob/main/${sourcePath}`);
    await page.getByRole("button", { name: "Replay", exact: true }).click();
    await page.waitForTimeout(500);
    await page.getByRole("combobox", { name: "Speed", exact: true }).click();
    await page.getByRole("option", { name: "0.5×", exact: true }).click();
    await page.getByRole("switch", { name: "Compact preview", exact: true }).check();
    assert.ok(await page.getByTestId("preview-device").evaluate((node) => node.getBoundingClientRect().width <= 320));
    await page.getByRole("switch", { name: "Reduced motion", exact: true }).check();
    if (index < 3) {
      await page.getByRole("button", { name: "Hide message", exact: true }).click();
      await page.waitForTimeout(500);
      assert.equal(await page.getByTestId("demo-motion").count(), 0);
      await page.getByRole("button", { name: "Show message", exact: true }).click();
      await page.waitForTimeout(500);
      assert.equal(await page.getByTestId("demo-motion").count(), 1);
    } else if (slug.includes("swap")) {
      if (slug.startsWith("directional")) await page.getByRole("switch", { name: "RTL", exact: true }).check();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.waitForTimeout(1000);
      assert.ok((await page.getByTestId("demo-state").textContent()).includes("Keep your bearings"));
    } else {
      await page.getByText("Tune this example", { exact: true }).click();
      await page.getByRole("checkbox", { name: "Keep mounted", exact: true }).check();
      await page.getByRole("textbox", { name: "Your note" }).fill("Keep this draft");
      await page.getByRole("button", { name: "More content", exact: true }).click();
      await page.getByRole("button", { name: "Close panel", exact: true }).click();
      await page.waitForTimeout(500);
      assert.equal(await page.getByTestId("demo-motion").getAttribute("aria-hidden"), "true");
      await page.getByRole("button", { name: "Open panel", exact: true }).click();
      assert.equal(await page.getByRole("textbox", { name: "Your note" }).inputValue(), "Keep this draft");
    }
  }
  await page.goto(`${origin}/animations/fade`);
  await page.evaluate(() => document.fonts.ready);
  const promptDetails = page.locator("#prompt-toggle");
  assert.equal(await promptDetails.getAttribute("aria-expanded"), "false", "Full prompt starts collapsed");
  await page.getByRole("button", { name: "Read the prompt", exact: true }).focus();
  await page.keyboard.press("Enter");
  assert.equal(await promptDetails.getAttribute("aria-expanded"), "true", "Keyboard activation reveals the full prompt");
  assert.equal(await page.getByLabel("Integration prompt", { exact: true }).textContent(), await (await page.request.get(`${origin}/animations/fade/prompt`)).text());
  await promptDetails.click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "/private/tmp/sleekmation-detail-desktop.png", fullPage: false });
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Denied"); } } }));
  await page.getByRole("button", { name: "Copy component", exact: true }).click();
  assert.equal(await page.getByText("Copy failed. Select the source below and copy it manually.", { exact: true }).count(), 1);
  assert.equal((await page.goto(`${origin}/animations/not-a-component`)).status(), 404);

  const allSlugs = await checkExtended(page, origin, slugs);
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 812 });
    for (const route of ["/animations", ...allSlugs.map((slug) => `/animations/${slug}`), "/", "/uz"]) {
      await page.goto(`${origin}${route}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `No horizontal page overflow: ${route} at ${width}px`);
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${origin}/animations/fade`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "/private/tmp/sleekmation-fade-mobile.png", fullPage: false });
  await page.getByRole("region", { name: "Live preview", exact: true }).screenshot({ path: "/private/tmp/sleekmation-studio-mobile.png" });
  await page.goto(`${origin}/animations/directional-content-swap`);
  await page.getByText("Browse animations", { exact: true }).click();
  await page.getByRole("link", { name: "Collapse", exact: true }).filter({ visible: true }).click();
  await page.waitForURL("**/animations/collapse");
  await page.getByRole("heading", { name: "Collapse", exact: true, level: 1 }).waitFor();
  assert.equal(await page.getByRole("heading", { level: 1 }).textContent(), "Collapse");
  await page.screenshot({ path: "/private/tmp/sleekmation-detail-mobile.png", fullPage: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await page.getByRole("switch", { name: "Reduced motion (system)", exact: true }).isChecked(), true);
  assert.equal(await page.getByRole("switch", { name: "Reduced motion (system)", exact: true }).isDisabled(), true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const slug of ["modal-motion", "drawer-motion"]) {
    await page.goto(`${origin}/animations/${slug}`);
    await page.getByRole("button", { name: slug === "modal-motion" ? "Open dialog" : "Open drawer", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    await page.waitForFunction(() => {
      const surface = document.querySelector('[role="dialog"]');
      return surface && getComputedStyle(surface).opacity === "1";
    });
    const box = await dialog.boundingBox();
    if (slug === "modal-motion") {
      assert.ok(Math.abs(box.x + box.width / 2 - 375 / 2) < 2, "Dialog is horizontally centered");
      assert.ok(Math.abs(box.y + box.height / 2 - 812 / 2) < 2, "Dialog is vertically centered");
    } else {
      assert.ok(Math.abs(box.x + box.width - 375) < 2, "Drawer attaches to the right edge");
    }
    assert.ok(box.width <= 375 && box.x >= 0 && box.x + box.width <= 375, "Overlay fits mobile viewport");
    await page.screenshot({ path: `/private/tmp/sleekmation-${slug}-mobile.png` });
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin);
  const duplicate = page.locator('.animation-marquee button[data-duplicate]').first();
  await duplicate.focus();
  assert.equal(await duplicate.evaluate((node) => !!node.closest('[aria-hidden="true"]')), false);
  const selector = page.locator('.animation-marquee button:not([data-duplicate])').first();
  await selector.focus();
  await page.keyboard.down("Space");
  assert.equal(await selector.evaluate((node) => getComputedStyle(node).transform), "none", "CSS press feedback does not scale keyboard input");
  await page.keyboard.up("Space");
  await page.waitForTimeout(300);
  await page.locator('.animation-marquee button:not([data-duplicate])').nth(1).click();
  await page.waitForFunction(() => !!document.querySelector('[data-playground-part="panel"] [inert][aria-hidden="true"]'), null, { timeout: 1500 });
  await checkBaseUI(page, origin);
  assert.deepEqual(errors, []);
  console.log("PASS: catalog search/filter, 39 static detail routes and prompts, behavioral examples, metadata, exact source copying, copy errors, preview controls, kept state, mobile navigation, 320/375px layouts and reduced motion.");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  if (server.exitCode === null) await once(server, "exit");
}
