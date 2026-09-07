import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm, symlink, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import ts from "typescript";
import { registryManifest } from "../registry/manifest.ts";
import { getRegistrySource } from "../lib/registry-source.ts";
import { getAnimationPrompt, getUsageExample } from "../lib/animation-prompt.ts";
import { animationDocs } from "../content/animations.ts";

const root = process.cwd();
const output = await mkdtemp(join(tmpdir(), "sleekmation-copy-"));
try {
  const sources = (await readdir(join(root, "registry"), { recursive: true })).filter((path) => /^(animations|recipes)\/.*\.tsx$/.test(path)).map((path) => `registry/${path}`);
  assert.deepEqual(new Set(registryManifest.map((entry) => entry.source)), new Set(sources), "Every component has a manifest entry");
  assert.equal(new Set(registryManifest.map((entry) => entry.slug)).size, registryManifest.length);
  for (const entry of registryManifest) {
    const source = getRegistrySource(entry.slug);
    const destination = join(output, entry.slug);
    const included = new Set(source.files.map((file) => file.path));
    assert.equal(source.files[0].path, entry.source);
    assert.deepEqual(source.dependencies, ["motion", "react"]);
    assert.equal(source.bundle.split("// --- file: ").length - 1, source.files.length);
    for (const file of source.files) {
      const path = join(destination, file.path);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, file.code);
      // Independently inspect import declarations instead of reusing the source resolver's regex.
      if (!file.path.endsWith(".css")) {
        const parsed = ts.createSourceFile(file.path, file.code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        for (const node of parsed.statements) {
          if (!(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) || !node.moduleSpecifier) continue;
          const specifier = node.moduleSpecifier.text;
          if (!specifier.startsWith(".")) { assert.match(specifier, /^(react|motion)(\/|$)/); continue; }
          const target = join(dirname(file.path), specifier);
          assert.ok([target, `${target}.ts`, `${target}.tsx`, `${target}/index.ts`].some((path) => included.has(path)), `${entry.name} includes ${specifier}`);
        }
      }
    }
    const example = animationDocs.find((doc) => doc.slug === entry.slug);
    const input = example ? join(destination, "example.tsx") : join(destination, entry.source);
    assert.ok(example, entry.slug + " has a documented working example");
    const usage = getUsageExample(entry.slug);
    await writeFile(input, usage);
    const prompt = getAnimationPrompt(entry.slug);
    assert.ok(prompt.includes(usage.trimEnd()), "Prompt contains the tested example");
    assert.ok(prompt.includes("https://github.com/xasanovdev/sleek-motion"));
    for (const file of source.files) assert.ok(prompt.includes(file.code.trimEnd()), "Prompt contains complete " + file.path);
    assert.match(prompt, /React 19 and Motion 13/);
    if (usage.includes("@base-ui/react/")) assert.match(prompt, /example also imports @base-ui\/react 1\.8/);
    execFileSync("bun", ["build", input, "--outdir", join(destination, "build"), "--external", "react", "--external", "react/*", "--external", "motion", "--external", "motion/*", "--external", "@base-ui/react/*"], { stdio: "pipe" });
  }
  await symlink(join(root, "node_modules"), join(output, "node_modules"), "dir");
  await writeFile(join(output, "css.d.ts"), 'declare module "*.module.css" { const classes: Record<string, string>; export default classes; }');
  await writeFile(join(output, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2020", module: "ESNext", moduleResolution: "bundler", jsx: "react-jsx", strict: true, skipLibCheck: true, noEmit: true, lib: ["es2020", "dom", "dom.iterable"] }, include: ["**/*.ts", "**/*.tsx"], exclude: ["node_modules", "**/build"] }));
  execFileSync(process.execPath, [join(root, "node_modules/typescript/bin/tsc"), "-p", join(output, "tsconfig.json")], { stdio: "pipe" });
  assert.throws(() => getRegistrySource("../../package.json"));
  console.log(`PASS: ${registryManifest.length} complete, isolated source bundles; ${animationDocs.length} usage examples and complete integration prompts; standalone TypeScript; no showcase imports.`);
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  throw error;
} finally { await rm(output, { recursive: true, force: true }); }
