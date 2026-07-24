import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

export type CodingLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "rust"
  | "go"
  | "shell"
  | "json"
  | "markdown"
  | "yaml";

export type UtilityToolName =
  | "language_scan"
  | "check_plan"
  | "context_budget";

export type LanguageScanResult = {
  root: string;
  filesScanned: number;
  languages: Partial<Record<CodingLanguage, number>>;
  primaryLanguages: CodingLanguage[];
};

export type CheckPlan = {
  root: string;
  commands: Array<{
    language: CodingLanguage | "repo";
    command: string;
    reason: string;
  }>;
};

const EXTENSION_LANGUAGE: Record<string, CodingLanguage> = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".py": "python",
  ".rs": "rust",
  ".go": "go",
  ".sh": "shell",
  ".bash": "shell",
  ".zsh": "shell",
  ".json": "json",
  ".md": "markdown",
  ".mdx": "markdown",
  ".yml": "yaml",
  ".yaml": "yaml",
};

const SKIP_DIRS = new Set([
  ".git",
  ".next",
  "node_modules",
  "dist",
  "build",
  "out",
  ".venv",
  "__pycache__",
]);

export class UtilityTool {
  manifest() {
    return {
      name: "utility-tool",
      purpose: "Shared Hermes/thCLAW utility layer for repo context, token budgeting, and multi-language coding support.",
      tools: [
        {
          name: "language_scan",
          description: "Scan accessible repo files and count coding languages without reading full file contents.",
        },
        {
          name: "check_plan",
          description: "Return safe verification commands for detected languages.",
        },
        {
          name: "context_budget",
          description: "Estimate a context budget from input text and file count.",
        },
      ],
      supportedLanguages: Object.values(EXTENSION_LANGUAGE).filter((v, i, a) => a.indexOf(v) === i),
    };
  }

  async languageScan(root = process.cwd(), maxFiles = 1200): Promise<LanguageScanResult> {
    const languages: Partial<Record<CodingLanguage, number>> = {};
    let filesScanned = 0;

    const walk = async (dir: string): Promise<void> => {
      if (filesScanned >= maxFiles) return;
      let entries;
      try {
        entries = await readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        if (filesScanned >= maxFiles) break;
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!SKIP_DIRS.has(entry.name)) await walk(path);
          continue;
        }
        if (!entry.isFile()) continue;
        const lang = EXTENSION_LANGUAGE[extname(entry.name).toLowerCase()];
        if (!lang) continue;
        filesScanned += 1;
        languages[lang] = (languages[lang] || 0) + 1;
      }
    };

    await walk(root);
    const primaryLanguages = Object.entries(languages)
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .slice(0, 5)
      .map(([language]) => language as CodingLanguage);

    return {
      root,
      filesScanned,
      languages,
      primaryLanguages,
    };
  }

  async checkPlan(root = process.cwd()): Promise<CheckPlan> {
    const scan = await this.languageScan(root);
    const commands: CheckPlan["commands"] = [];
    const has = (language: CodingLanguage) => scan.primaryLanguages.includes(language) || Boolean(scan.languages[language]);

    if (await exists(join(root, "package.json"))) {
      commands.push({
        language: "typescript",
        command: "pnpm -C <package> typecheck",
        reason: "TypeScript/Next packages should be checked with their package script.",
      });
    }
    if (has("python")) {
      commands.push({
        language: "python",
        command: "python -m py_compile <file-or-module>",
        reason: "Python syntax check without executing application logic.",
      });
    }
    if (has("rust")) {
      commands.push({
        language: "rust",
        command: "cargo check",
        reason: "Rust compile/type check.",
      });
    }
    if (has("go")) {
      commands.push({
        language: "go",
        command: "go test ./...",
        reason: "Go package compile and test check.",
      });
    }
    if (has("shell")) {
      commands.push({
        language: "shell",
        command: "bash -n <script.sh>",
        reason: "Shell syntax check without running the script.",
      });
    }
    commands.push({
      language: "repo",
      command: "git status --short",
      reason: "Confirm changed files and avoid overwriting user work.",
    });

    return { root, commands };
  }

  contextBudget(input: { text?: string; files?: number; maxTokens?: number }) {
    const maxTokens = input.maxTokens || 8000;
    const textChars = input.text?.length || 0;
    const estimatedTokens = Math.ceil(textChars / 4) + (input.files || 0) * 120;
    return {
      maxTokens,
      estimatedTokens,
      remainingTokens: Math.max(0, maxTokens - estimatedTokens),
      strategy: estimatedTokens > maxTokens
        ? "summarize-first-and-request-specific-files"
        : "direct-context-ok",
    };
  }

  async repoSummary(root = process.cwd()) {
    const scan = await this.languageScan(root);
    const packageJsonPath = join(root, "package.json");
    let packageName = "";
    try {
      const pkg = JSON.parse(await readFile(packageJsonPath, "utf8")) as { name?: string };
      packageName = pkg.name || "";
    } catch {
      packageName = "";
    }
    return {
      packageName,
      ...scan,
    };
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}
