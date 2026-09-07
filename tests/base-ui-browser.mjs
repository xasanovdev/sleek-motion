import assert from "node:assert/strict";

export async function checkBaseUI(page, origin) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${origin}/animations`);
  const sidebar = page.locator(".catalog-sidebar");
  const presence = sidebar.getByRole("button", { name: "Presence", exact: true });
  await presence.click();
  await sidebar.getByRole("link", { name: "Fade", exact: true }).waitFor({ state: "hidden" });
  await presence.press("Enter");
  await sidebar.getByRole("link", { name: "Fade", exact: true }).waitFor();
  await presence.press("ArrowDown");
  assert.equal(await sidebar.getByRole("button", { name: "Content", exact: true }).evaluate((el) => el === document.activeElement), true, "Accordion owns heading keyboard navigation");
  await page.screenshot({ path: "/private/tmp/sleekmation-base-ui-desktop.png" });

  for (const width of [320, 375, 768, 1023]) {
    await page.setViewportSize({ width, height: 812 });
    const trigger = page.getByRole("button", { name: "Browse animations", exact: true });
    await trigger.click();
    const sheet = page.getByRole("dialog", { name: "Animation library", exact: true });
    await sheet.waitFor();
    const close = sheet.getByRole("button", { name: "Close navigation" });
    await close.focus();
    await page.keyboard.press("Shift+Tab");
    assert.equal(await sheet.evaluate((el) => el.contains(document.activeElement)), true, "Mobile navigation traps keyboard focus");
    const finalLink = sheet.getByRole("link", { name: "LoadingOverlay", exact: true });
    await finalLink.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await finalLink.hover();
    await page.mouse.wheel(0, 1200);
    assert.equal(await page.evaluate(() => scrollY), before, "Navigation scroll does not move the page");
    assert.ok(await sheet.evaluate((el) => el.scrollWidth <= el.clientWidth + 1), "Navigation fits narrow screens");
    if (width === 375) {
      await sheet.getByRole("link", { name: "Overview", exact: false }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: "/private/tmp/sleekmation-base-ui-mobile.png" });
    }
    await page.keyboard.press("Escape");
    await sheet.waitFor({ state: "hidden" });
    assert.equal(await trigger.evaluate((el) => el === document.activeElement), true, "Escape restores the navigation trigger");
  }
  const trigger = page.getByRole("button", { name: "Browse animations", exact: true });
  await trigger.click();
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal(await sidebar.isVisible(), true, "Desktop sidebar replaces the mobile sheet at the breakpoint");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(origin);
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  const landing = page.getByRole("dialog");
  await landing.getByRole("link", { name: "Principles", exact: true }).click();
  await landing.waitFor({ state: "hidden" });
  assert.ok(page.url().endsWith("#principles"), "Landing navigation follows the selected section");

  await page.goto(`${origin}/animations/directional-content-swap`);
  const speed = page.getByRole("combobox", { name: "Speed", exact: true });
  await speed.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("listbox").waitFor();
  await page.getByRole("option", { name: "2×", exact: true }).click();
  assert.match(await speed.textContent(), /2×/);
  await speed.press("Enter");
  await page.keyboard.press("Escape");
  assert.equal(await speed.evaluate((el) => el === document.activeElement), true, "Select restores focus after Escape");
  const reduced = page.getByRole("switch", { name: "Reduced motion", exact: true });
  await reduced.focus();
  await page.keyboard.press("Space");
  assert.equal(await reduced.isChecked(), true, "Switch supports keyboard activation");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await page.getByRole("switch", { name: "Reduced motion (system)", exact: true }).isDisabled(), true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  console.log("PASS: Base UI accordion, modal navigation, focus trapping/restoration, scroll containment, breakpoints, selects and switches.");
}
