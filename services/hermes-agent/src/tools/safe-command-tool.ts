import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { WranglerSkill } from "./wrangler-tool.js";
import { UtilityTool } from "./utility-tool.js";

const execFileAsync = promisify(execFile);

export type SafeCommandName =
  | "git_status"
  | "ozwarp_audit"
  | "ollama_list"
  | "repo_tree"
  | "utility_manifest"
  | "language_scan"
  | "check_plan"
  | "wrangler_dry_run"; // เพิ่มคำสั่งใหม่

export class SafeCommandTool {
  private wrangler = new WranglerSkill();
  private utility = new UtilityTool();

  async run(command: SafeCommandName): Promise<string> {
    switch (command) {
      case "git_status":
        return this.exec("git", ["status", "--short"]);
      case "ozwarp_audit":
        return this.exec("ozwarp", ["audit", "status"]);
      case "ollama_list":
        return this.exec("ollama", ["list"]);
      case "repo_tree":
        return this.exec("find", [".", "-maxdepth", "2", "-type", "d"]);
      case "utility_manifest":
        return JSON.stringify(this.utility.manifest(), null, 2);
      case "language_scan":
        return JSON.stringify(await this.utility.languageScan(process.cwd()), null, 2);
      case "check_plan":
        return JSON.stringify(await this.utility.checkPlan(process.cwd()), null, 2);
      case "wrangler_dry_run":
        return this.wrangler.dryRunTest(); // เรียกใช้สกิลใหม่
      default:
        return "Command not allowed";
    }
  }

  private async exec(cmd: string, args: string[]): Promise<string> {
    try {
      const result = await execFileAsync(cmd, args, { cwd: process.cwd(), timeout: 15000 });
      return `${result.stdout}${result.stderr}`;
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }
}
