import argparse
import json
import os
import random
import time
import urllib.error
import urllib.request
from pathlib import Path

try:
    from dotenv import load_dotenv
except ModuleNotFoundError:
    load_dotenv = None


def _load_env() -> None:
    base_dir = Path(__file__).resolve().parent
    for env_file in (base_dir / ".env", base_dir / ".env.example"):
        if env_file.exists():
            if load_dotenv is not None:
                load_dotenv(dotenv_path=env_file, override=False)
            else:
                for line in env_file.read_text(encoding="utf-8").splitlines():
                    stripped = line.strip()
                    if not stripped or stripped.startswith("#") or "=" not in stripped:
                        continue
                    key, value = stripped.split("=", 1)
                    os.environ.setdefault(key.strip(), value.strip().strip("\"'"))
            break


def _env_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


def _env_float(name: str, default: float) -> float:
    raw = os.getenv(name)
    if raw is None:
        return default
    try:
        return float(raw)
    except ValueError:
        return default


def _env_bool(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


class SimulatedMCP:
    def __init__(self, name: str):
        self.name = name
        self.failure_rate = _env_float("MCP_FAILURE_RATE", 0.08)
        self.latency_enabled = _env_bool("THCLAW_SIMULATED_LATENCY", False)

    def call_api(self, payload):
        print(f"[{self.name}] payload={payload}")
        if self.latency_enabled:
            time.sleep(random.uniform(0.05, 0.3))
        if random.random() < self.failure_rate:
            return {"status": "error", "message": f"{self.name} MCP failed"}
        return {
            "status": "success",
            "data": f"Processed by {self.name} for {payload.get('task_id')}",
        }


class UtilityToolMCP:
    EXTENSION_LANGUAGE = {
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
    }
    SKIP_DIRS = {".git", ".next", "node_modules", "dist", "build", "out", ".venv", "__pycache__"}

    def __init__(self, root: str | None = None):
        self.name = "utility_tool"
        self.root = Path(root or os.getenv("THCLAW_WORKSPACE_ROOT", Path.cwd())).resolve()
        self.max_files = _env_int("THCLAW_UTILITY_MAX_FILES", 1200)

    def call_api(self, payload):
        requested = payload.get("data", {}).get("utility", "summary")
        print(f"[{self.name}] utility={requested} root={self.root}")
        if requested == "manifest":
            return {"status": "success", "data": self.manifest()}
        if requested == "language_scan":
            return {"status": "success", "data": self.language_scan()}
        if requested == "check_plan":
            return {"status": "success", "data": self.check_plan()}
        if requested == "context_budget":
            text = json.dumps(payload.get("data", {}), ensure_ascii=False)
            return {"status": "success", "data": self.context_budget(text)}
        return {
            "status": "success",
            "data": {
                "manifest": self.manifest(),
                "language_scan": self.language_scan(),
                "check_plan": self.check_plan(),
            },
        }

    def manifest(self):
        return {
            "name": self.name,
            "purpose": "Shared Hermes/thCLAW utility layer for repo context, token budgeting, and multi-language coding support.",
            "supported_languages": sorted(set(self.EXTENSION_LANGUAGE.values())),
            "tools": ["manifest", "language_scan", "check_plan", "context_budget"],
        }

    def language_scan(self):
        languages: dict[str, int] = {}
        files_scanned = 0
        for path in self.root.rglob("*"):
            if files_scanned >= self.max_files:
                break
            if any(part in self.SKIP_DIRS for part in path.parts):
                continue
            if not path.is_file():
                continue
            language = self.EXTENSION_LANGUAGE.get(path.suffix.lower())
            if not language:
                continue
            files_scanned += 1
            languages[language] = languages.get(language, 0) + 1
        primary = [
            language
            for language, _ in sorted(languages.items(), key=lambda item: item[1], reverse=True)[:5]
        ]
        return {
            "root": str(self.root),
            "files_scanned": files_scanned,
            "languages": languages,
            "primary_languages": primary,
        }

    def check_plan(self):
        scan = self.language_scan()
        languages = set(scan["languages"].keys())
        commands = [{"language": "repo", "command": "git status --short", "reason": "Protect existing user work."}]
        if (self.root / "package.json").exists() or "typescript" in languages or "javascript" in languages:
            commands.append({"language": "typescript", "command": "pnpm -C <package> typecheck", "reason": "TypeScript/Next package verification."})
        if "python" in languages:
            commands.append({"language": "python", "command": "python -m py_compile <file-or-module>", "reason": "Python syntax verification without running app logic."})
        if "rust" in languages:
            commands.append({"language": "rust", "command": "cargo check", "reason": "Rust compile/type verification."})
        if "go" in languages:
            commands.append({"language": "go", "command": "go test ./...", "reason": "Go compile/test verification."})
        if "shell" in languages:
            commands.append({"language": "shell", "command": "bash -n <script.sh>", "reason": "Shell syntax verification."})
        return {"root": str(self.root), "commands": commands}

    def context_budget(self, text: str, max_tokens: int = 8000):
        estimated_tokens = (len(text) + 3) // 4
        return {
            "max_tokens": max_tokens,
            "estimated_tokens": estimated_tokens,
            "remaining_tokens": max(0, max_tokens - estimated_tokens),
            "strategy": "summarize-first-and-request-specific-files"
            if estimated_tokens > max_tokens else "direct-context-ok",
        }


class DeepSeekLocalMCP:
    def __init__(self):
        self.name = "deepseek_4_pro_local"
        self.endpoint = os.getenv(
            "DEEPSEEK_LOCAL_ENDPOINT",
            "http://127.0.0.1:11434/v1/chat/completions",
        )
        self.model = os.getenv("DEEPSEEK_MODEL", os.getenv("OLLAMA_FAST_MODEL", "llama3.2:3b"))
        self.api_key = os.getenv("DEEPSEEK_LOCAL_API_KEY", "")
        self.timeout_seconds = _env_int("DEEPSEEK_TIMEOUT_SECONDS", 3)

    def call_api(self, payload):
        body = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a local orchestration reasoning model.",
                },
                {
                    "role": "user",
                    "content": json.dumps(payload),
                },
            ],
            "temperature": 0.1,
        }
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        req = urllib.request.Request(
            self.endpoint,
            data=json.dumps(body).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout_seconds) as response:
                raw = response.read().decode("utf-8")
                parsed = json.loads(raw)
                content = (
                    parsed.get("choices", [{}])[0]
                    .get("message", {})
                    .get("content", "")
                )
                return {"status": "success", "data": content or "deepseek_response_ok"}
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as exc:
            return {
                "status": "error",
                "message": f"DeepSeek local endpoint failed: {exc}",
            }


class OpenClawWorker:
    def __init__(self, worker_id, mcp_clients):
        self.worker_id = worker_id
        self.mcp_clients = mcp_clients
        self.status = "idle"
        self.current_task = None
        self.error_count = 0
        self.last_error = None

    def assign_task(self, task):
        self.status = "working"
        self.current_task = task
        print(f"[Worker {self.worker_id}] Assigned task {task.get('id')}")
        return self._execute_task(task)

    def _execute_task(self, task):
        results = {}
        for mcp_name, mcp_client in self.mcp_clients.items():
            payload = {"task_id": task["id"], "data": task["payload"], "mcp_type": mcp_name}
            result = mcp_client.call_api(payload)
            results[mcp_name] = result
            if mcp_name == "utility_tool" and result.get("status") == "success":
                data = result.get("data")
                if isinstance(data, dict):
                    preview = {
                        "supported_languages": data.get("supported_languages"),
                        "primary_languages": data.get("primary_languages"),
                        "commands": data.get("commands"),
                    }
                    print(f"[Worker {self.worker_id}] utility_tool result: {json.dumps(preview, ensure_ascii=False)}")
            if result["status"] == "error":
                self.error_count += 1
                self.last_error = result.get("message", f"{mcp_name} failed")
                print(f"[Worker {self.worker_id}] error from {mcp_name}: {self.last_error}")
                self.status = "idle"
                self.current_task = None
                return {
                    "status": "error",
                    "worker_id": self.worker_id,
                    "task_id": task.get("id"),
                    "results": results,
                }

        if _env_bool("THCLAW_SIMULATED_LATENCY", False):
            time.sleep(random.uniform(0.2, 0.8))
        self.status = "idle"
        self.current_task = None
        return {
            "status": "success",
            "worker_id": self.worker_id,
            "task_id": task.get("id"),
            "results": results,
        }


class OpenClawOrchestrator:
    def __init__(self, initial_workers=2, max_workers=5, enable_local_llm=False):
        self.mcp_clients = {
            "utility_tool": UtilityToolMCP(),
            "skills": SimulatedMCP("skills"),
            "roles": SimulatedMCP("roles"),
            "plans": SimulatedMCP("plans"),
            "pipelines": SimulatedMCP("pipelines"),
            "n8n": SimulatedMCP("n8n"),
        }
        if enable_local_llm:
            self.mcp_clients["local_llm"] = DeepSeekLocalMCP()
        self.workers = {}
        self.task_queue = []
        self.next_worker_id = 1
        self.max_workers = max_workers
        for _ in range(initial_workers):
            self._add_worker()

    def _add_worker(self):
        if len(self.workers) < self.max_workers:
            worker_id = f"worker-{self.next_worker_id:03d}"
            self.workers[worker_id] = OpenClawWorker(worker_id, self.mcp_clients)
            self.next_worker_id += 1
            print(f"[Orchestrator] Added {worker_id}. workers={len(self.workers)}")
            return worker_id
        return None

    def _remove_worker(self, worker_id):
        if worker_id in self.workers and len(self.workers) > 1:
            del self.workers[worker_id]
            print(f"[Orchestrator] Removed {worker_id}. workers={len(self.workers)}")

    def scale_workers(self):
        idle_workers = [w for w in self.workers.values() if w.status == "idle"]
        if len(self.task_queue) > len(idle_workers) and len(self.workers) < self.max_workers:
            self._add_worker()
        elif len(idle_workers) > 1 and len(self.task_queue) == 0:
            self._remove_worker(idle_workers[0].worker_id)

    def add_task(self, task):
        self.task_queue.append(task)
        print(f"[Orchestrator] queued {task.get('id')} queue_size={len(self.task_queue)}")

    def distribute_tasks(self):
        while self.task_queue:
            idle_workers = [w for w in self.workers.values() if w.status == "idle"]
            if not idle_workers:
                self.scale_workers()
                if not [w for w in self.workers.values() if w.status == "idle"]:
                    time.sleep(1)
                    continue
            task = self.task_queue.pop(0)
            worker = idle_workers[0]
            worker.assign_task(task)
            self.scale_workers()

    def run_batch(self, num_tasks=5):
        print("\n--- thClaw Orchestrator batch mode ---")
        for i in range(num_tasks):
            task_id = f"task-{i + 1:03d}"
            task_description = f"run skill-role-plan-pipeline job #{i + 1}"
            task_payload = {
                "job": f"job-{i + 1}",
                "role": "manager",
                "plan": "execute_standard_pipeline",
                "pipeline": "n8n",
                "utility": random.choice(["manifest", "language_scan", "check_plan", "context_budget"]),
                "coding_languages": ["typescript", "javascript", "python", "rust", "go", "shell"],
                "priority": random.choice(["low", "medium", "high"]),
            }
            self.add_task({"id": task_id, "description": task_description, "payload": task_payload})
        while any(w.status != "idle" for w in self.workers.values()) or self.task_queue:
            self.distribute_tasks()
            self.scale_workers()
            time.sleep(0.2)
        print("--- batch complete ---")

    def run_daemon(self, interval_seconds=30):
        print("\n--- thClaw Orchestrator daemon mode ---")
        sequence = 1
        while True:
            task_id = f"daemon-task-{sequence:06d}"
            payload = {
                "job": f"continuous-job-{sequence}",
                "role": "orchestrator",
                "plan": "continuous_execution",
                "pipeline": "n8n",
                "utility": "check_plan",
                "coding_languages": ["typescript", "javascript", "python", "rust", "go", "shell"],
            }
            self.add_task({"id": task_id, "description": "daemon orchestration cycle", "payload": payload})
            self.distribute_tasks()
            self.scale_workers()
            sequence += 1
            time.sleep(interval_seconds)


def parse_args():
    parser = argparse.ArgumentParser(description="thClaw Orchestrator manager runtime")
    parser.add_argument("--mode", choices=["batch", "daemon"], default=os.getenv("THCLUDE_MODE", "batch"))
    parser.add_argument("--tasks", type=int, default=_env_int("THCLUDE_TASKS", 5))
    parser.add_argument("--interval", type=int, default=_env_int("THCLUDE_DAEMON_INTERVAL_SECONDS", 30))
    parser.add_argument("--initial-workers", type=int, default=_env_int("THCLUDE_INITIAL_WORKERS", 1))
    parser.add_argument("--max-workers", type=int, default=_env_int("THCLUDE_MAX_WORKERS", 3))
    parser.add_argument("--local-llm", action="store_true", default=_env_bool("THCLAW_ENABLE_LOCAL_LLM", False))
    parser.add_argument("--utility", choices=["manifest", "language_scan", "check_plan", "context_budget"], default=None)
    return parser.parse_args()


if __name__ == "__main__":
    _load_env()
    args = parse_args()
    if args.utility:
        tool = UtilityToolMCP()
        result = tool.call_api({"task_id": "cli", "data": {"utility": args.utility}})
        print(json.dumps(result, ensure_ascii=False, indent=2))
        raise SystemExit(0)

    orchestrator = OpenClawOrchestrator(
        initial_workers=args.initial_workers,
        max_workers=args.max_workers,
        enable_local_llm=args.local_llm,
    )
    if args.mode == "daemon":
        orchestrator.run_daemon(interval_seconds=args.interval)
    else:
        orchestrator.run_batch(num_tasks=args.tasks)
