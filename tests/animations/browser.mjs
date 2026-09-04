import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve an installed Playwright, or use the host's existing bundled runtime.
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const output = await mkdtemp(join(tmpdir(), "sleekmation-test-"));
let browser;
let server;
try {
  execFileSync(
    "bun",
    [
      "build",
      "tests/animations/fixture.tsx",
      "--outdir",
      output,
      "--target",
      "browser",
    ],
    { cwd: root, stdio: "pipe" },
  );
  execFileSync("bun", ["build", "tests/animations/render.tsx", "--outdir", join(output, "server"), "--target", "bun"], { cwd: root, stdio: "pipe" });
  const html = execFileSync("bun", [join(output, "server/render.js")], { cwd: root, encoding: "utf8" });
  await writeFile(
    join(output, "index.html"),
    `<!doctype html><html><head><link rel="stylesheet" href="/fixture.css"></head><body><div id="root">${html}</div><script type="module" src="/fixture.js"></script></body></html>`,
  );
  server = createServer(async (req, res) => {
    const name =
      req.url === "/fixture.js"
        ? "fixture.js"
        : req.url === "/fixture.css"
          ? "fixture.css"
          : "index.html";
    try {
      res.setHeader(
        "Content-Type",
        name.endsWith(".js")
          ? "text/javascript"
          : name.endsWith(".css")
            ? "text/css"
            : "text/html",
      );
      res.end(await readFile(join(output, name)));
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  });
  const page = await browser.newPage({
    reducedMotion: "no-preference",
    viewport: { width: 1000, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const item = (name) => page.getByTestId(name);
  const click = (name) =>
    page.getByRole("button", { name, exact: true }).click();
  const settled = () => page.waitForTimeout(600);
  await settled();
  await click("Ref");
  assert.equal(
    await item("ref-result").textContent(),
    "LI",
    "Polymorphic element and forwarded ref",
  );
  assert.equal(
    await item("collapse").evaluate((node) =>
      Math.round(node.getBoundingClientRect().height),
    ),
    40,
  );
  await click("Resize");
  await settled();
  assert.equal(
    await item("collapse").evaluate((node) =>
      Math.round(node.getBoundingClientRect().height),
    ),
    160,
    "Collapse follows dynamic size",
  );
  assert.equal(
    await item("auto").evaluate((node) =>
      Math.round(node.getBoundingClientRect().height),
    ),
    140,
    "AutoHeight follows dynamic size",
  );
  await click("Toggle");
  assert.equal(
    await item("fade").evaluate((node) => node.inert),
    true,
    "Exiting content becomes inert immediately",
  );
  await settled();
  assert.equal(await item("fade").count(), 0, "Exit removes content");
  assert.equal(
    await item("collapse").count(),
    0,
    "Collapse unmounts by default",
  );
  assert.equal(await item("kept").getAttribute("aria-hidden"), "true");
  assert.equal(
    await item("kept").evaluate(
      (node) => node.inert && node.getBoundingClientRect().height === 0,
    ),
    true,
  );
  await click("Toggle");
  await settled();
  await page
    .getByRole("button", { name: "Toggle", exact: true })
    .evaluate((node) => {
      node.click();
      setTimeout(() => node.click(), 30);
      setTimeout(() => node.click(), 60);
      setTimeout(() => node.click(), 90);
    });
  await settled();
  assert.equal(
    await item("fade").count(),
    1,
    "Rapid reversal preserves final visibility",
  );
  assert.equal(
    await item("collapse").evaluate((node) =>
      Math.round(node.getBoundingClientRect().height),
    ),
    160,
  );
  await page
    .getByRole("button", { name: "Next", exact: true })
    .evaluate((node) => {
      node.click();
      setTimeout(() => node.click(), 20);
      setTimeout(() => node.click(), 40);
    });
  await settled();
  for (const [id, value] of [
    ["swap", "Step 3"],
    ["pop", "Pop 3"],
    ["directional", "Direction 3"],
  ]) {
    assert.equal(await item(id).count(), 1, `${id} cleans up stale states`);
    assert.equal(await item(id).textContent(), value);
  }
  await click("RTL");
  await click("Next");
  const rtlX = await item("directional")
    .first()
    .evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41);
  assert.ok(rtlX >= 0, "RTL exit moves right for a forward step");
  await settled();
  assert.equal(
    await item("progress").getAttribute("aria-valuenow"),
    "100",
    "Progress clamps overflows",
  );
  assert.equal(await item("circle").getAttribute("aria-valuenow"), "100");
  assert.equal(await item("indeterminate").getAttribute("aria-valuenow"), null);
  await click("List");
  await settled();
  assert.equal(await item("item-2").count(), 0);
  assert.equal(await item("item-4").count(), 1);
  await item("press").focus();
  await page.keyboard.down("Space");
  assert.equal(
    await item("press").evaluate(
      (node) => new DOMMatrix(getComputedStyle(node).transform).a,
    ),
    1,
    "Keyboard press does not scale",
  );
  await page.keyboard.up("Space");
  const box = await item("press").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(100);
  assert.ok(
    await item("press").evaluate(
      (node) => new DOMMatrix(getComputedStyle(node).transform).a < 1,
    ),
    "Pointer press scales",
  );
  await page.mouse.up();
  assert.equal(await item("spinner").getAttribute("data-running"), "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await settled();
  assert.equal(
    await item("spinner").getAttribute("data-running"),
    "false",
    "Live reduced-motion preference pauses loops",
  );
  await click("Toggle");
  await settled();
  await click("Toggle");
  await page.waitForTimeout(50);
  assert.equal(
    await item("slide").evaluate(
      (node) => new DOMMatrix(getComputedStyle(node).transform).m42,
    ),
    0,
  );
  assert.equal(
    await item("scale").evaluate(
      (node) => new DOMMatrix(getComputedStyle(node).transform).a,
    ),
    1,
  );
  await settled();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await settled();
  await item("scroll-reveal").scrollIntoViewIfNeeded();
  await settled();
  assert.equal(
    await item("scroll-reveal").evaluate(
      (node) => getComputedStyle(node).opacity,
    ),
    "1",
  );
  assert.equal(
    await item("spinner").getAttribute("data-running"),
    "false",
    "Offscreen loops pause",
  );
  assert.deepEqual(errors, [], "No browser or React errors");
  console.log(
    "PASS: SSR/hydration, refs, semantic tags, enter/exit, rapid toggles/swaps, dynamic height, inert content, RTL, lists, keyboard/pointer, progress, live reduced motion, viewport and loop pausing.",
  );
} finally {
  await browser?.close();
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(output, { recursive: true, force: true });
}
