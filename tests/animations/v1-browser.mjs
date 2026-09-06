import assert from "node:assert/strict";

export async function checkV1(page) {
  const item = (id) => page.getByTestId(id);
  const click = (name) => page.getByRole("button", { name, exact: true }).click();
  const settle = () => page.waitForTimeout(700);
  const x = () => item("sequence").first().evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41);

  await item("sequence").scrollIntoViewIfNeeded();
  assert.equal(await item("sequence").evaluate((node) => node.tagName), "ARTICLE");
  await click("Sequence next");
  await page.waitForTimeout(80);
  assert.ok(await x() < 0, "Forward exit travels left");
  assert.equal(await item("sequence").first().evaluate((node) => node.inert), true);
  await settle();
  await click("Sequence back");
  await page.waitForTimeout(80);
  assert.ok(await x() > 0, "Backward exit travels right");
  await settle();
  await click("Sequence RTL");
  await click("Sequence next");
  await page.waitForTimeout(80);
  assert.ok(await x() > 0, "RTL forward exit travels right");
  await settle();
  await page.getByRole("button", { name: "Sequence next", exact: true }).evaluate((node) => {
    node.click(); setTimeout(() => node.click(), 20); setTimeout(() => node.click(), 40);
  });
  await settle();
  assert.equal(await item("sequence").count(), 1);
  assert.ok((await item("sequence").textContent()).startsWith("Step 4"));

  await click("Async ref");
  assert.equal(await item("async-ref").textContent(), "BUTTON");
  await item("async").focus();
  await page.getByRole("button", { name: "Async loading", exact: true }).evaluate((node) => node.click());
  assert.equal(await item("async").evaluate((node) => node === document.activeElement), true, "Loading keeps focus");
  assert.equal(await item("async").getAttribute("aria-busy"), "true");
  assert.equal(await item("async").getAttribute("aria-disabled"), "true");
  await page.keyboard.press("Enter");
  await item("async").evaluate((node) => { node.click(); node.click(); });
  assert.equal(await item("async-clicks").textContent(), "0", "Loading ignores duplicate activation");
  assert.equal(await item("async-submits").textContent(), "0", "Loading prevents native form submission");
  await click("Async success");
  await click("Async error");
  await settle();
  assert.equal(await item("async").textContent(), "Try again");
  await item("async").click();
  assert.equal(await item("async-clicks").textContent(), "1");
  assert.equal(await item("async-submits").textContent(), "1");

  await item("icon-button").focus();
  await page.keyboard.down("Space");
  await page.waitForTimeout(100);
  assert.equal(await item("icon-button").evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a), 1);
  await page.keyboard.up("Space");
  await settle();
  assert.equal(await item("icon-button").getAttribute("aria-pressed"), "true");
  assert.equal(await page.getByRole("button", { name: "Favorite", exact: true }).count(), 1);
  assert.equal(await item("icon").count(), 1);
  assert.equal(await item("icon").textContent(), "Filled star");

  await page.evaluate(() => {
    window.clipboardChecks = [];
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: (text) => new Promise((resolve, reject) => window.clipboardChecks.push({ text, resolve, reject })),
    } });
  });
  const requests = () => page.evaluate(() => window.clipboardChecks.length);
  const resolveCopy = (index) => page.evaluate((i) => window.clipboardChecks[i].resolve(), index);
  await item("copy-prevented").click();
  await item("copy-disabled").evaluate((node) => node.click());
  assert.equal(await requests(), 0);
  await item("copy").evaluate((node) => { node.click(); node.click(); });
  assert.equal(await requests(), 1, "Same-tick double clicks write once");
  assert.equal(await item("copy").getAttribute("data-status"), "loading");
  await resolveCopy(0);
  await page.waitForTimeout(50);
  assert.equal(await item("copy").getAttribute("data-status"), "success");
  assert.equal(await item("copied-value").textContent(), "First source");
  await page.waitForTimeout(800);
  assert.equal(await item("copy").getAttribute("data-status"), "idle");

  await item("copy").click();
  await page.evaluate(() => window.clipboardChecks[1].reject(new Error("Denied")));
  await page.waitForTimeout(50);
  assert.equal(await item("copy").getAttribute("data-status"), "error");
  assert.equal(await item("copy-errors").textContent(), "1");
  await item("copy").click();
  await resolveCopy(2);
  await page.waitForTimeout(50);
  assert.equal(await item("copy").getAttribute("data-status"), "success", "Failure can be retried");
  await item("copy").click();
  await page.waitForTimeout(850);
  assert.equal(await item("copy").getAttribute("data-status"), "loading", "Old reset cannot erase a new attempt");
  await click("Copy source");
  await resolveCopy(3);
  assert.equal(await item("copy").getAttribute("data-status"), "idle", "Old text completion is ignored");
  await click("Copy source");
  assert.equal(await item("copy").getAttribute("data-status"), "idle", "Returning to old text never restores stale loading");
  await item("copy").click();
  await click("Copy mount");
  await resolveCopy(4);
  await click("Copy mount");
  assert.equal(await item("copy").getAttribute("data-status"), "idle");
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }));
  await item("copy").click();
  assert.equal(await item("copy").getAttribute("data-status"), "error", "Unavailable clipboard exposes a recoverable failure");
  assert.equal(await item("copy-errors").textContent(), "2");

  await click("Overlay toggle");
  await settle();
  assert.equal(await page.getByRole("status", { name: "Loading report" }).count(), 1);
  assert.equal(await item("busy-action").evaluate((node) => !!node.closest("[inert]")), true);
  await click("Overlay toggle");
  assert.equal(await item("loading-overlay").evaluate((node) => node.inert), true);
  await settle();
  assert.equal(await item("loading-overlay").count(), 0);
  assert.equal(await item("busy-action").evaluate((node) => !!node.closest("[inert]")), false);
  assert.equal(await item("dropdown-styled").evaluate((node) => getComputedStyle(node).transformOrigin), "10px 5px");
  assert.equal(await item("dropdown-origin").evaluate((node) => getComputedStyle(node).transformOrigin), "100px 0px");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await click("Sequence back");
  await page.waitForTimeout(80);
  assert.equal(await x(), 0, "Sequential motion respects a live reduced-motion preference");
  await settle();
}
