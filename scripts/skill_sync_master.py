import os
import shutil
import json

# Configuration
SKILLS_SOURCE_DIR = "/home/ubuntu/skills"
AGENTS_BASE_DIR = "/home/ubuntu/sirinx-solar-energy/sirinx-app/src/agents"
AGENT_DEFINITIONS_PATH = os.path.join(AGENTS_BASE_DIR, "agent-definitions.ts")

def get_agent_ids():
    """Extract agent IDs from the agent-definitions.ts file (simplified extraction)."""
    agent_ids = []
    if not os.path.exists(AGENT_DEFINITIONS_PATH):
        print(f"Error: {AGENT_DEFINITIONS_PATH} not found.")
        return []
    
    with open(AGENT_DEFINITIONS_PATH, 'r') as f:
        lines = f.readlines()
        for line in lines:
            if "id: '" in line:
                agent_id = line.split("id: '")[1].split("'")[0]
                agent_ids.append(agent_id)
    return agent_ids

def sync_skills_to_agents():
    """Sync all skills from the source directory to each agent's local directory."""
    agent_ids = get_agent_ids()
    if not agent_ids:
        print("No agent IDs found to sync.")
        return

    print(f"Found {len(agent_ids)} agents. Starting skill synchronization...")

    # Ensure each agent has a directory and a skills subdirectory
    for agent_id in agent_ids:
        agent_dir = os.path.join(AGENTS_BASE_DIR, agent_id)
        skills_dest_dir = os.path.join(agent_dir, "skills")
        
        if not os.path.exists(agent_dir):
            os.makedirs(agent_dir)
            print(f"Created directory for agent: {agent_id}")
        
        if os.path.exists(skills_dest_dir):
            shutil.rmtree(skills_dest_dir)
        
        # Copy all skills to the agent's skills directory
        shutil.copytree(SKILLS_SOURCE_DIR, skills_dest_dir)
        # print(f"Synced {len(os.listdir(SKILLS_SOURCE_DIR))} skills to {agent_id}")

    print("\n--- Skill Synchronization Complete ---")
    print(f"Total Agents Synced: {len(agent_ids)}")
    print(f"Skills per Agent: {len(os.listdir(SKILLS_SOURCE_DIR))}")

if __name__ == "__main__":
    sync_skills_to_agents()
