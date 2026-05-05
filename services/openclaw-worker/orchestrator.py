import os
import time
import random
from dotenv import load_dotenv

# Load environment variables from .env.example (for demonstration purposes)
# In a real scenario, these would be loaded from a secure .env file
load_dotenv(dotenv_path=".env.example")

class MCPSimulator:
    def __init__(self, name):
        self.name = name
        env_var_name = name.upper().replace(" ", "_") + "_API_KEY"
        self.api_key = os.getenv(env_var_name, "DUMMY_KEY")

    def call_api(self, payload):
        print(f"[{self.name} MCP] Calling API with payload: {payload} using key: {self.api_key[:5]}...")
        time.sleep(random.uniform(0.1, 0.5)) # Simulate API latency
        if random.random() < 0.1: # 10% chance of failure
            return {"status": "error", "message": f"{self.name} API failed"}
        return {"status": "success", "data": "Processed by {} for {}".format(self.name, payload.get("task_id"))}

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
        print("[Worker {}] Assigned task: {}".format(self.worker_id, task.get("id")))
        return self._execute_task(task)

    def _execute_task(self, task):
        print("[Worker {}] Executing task {}: {}".format(self.worker_id, task.get("id"), task.get("description")))
        results = {}
        for mcp_name, mcp_client in self.mcp_clients.items():
            print("[Worker {}] Delegating to {} for task {}".format(self.worker_id, mcp_name, task.get("id")))
            mcp_payload = {"task_id": task["id"], "data": task["payload"], "mcp_type": mcp_name}
            result = mcp_client.call_api(mcp_payload)
            results[mcp_name] = result
            if result["status"] == "error":
                print("[Worker {}] {} failed for task {}".format(self.worker_id, mcp_name, task.get("id")))
                self.error_count += 1
                self.last_error = result.get("message", f"{mcp_name} failed")
                self.status = "idle"
                self.current_task = None
                print("[Worker {}] Recovered to idle after error: {}".format(self.worker_id, self.last_error))
                return {"status": "error", "worker_id": self.worker_id, "task_id": task.get("id"), "results": results}
        
        time.sleep(random.uniform(0.5, 2.0)) # Simulate task processing time
        self.status = "idle"
        self.current_task = None
        print("[Worker {}] Task {} completed. Results: {}".format(self.worker_id, task.get("id"), results))
        return {"status": "success", "worker_id": self.worker_id, "task_id": task.get("id"), "results": results}

class OpenClawOrchestrator:
    def __init__(self, initial_workers=2, max_workers=5):
        self.mcp_clients = {
            "meta_ads": MCPSimulator("Meta Ads"),
            "context7": MCPSimulator("Context7"),
            "deepseek_v4": MCPSimulator("DeepSeek V4"),
            "supabase": MCPSimulator("Supabase"),
        }
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
            print(f"[Orchestrator] Added new worker: {worker_id}. Total workers: {len(self.workers)}")
            return worker_id
        return None

    def _remove_worker(self, worker_id):
        if worker_id in self.workers and len(self.workers) > 1: # Always keep at least one worker
            del self.workers[worker_id]
            print(f"[Orchestrator] Removed worker: {worker_id}. Total workers: {len(self.workers)}")

    def scale_workers(self):
        active_workers = [w for w in self.workers.values() if w.status == "working"]
        idle_workers = [w for w in self.workers.values() if w.status == "idle"]
        
        if len(self.task_queue) > len(idle_workers) and len(self.workers) < self.max_workers:
            self._add_worker()
        elif len(idle_workers) > 1 and len(self.task_queue) == 0:
            # Remove an idle worker if there are too many and no tasks
            worker_to_remove = idle_workers[0].worker_id
            self._remove_worker(worker_to_remove)

    def add_task(self, task):
        self.task_queue.append(task)
        print("[Orchestrator] Task {} added to queue. Queue size: {}".format(task.get("id"), len(self.task_queue)))

    def distribute_tasks(self):
        while self.task_queue:
            idle_workers = [w for w in self.workers.values() if w.status == "idle"]
            if not idle_workers:
                print("[Orchestrator] No idle workers. Scaling up or waiting...")
                self.scale_workers()
                if not [w for w in self.workers.values() if w.status == "idle"]:
                    time.sleep(1) # Wait if no workers are available after scaling attempt
                    continue
            
            task = self.task_queue.pop(0)
            worker = idle_workers[0]
            worker.assign_task(task)
            self.scale_workers() # Re-evaluate scaling after task assignment

    def run(self, num_tasks=10):
        print("\n--- OpenClaw Orchestrator Started ---")
        for i in range(num_tasks):
            task_id = f"task-{i+1:03d}"
            task_description = f"Process data for campaign {i+1}"
            task_payload = {"campaign_id": f"camp-{i+1}", "data_volume": random.randint(100, 1000)}
            self.add_task({"id": task_id, "description": task_description, "payload": task_payload})
            time.sleep(random.uniform(0.1, 0.3)) # Simulate task arrival
        
        while any(w.status != "idle" for w in self.workers.values()) or self.task_queue:
            self.distribute_tasks()
            self.scale_workers()
            time.sleep(0.5) # Orchestrator loop interval

        print("\n--- All tasks processed. OpenClaw Orchestrator Shutting Down ---")
        print(f"Final worker count: {len(self.workers)}")

if __name__ == "__main__":
    orchestrator = OpenClawOrchestrator(initial_workers=1, max_workers=3)
    orchestrator.run(num_tasks=7)
