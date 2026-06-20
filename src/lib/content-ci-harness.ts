import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  cpSync,
  rmSync,
  readFileSync,
} from "fs"
import { join } from "path"
import { tmpdir } from "os"
import { spawnSync } from "child_process"

const REPO_ROOT = process.cwd()

export const VALID_MDX_FRONTMATTER = `---
title: Valid Framework
subtitle: test
difficulty: low
domain_layer: Purpose
---
`

export const DEFAULT_SYMPTOMS_JSON = JSON.stringify(
  {
    categories: [{ id: "undrsys", title: "Test", color: "#000" }],
    symptoms: [
      {
        id: "test-001",
        category: "undrsys",
        title: "Test symptom",
        goal: "goal",
        outcome: "outcome",
        frameworks: ["valid-fw"],
      },
    ],
  },
  null,
  2,
)

export type ScriptResult = {
  exitCode: number
  stdout: string
  stderr: string
}

export function createContentCiFixture(setup?: (root: string) => void): string {
  const root = mkdtempSync(join(tmpdir(), "askserega-content-ci-"))
  mkdirSync(join(root, "content", "frameworks"), { recursive: true })
  mkdirSync(join(root, "src", "lib"), { recursive: true })
  cpSync(join(REPO_ROOT, "src/lib/taxonomy.json"), join(root, "src/lib/taxonomy.json"))
  writeFileSync(join(root, "content", "symptoms.json"), DEFAULT_SYMPTOMS_JSON)
  writeFileSync(join(root, "content", "frameworks", "valid-fw.mdx"), VALID_MDX_FRONTMATTER)
  setup?.(root)
  return root
}

export function writeFramework(root: string, filename: string, content: string) {
  writeFileSync(join(root, "content", "frameworks", filename), content)
}

export function writeSymptoms(root: string, data: unknown) {
  writeFileSync(join(root, "content", "symptoms.json"), JSON.stringify(data, null, 2))
}

export function runValidateFrontmatter(root: string): ScriptResult {
  return runScript("validate-frontmatter.mjs", root)
}

export function runCheckSymptomsSync(root: string): ScriptResult {
  return runScript("check-symptoms-sync.mjs", root)
}

function runScript(script: string, contentCiRoot: string): ScriptResult {
  const result = spawnSync("node", [`scripts/${script}`], {
    cwd: REPO_ROOT,
    env: { ...process.env, CONTENT_CI_ROOT: contentCiRoot },
    encoding: "utf-8",
  })
  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  }
}

export function cleanupFixture(root: string) {
  rmSync(root, { recursive: true, force: true })
}

export function readRepoFile(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), "utf-8")
}

export function readFixtureFile(root: string, relativePath: string): string {
  return readFileSync(join(root, relativePath), "utf-8")
}
