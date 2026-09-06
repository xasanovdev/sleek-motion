import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, relative, sep } from "node:path";
import { registryManifest } from "../registry/manifest";

export type SourceFile = { path: string; code: string };
export type RegistrySource = { files: SourceFile[]; dependencies: string[]; bundle: string };

/** Runs on the server at build time. Only manifest entries can select source files. */
export function getRegistrySource(slug: string): RegistrySource {
  const entry = registryManifest.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Unknown registry entry: ${slug}`);
  const root = resolve(process.cwd(), "registry");
  const files: SourceFile[] = [];
  const visited = new Set<string>();
  const dependencies = new Set<string>();

  function visit(path: string) {
    const absolute = resolve(path);
    if (!absolute.startsWith(root + sep)) throw new Error("Registry imports must stay inside registry/.");
    if (visited.has(absolute)) return;
    visited.add(absolute);
    const code = readFileSync(absolute, "utf8");
    files.push({ path: `registry/${relative(root, absolute).split(sep).join("/")}`, code });
    // Registry sources use static imports/exports, including type and CSS imports.
    const imports = code.matchAll(/\b(?:from\s+|import\s*)(["'])([^"']+)\1/g);
    for (const match of imports) {
      const specifier = match[2];
      if (!specifier.startsWith(".")) {
        const dependency = specifier.split("/")[0];
        if (dependency !== "react" && dependency !== "motion") throw new Error(`Unexpected registry dependency: ${specifier}`);
        dependencies.add(dependency);
        continue;
      }
      const base = resolve(dirname(absolute), specifier);
      const target = [base, `${base}.ts`, `${base}.tsx`, resolve(base, "index.ts")].find((candidate) => existsSync(candidate) && /\.(tsx?|css)$/.test(candidate));
      if (!target) throw new Error(`Unresolved import ${specifier} in ${absolute}`);
      visit(target);
    }
  }
  visit(resolve(process.cwd(), entry.source));
  visit(resolve(root, "LICENSE"));
  return {
    files,
    dependencies: [...dependencies].sort(),
    bundle: files.map(({ path, code }) => `// --- file: ${path} ---\n${code.trimEnd()}\n`).join("\n"),
  };
}
