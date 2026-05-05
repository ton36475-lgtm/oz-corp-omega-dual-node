import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type SafeCommandName =
  | "git_status"
  | "ozwarp_audit"
  | "ollama_list"
  | "repo_tree";

export class SafeCommandTool {
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

      default:
        return "Command not allowed";
    }
  }

  private async exec(cmd: string, args: string[]): Promise<string> {
    const result = await execFileAsync(cmd, args, {
      cwd: process.cwd(),
      timeout: 15000
    });

    return `${result.stdout}${result.stderr}`;
  }
}
