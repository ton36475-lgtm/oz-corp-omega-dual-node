import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";

const execFileAsync = promisify(execFile);

export class WranglerSkill {
  async configureEnvironment(envName: string, kvNamespaceId: string): Promise<string> {
    const tomlContent = `
name = "oz-corp-edge-agent"
main = "src/index.ts"
compatibility_date = "2024-05-01"

[env.${envName}]
name = "oz-corp-${envName}"
route = { pattern = "${envName}.sirinx.com", custom_domain = true }

[[kv_namespaces]]
binding = "AGENT_MEMORY"
id = "${kvNamespaceId}"
    `;
    await fs.writeFile('./wrangler.toml', tomlContent);
    return `[SUCCESS] Configured wrangler.toml for environment: ${envName} with KV bindings.`;
  }

  async dryRunTest(): Promise<string> {
    try {
      await execFileAsync("npx", ["wrangler", "types"]);
      const { stdout } = await execFileAsync("npx", ["wrangler", "deploy", "--dry-run"]);
      return `[SUCCESS] Dry run passed. Ready to deploy.\n${stdout}`;
    } catch (error: any) {
      return `[ERROR] Dry run FAILED. Fix the code:\n${error.stderr}`;
    }
  }

  async deployToEdge(envName: string): Promise<string> {
    try {
      const { stdout } = await execFileAsync("npx", ["wrangler", "deploy", "--env", envName]);
      return `[SUCCESS] DEPLOYMENT COMPLETE to Edge:\n${stdout}`;
    } catch (error: any) {
      return `[ERROR] DEPLOYMENT FAILED:\n${error.stderr}`;
    }
  }
}
