import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";

export async function checkExtended(page, origin, foundation) {
  const files = (await readdir("registry", { recursive: true })).filter(
    (path) => /^(animations|recipes)\/.*\.tsx$/.test(path),
  );
  const slugs = files.map((path) => path.split("/").at(-1).replace(".tsx", ""));
  assert.equal(slugs.length, 39);
  for (const slug of slugs.filter((slug) => !foundation.includes(slug))) {
    assert.equal(
      (await page.goto(`${origin}/animations/${slug}`)).status(),
      200,
      slug,
    );
    const preview = page.getByRole("region", {
      name: "Live preview",
      exact: true,
    });
    await preview
      .getByTestId("preview-device")
      .locator("button, input, [role=region]")
      .first()
      .waitFor();
    await page
      .getByRole("button", { name: "Copy prompt", exact: true })
      .click();
    const payload = await (
      await fetch(`${origin}/animations/${slug}/prompt`)
    ).text();
    await page.waitForFunction(
      (expected) => window.copiedSource === expected,
      payload,
    );
    assert.equal(
      await page.evaluate(() => window.copiedSource),
      payload,
      `Exact complete prompt for ${slug}`,
    );
    assert.ok(payload.includes(slug + ".tsx"));
    const example = page.getByTestId("preview-device");
    const button = (name) => example.getByRole("button", { name, exact: true });
    switch (slug) {
      case "reveal":
        await button("Toggle reveal").click();
        await example
          .getByRole("heading", { name: "A new perspective" })
          .waitFor({ state: "hidden" });
        break;
      case "stagger":
        await button("Toggle collection").click();
        await example
          .getByText("A place to begin")
          .waitFor({ state: "hidden" });
        break;
      case "sequential-content":
        await button("Next step").click();
        await example
          .getByRole("heading", { name: "Make it personal" })
          .waitFor();
        break;
      case "animated-list":
        await button("Add task").click();
        await example.getByText("3 tasks", { exact: true }).waitFor();
        await button("Remove last").click();
        await example.getByText("2 tasks", { exact: true }).waitFor();
        break;
      case "shared-element":
        await button("Resize preview").click();
        await example.getByText("A closer look at the same object.").waitFor();
        break;
      case "shared-indicator":
        await button("Yearly").click();
        assert.equal(
          await button("Yearly").getAttribute("aria-pressed"),
          "true",
        );
        break;
      case "auto-height":
        await button("Change content length").click();
        await example
          .getByText("We will send a confirmation when it arrives.")
          .waitFor();
        break;
      case "layout-shift": {
        const before = await example
          .getByText("Design review", { exact: true })
          .boundingBox();
        await button("Reorder priorities").click();
        await page.waitForTimeout(600);
        const after = await example
          .getByText("Design review", { exact: true })
          .boundingBox();
        assert.ok(after.y > before.y + 60);
        break;
      }
      case "pressable":
        await button("Save a change").click();
        await example.getByText("1 changes saved.").waitFor();
        break;
      case "async-button":
        await example.getByLabel("Simulate an error").check();
        await button("Save changes").click();
        await button("Try again").waitFor();
        await example.getByLabel("Simulate an error").uncheck();
        await button("Try again").click();
        await button("Saved").waitFor();
        break;
      case "icon-swap-button":
        await button("Save to favorites").click();
        assert.equal(
          await button("Save to favorites").getAttribute("aria-pressed"),
          "true",
        );
        break;
      case "copy-button":
        await button("Copy sample text").click();
        await page.waitForFunction(
          () =>
            window.copiedSource === "Good motion makes the next step clear.",
        );
        break;
      case "shake":
        await button("Check code").click();
        await example
          .getByText("This code has expired. Request a new invitation.")
          .waitFor();
        break;
      case "toggle-motion":
      case "checkbox-motion":
        await example.getByRole("checkbox").check();
        assert.equal(await example.getByRole("checkbox").isChecked(), true);
        break;
      case "spinner":
      case "dots-loader":
      case "pulse-loader":
      case "skeleton":
      case "shimmer":
        await button("Pause loader").click();
        await button("Resume loader").waitFor();
        assert.equal(
          await example.locator('[data-running="false"]').count(),
          1,
        );
        break;
      case "progress-bar":
      case "circular-progress":
        await example.getByRole("slider").fill("80");
        await page.waitForFunction(
          () =>
            document
              .querySelector('[role="progressbar"]')
              ?.getAttribute("aria-valuenow") === "80",
        );
        break;
      case "loading-swap":
        await button("Resolve content").click();
        await example
          .getByRole("heading", { name: "Your collection is ready" })
          .waitFor();
        break;
      case "page-transition":
        await button("Activity").click();
        await example.getByRole("heading", { name: "Activity" }).waitFor();
        break;
      case "scroll-reveal":
        await example.getByRole("region").evaluate((node) => {
          node.scrollTop = 280;
        });
        await page.waitForTimeout(400);
        assert.equal(
          await example
            .getByRole("heading", { name: "Just in view" })
            .evaluate(
              (node) =>
                getComputedStyle(node.parentElement.parentElement).opacity,
            ),
          "1",
        );
        break;
      case "scroll-progress": {
        const bar = example.locator('[aria-hidden="true"]').first();
        const before = await bar.getAttribute("style");
        await example.getByRole("region").evaluate((node) => {
          node.scrollTop = node.scrollHeight;
        });
        await page.waitForTimeout(200);
        assert.notEqual(await bar.getAttribute("style"), before);
        break;
      }
      case "backdrop":
        await button("Toggle backdrop").click();
        assert.equal(
          await button("Toggle backdrop").getAttribute("aria-pressed"),
          "true",
        );
        break;
      case "modal-motion":
      case "drawer-motion": {
        const trigger = button(
          slug === "modal-motion" ? "Open dialog" : "Open drawer",
        );
        await trigger.click();
        const dialog = page.getByRole("dialog");
        await dialog.waitFor();
        assert.equal(
          await dialog.evaluate((node) =>
            node.contains(document.activeElement),
          ),
          true,
        );
        await page.keyboard.press("Escape");
        await dialog.waitFor({ state: "hidden" });
        assert.equal(
          await trigger.evaluate((node) => node === document.activeElement),
          true,
        );
        break;
      }
      case "popover-motion":
      case "dropdown-motion": {
        const trigger = button(
          slug === "popover-motion" ? "Open popover" : "Open options",
        );
        await trigger.click();
        await button("Close panel").waitFor();
        await button("Close panel").focus();
        await page.keyboard.press("Escape");
        await button("Close panel").waitFor({ state: "hidden" });
        assert.equal(await trigger.getAttribute("aria-expanded"), "false");
        break;
      }
      case "toast-motion":
        await button("Show notification").click();
        await example
          .getByRole("heading", { name: "Collection saved" })
          .waitFor();
        await button("Dismiss notification").click();
        await example
          .getByRole("heading", { name: "Collection saved" })
          .waitFor({ state: "hidden" });
        break;
      case "loading-overlay":
        await button("Refresh collection").click();
        await example.getByLabel("Refreshing collection").waitFor();
        assert.equal(
          await example.locator('[aria-busy="true"][inert]').count(),
          1,
        );
        await button("Finish refresh").click();
        await example
          .getByLabel("Refreshing collection")
          .waitFor({ state: "hidden" });
        break;
      default:
        assert.fail("Missing behavioral check: " + slug);
    }
    if (await preview.getByLabel("Speed", { exact: true }).count())
      await preview.getByLabel("Speed", { exact: true }).selectOption("0.5");
    await preview.getByLabel("Reduced motion", { exact: true }).check();
    await preview.getByLabel("Compact preview").check();
    assert.ok(
      await example.evaluate(
        (node) => node.getBoundingClientRect().width <= 320,
      ),
    );
    await preview.getByRole("button", { name: "Replay", exact: true }).click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await preview.getByLabel("Reduced motion (system)").waitFor();
    assert.equal(
      await preview.getByLabel("Reduced motion (system)").isDisabled(),
      true,
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  await page.goto(`${origin}/animations`);
  await page
    .getByRole("button", { name: "Play Spinner preview", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Pause loader", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Close preview", exact: true })
    .click();
  const spinnerCard = page
    .getByTestId("catalog-card")
    .filter({
      has: page.getByRole("heading", { name: "Spinner", exact: true }),
    });
  await spinnerCard
    .getByRole("button", { name: "Copy prompt", exact: true })
    .click();
  await page.waitForFunction(() =>
    window.copiedSource?.startsWith("Integrate Sleekmation's Spinner"),
  );
  assert.equal(
    await page.evaluate(() => window.copiedSource),
    await (await fetch(`${origin}/animations/spinner/prompt`)).text(),
  );
  await page.goto(`${origin}/animations/fade`);
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw Error("Denied");
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  const fallback = page.getByRole("textbox", {
    name: "Prompt for manual copying",
  });
  await fallback.waitFor();
  assert.equal(
    await fallback.inputValue(),
    await (await fetch(`${origin}/animations/fade/prompt`)).text(),
  );
  await page.goto(`${origin}/animations`);
  await page.route("**/animations/pulse-loader/prompt", (route) =>
    route.fulfill({ status: 503, body: "Unavailable" }),
  );
  const pulse = page
    .getByTestId("catalog-card")
    .filter({
      has: page.getByRole("heading", { name: "PulseLoader", exact: true }),
    });
  await pulse.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await pulse
    .getByText(
      "Could not load the prompt. Check your connection and try again.",
    )
    .waitFor();
  await page.unroute("**/animations/pulse-loader/prompt");
  await pulse
    .getByRole("button", { name: "Try copy again", exact: true })
    .click();
  await page.waitForFunction(() =>
    window.copiedSource?.startsWith("Integrate Sleekmation's PulseLoader"),
  );
  return slugs;
}
