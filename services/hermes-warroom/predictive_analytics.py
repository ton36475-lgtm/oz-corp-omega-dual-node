import random
import time
from datetime import datetime, timedelta

class KanbanSimulator:
    def __init__(self):
        self.tasks = {
            "TASK-001": {"status": "Backlog", "priority": "High", "assigned_to": "Agent-Alpha", "due_date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")},
            "TASK-002": {"status": "In Progress", "priority": "Medium", "assigned_to": "Agent-Beta", "due_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")},
            "TASK-003": {"status": "Done", "priority": "Low", "assigned_to": "Agent-Gamma", "due_date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")},
            "TASK-004": {"status": "Backlog", "priority": "High", "assigned_to": "Agent-Alpha", "due_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")},
            "TASK-005": {"status": "In Progress", "priority": "High", "assigned_to": "Agent-Delta", "due_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")},
        }
        self.status_flow = ["Backlog", "In Progress", "Review", "Done"]

    def get_task_status(self, task_id):
        return self.tasks.get(task_id, {}).get("status", "Not Found")

    def update_task_status(self, task_id, new_status):
        if task_id in self.tasks and new_status in self.status_flow:
            self.tasks[task_id]["status"] = new_status
            print(f"[Kanban] Task {task_id} status updated to {new_status}")
            return True
        return False

    def get_all_tasks(self):
        return self.tasks

class PredictiveAnalytics:
    def __init__(self, kanban_simulator):
        self.kanban = kanban_simulator

    def predict_completion_time(self, task_id):
        task = self.kanban.get_all_tasks().get(task_id)
        if not task:
            return "Task not found"

        status = task["status"]
        priority = task["priority"]
        due_date_str = task["due_date"]
        due_date = datetime.strptime(due_date_str, "%Y-%m-%d")

        # Simple predictive model based on status and priority
        if status == "Done":
            return "Already completed"
        elif status == "In Progress":
            if priority == "High":
                prediction_days = random.randint(1, 2)
            elif priority == "Medium":
                prediction_days = random.randint(2, 4)
            else:
                prediction_days = random.randint(3, 6)
        elif status == "Review":
            prediction_days = random.randint(1, 2)
        else: # Backlog
            if priority == "High":
                prediction_days = random.randint(3, 7)
            elif priority == "Medium":
                prediction_days = random.randint(5, 10)
            else:
                prediction_days = random.randint(7, 14)

        predicted_completion = datetime.now() + timedelta(days=prediction_days)
        return predicted_completion.strftime("%Y-%m-%d")

    def identify_bottlenecks(self):
        status_counts = {}
        for task_id, task in self.kanban.get_all_tasks().items():
            status = task["status"]
            status_counts[status] = status_counts.get(status, 0) + 1
        
        bottlenecks = []
        # Simple heuristic: if 'In Progress' or 'Review' has significantly more tasks than 'Done' or 'Backlog'
        if status_counts.get("In Progress", 0) > status_counts.get("Done", 0) * 1.5:
            bottlenecks.append("High number of tasks 'In Progress' - potential resource bottleneck.")
        if status_counts.get("Review", 0) > status_counts.get("In Progress", 0) * 0.8:
            bottlenecks.append("High number of tasks in 'Review' - potential review process bottleneck.")
        
        if not bottlenecks:
            bottlenecks.append("No obvious bottlenecks identified based on current heuristics.")
        
        return bottlenecks

if __name__ == "__main__":
    print("--- Hermes Warroom Command: AI-Powered Kanban & Predictive Analytics --- ")
    kanban = KanbanSimulator()
    analytics = PredictiveAnalytics(kanban)

    print("\nInitial Kanban Board:")
    for task_id, task_data in kanban.get_all_tasks().items():
        print(f"  {task_id}: Status={task_data['status']}, Priority={task_data['priority']}, Due={task_data['due_date']}")

    print("\nPredictive Analytics:")
    for task_id in kanban.get_all_tasks().keys():
        prediction = analytics.predict_completion_time(task_id)
        print(f"  {task_id} Predicted Completion: {prediction}")

    print("\nIdentifying Bottlenecks:")
    bottlenecks = analytics.identify_bottlenecks()
    for bottleneck in bottlenecks:
        print(f"  - {bottleneck}")

    print("\nSimulating Task Progress:")
    kanban.update_task_status("TASK-001", "In Progress")
    kanban.update_task_status("TASK-002", "Review")
    kanban.update_task_status("TASK-005", "Review")
    time.sleep(1)

    print("\nUpdated Kanban Board:")
    for task_id, task_data in kanban.get_all_tasks().items():
        print(f"  {task_id}: Status={task_data['status']}, Priority={task_data['priority']}, Due={task_data['due_date']}")

    print("\nPredictive Analytics (After Update):")
    for task_id in kanban.get_all_tasks().keys():
        prediction = analytics.predict_completion_time(task_id)
        print(f"  {task_id} Predicted Completion: {prediction}")

    print("\nIdentifying Bottlenecks (After Update):")
    bottlenecks = analytics.identify_bottlenecks()
    for bottleneck in bottlenecks:
        print(f"  - {bottleneck}")

    print("\n--- Simulation Complete ---")
