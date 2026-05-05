import os
import json
import time

# --- Simulated Manus API Client (simplified for demonstration) ---
class ManusAPIClient:
    def __init__(self, api_key="dummy_key"):
        self.api_key = api_key
        self.tasks = {}
        self.projects = {}
        self.next_task_id = 1
        self.next_project_id = 1

    def create_project(self, name, instruction):
        project_id = f"project-{self.next_project_id:05d}"
        self.next_project_id += 1
        self.projects[project_id] = {"name": name, "instruction": instruction}
        print(f"[ManusAPI] Project created: {name} (ID: {project_id})")
        return {"id": project_id, "name": name, "instruction": instruction}

    def create_task(self, message_content, project_id=None, title="New Task"):
        task_id = f"task-{self.next_task_id:05d}"
        self.next_task_id += 1
        self.tasks[task_id] = {
            "id": task_id,
            "title": title,
            "project_id": project_id,
            "messages": [{
                "type": "user_message",
                "content": message_content,
                "timestamp": time.time()
            }],
            "status": "waiting_for_agent"
        }
        print(f"[ManusAPI] Task created: {title} (ID: {task_id})")
        return {"task_id": task_id, "task_url": f"https://manus.im/tasks/{task_id}"}

    def send_message(self, task_id, message_content, sender="user"):
        if task_id not in self.tasks:
            raise ValueError(f"Task {task_id} not found.")
        self.tasks[task_id]["messages"].append({
            "type": f"{sender}_message",
            "content": message_content,
            "timestamp": time.time()
        })
        print(f"[ManusAPI] Message sent to task {task_id} by {sender}.")
        return True

    def list_messages(self, task_id):
        if task_id not in self.tasks:
            raise ValueError(f"Task {task_id} not found.")
        return self.tasks[task_id]["messages"]

    def update_task_status(self, task_id, status):
        if task_id not in self.tasks:
            raise ValueError(f"Task {task_id} not found.")
        self.tasks[task_id]["status"] = status
        print(f"[ManusAPI] Task {task_id} status updated to: {status}")
        return True

# --- Simulated Codex API (for generating code snippets) ---
class CodexAPI:
    def generate_code(self, prompt, language="python", complexity="medium"):
        print(f"[CodexAPI] Generating {language} code for: ", prompt)
        time.sleep(1) # Simulate API call delay
        if "factorial" in prompt.lower():
            return {
                "status": "success",
                "code": """def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)
""",
                "language": language,
                "complexity": complexity
            }
        elif "fibonacci" in prompt.lower():
            return {
                "status": "success",
                "code": """def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
""",
                "language": language,
                "complexity": complexity
            }
        else:
            return {
                "status": "success",
                "code": f"# Placeholder {language} code for: {prompt}\npass",
                "language": language,
                "complexity": complexity
            }

# --- Claude (Manus Agent) Workflow Orchestration ---
class ClaudeAgent:
    def __init__(self, manus_client, codex_client):
        self.manus = manus_client
        self.codex = codex_client
        self.project_id = None

    def initialize_project(self):
        print("\n--- Claude: Initializing Project ---")
        project = self.manus.create_project(
            name="OZ-CORP OMEGA Code Generation",
            instruction="You are the lead architect for OZ-CORP OMEGA. Orchestrate code generation tasks, leveraging Codex for implementation details. Ensure all generated code aligns with project standards."
        )
        self.project_id = project["id"]
        print(f"Project {self.project_id} initialized with persona.")

    def orchestrate_code_task(self, task_description, language="python"):
        print(f"\n--- Claude: Orchestrating Code Task: {task_description} ---")
        # Claude creates a task for itself, potentially involving Codex
        task_message = f"Commander requests: {task_description}. I will delegate the code generation to Codex."
        task_info = self.manus.create_task(
            message_content=task_message,
            project_id=self.project_id,
            title=f"Generate {language} code for {task_description}"
        )
        task_id = task_info["task_id"]

        # Claude (Manus) calls Codex API to get the code
        print(f"[Claude] Delegating code generation to Codex for task {task_id}...")
        codex_response = self.codex.generate_code(task_description, language=language)

        if codex_response["status"] == "success":
            generated_code = codex_response["code"]
            print(f"[Claude] Codex successfully generated {language} code.\n")
            print("--- Generated Code by Codex ---")
            print(generated_code)
            print("-------------------------------")

            # Claude sends the generated code back to the Manus task as an assistant message
            self.manus.send_message(
                task_id,
                f"Codex has generated the requested {language} code:\n```" + language + "\n" + generated_code + "\n```",
                sender="assistant"
            )
            self.manus.update_task_status(task_id, "completed")
            print(f"[Claude] Task {task_id} completed with generated code.")
            return generated_code
        else:
            error_message = f"Codex failed to generate code: {codex_response.get('error', 'Unknown error')}"
            print(f"[Claude] {error_message}")
            self.manus.send_message(task_id, error_message, sender="assistant")
            self.manus.update_task_status(task_id, "failed")
            return None

# --- Main Execution --- 
if __name__ == "__main__":
    manus_api = ManusAPIClient()
    codex_api = CodexAPI()
    claude_agent = ClaudeAgent(manus_api, codex_api)

    claude_agent.initialize_project()

    # Example 1: Claude orchestrates generating a factorial function
    claude_agent.orchestrate_code_task("a Python function to calculate factorial", "python")

    # Example 2: Claude orchestrates generating a fibonacci sequence generator
    claude_agent.orchestrate_code_task("a Python generator for fibonacci sequence", "python")

    # Example 3: Claude orchestrates generating a placeholder for a JavaScript utility
    claude_agent.orchestrate_code_task("a JavaScript utility for date formatting", "javascript")

    print("\n--- All orchestrated tasks completed. ---")
    print("\n--- Final state of Manus tasks (simplified): ---")
    for task_id, task_data in manus_api.tasks.items():
        print(f"Task ID: {task_id}, Title: {task_data['title']}, Status: {task_data['status']}")
        # for msg in task_data["messages"]:
        #     print(f"  [{msg["sender"].upper()}] {msg["content"][:50]}...")

