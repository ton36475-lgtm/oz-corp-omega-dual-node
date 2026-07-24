import { createPipelinePlan } from '@/lib/sirinx-pipeline';

export type CommandCenterToolName =
  | 'status'
  | 'rooms'
  | 'pipeline_plan'
  | 'utility_manifest'
  | 'telegram_commands';

export const COMMAND_CENTER_ROOMS = [
  {
    id: 'pc-ghostclaw-hq',
    node: 'pc',
    room: 'Ghostclaw HQ',
    telegramBot: 'local-or-old-bot',
    role: 'heavy runtime, WSL, marketplace, long-running jobs',
  },
  {
    id: 'mac-multi-agent-ai-company',
    node: 'mac',
    room: '@MultiAgentAiCompany_bot',
    telegramBot: '@MultiAgentAiCompany_bot',
    role: 'local Hermes, thCLAW, command center, lightweight orchestration',
  },
];

export const TELEGRAM_COMMANDS = [
  { command: '/status', tool: 'status', description: 'System and room overview' },
  { command: '/rooms', tool: 'rooms', description: 'Show 1-node/1-room mapping' },
  { command: '/pipeline', tool: 'pipeline_plan', description: 'Show SIRINX token/agent pipeline plan' },
  { command: '/utility', tool: 'utility_manifest', description: 'Show utility tool capabilities' },
  { command: '/commands', tool: 'telegram_commands', description: 'List Telegram commands' },
];

export function runCommandCenterTool(tool: CommandCenterToolName) {
  switch (tool) {
    case 'status':
      return {
        service: 'sirinx-command-center',
        mode: 'local-first',
        rooms: COMMAND_CENTER_ROOMS,
        tools: TELEGRAM_COMMANDS.map((item) => item.tool),
        timestamp: new Date().toISOString(),
      };
    case 'rooms':
      return {
        rooms: COMMAND_CENTER_ROOMS,
        rule: '1 node = 1 room. PC uses Ghostclaw HQ. Mac uses @MultiAgentAiCompany_bot.',
      };
    case 'pipeline_plan':
      return createPipelinePlan({
        businessName: 'Telegram Command Center',
        province: 'Phitsanulok',
        serviceInterest: 'ai-warroom',
        source: 'telegram',
        urgency: 'medium',
      });
    case 'utility_manifest':
      return {
        name: 'utility-tool',
        supportedLanguages: ['typescript', 'javascript', 'python', 'rust', 'go', 'shell', 'json', 'markdown', 'yaml'],
        tools: ['language_scan', 'check_plan', 'context_budget'],
      };
    case 'telegram_commands':
      return { commands: TELEGRAM_COMMANDS };
  }
}

export function toolFromTelegramCommand(text: string): CommandCenterToolName | null {
  const command = text.trim().split(/\s+/)[0]?.toLowerCase();
  const found = TELEGRAM_COMMANDS.find((item) => item.command === command);
  return found?.tool as CommandCenterToolName | undefined || null;
}
