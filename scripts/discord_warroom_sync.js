const fs = require("fs");
const axios = require("axios");

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; // Set this in your environment variables
const KANBAN_DB_PATH = "/home/ubuntu/.hermes/kanban.db";

async function sendDiscordMessage(message) {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn("DISCORD_WEBHOOK_URL is not set. Skipping Discord notification.");
    return;
  }
  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: message,
    });
    console.log("Discord message sent successfully.");
  } catch (error) {
    console.error("Failed to send Discord message:", error.message);
  }
}

function readKanbanDb() {
  if (!fs.existsSync(KANBAN_DB_PATH)) {
    console.log("Kanban DB not found. Creating an empty one.");
    fs.writeFileSync(KANBAN_DB_PATH, JSON.stringify({ tasks: [] }, null, 2));
    return { tasks: [] };
  }
  const data = fs.readFileSync(KANBAN_DB_PATH, "utf8");
  return JSON.parse(data);
}

function monitorKanbanDb() {
  let lastKnownState = readKanbanDb();
  console.log("Monitoring Kanban DB for changes...");

  fs.watchFile(KANBAN_DB_PATH, async (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      console.log("Kanban DB changed. Processing updates...");
      const currentState = readKanbanDb();

      // Simple diffing for demonstration. In a real app, you'd have more robust change tracking.
      const newTasks = currentState.tasks.filter(
        (task) => !lastKnownState.tasks.some((oldTask) => oldTask.id === task.id)
      );
      newTasks.forEach((task) => {
        sendDiscordMessage(`[Task Started] New task added: **${task.name}** (ID: ${task.id})`);
      });

      const updatedTasks = currentState.tasks.filter((task) =>
        lastKnownState.tasks.some(
          (oldTask) => oldTask.id === task.id && oldTask.status !== task.status
        )
      );
      updatedTasks.forEach((task) => {
        sendDiscordMessage(`[Task Update] Task **${task.name}** (ID: ${task.id}) status changed to: **${task.status}**`);
      });

      lastKnownState = currentState;
    }
  });
}

// For testing purposes, create a dummy kanban.db if it doesn't exist
if (!fs.existsSync(KANBAN_DB_PATH)) {
  fs.writeFileSync(KANBAN_DB_PATH, JSON.stringify({
    tasks: [
      { id: "task-001", name: "Initial Setup", status: "Completed" },
      { id: "task-002", name: "Develop API", status: "Pending" }
    ]
  }, null, 2));
}

monitorKanbanDb();
console.log("Discord Warroom Sync script started. Monitoring ", KANBAN_DB_PATH);
