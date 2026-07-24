const fs = require('fs');
const path = require('path');
const os = require('os');
const { createClient } = require('redis');

async function run() {
    const taskDesc = process.argv[2];
    if (!taskDesc) {
        console.error("[ERROR] Missing Task Description.");
        process.exit(1);
    }

    // 1. จัดการความจำ (Kanban Vault)
    const hermesDir = path.join(os.homedir(), '.hermes');
    const kanbanPath = path.join(hermesDir, 'kanban.jsonl');
    if (!fs.existsSync(hermesDir)) fs.mkdirSync(hermesDir, { recursive: true });

    const taskRecord = {
        id: `TASK-${Date.now()}`,
        task: taskDesc,
        status: "QUEUED",
        assigned: "PC-Worker (Ghostclaw)",
        timestamp: new Date().toISOString()
    };

    fs.appendFileSync(kanbanPath, JSON.stringify(taskRecord) + '\n');

    // 2. แสดงผล UI บน Terminal
    console.log(`\n=================================================`);
    console.log(`[HERMES PRIME] A2A WARROOM ORCHESTRATOR V2.0`);
    console.log(`=================================================`);
    console.log(`📌 RECEIVED TASK : ${taskDesc}`);
    console.log(`🗂️  KANBAN PATH   : ${kanbanPath}`);

    // 3. ยิงคำสั่งเข้า Redis Queue (ของจริง)
    try {
        const client = createClient({ url: 'redis://localhost:6379' });
        client.on('error', (err) => console.log('Redis Client Error', err));
        
        await client.connect();
        await client.publish('ozcorp-tasks', JSON.stringify(taskRecord));
        
        console.log(`🌉 REDIS BRIDGE  : [SUCCESS] Task published to 'ozcorp-tasks' channel!`);
        await client.disconnect();
    } catch (error) {
        console.log(`🌉 REDIS BRIDGE  : [FAILED] Is Redis running via Docker? Error: ${error.message}`);
    }

    console.log(`-------------------------------------------------`);
    console.log(`✅ ROUTING COMPLETE. Mac Node is awaiting PC Worker execution.\n`);
}

run();
