#!/usr/bin/env node
import os from 'node:os';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const commandCenterUrl = process.env.COMMAND_CENTER_URL || 'http://127.0.0.1:3002';
const botUsername = process.env.TELEGRAM_BOT_USERNAME || '@MultiAgentAiCompany_bot';
const nodeProfile = process.env.NODE_PROFILE || (process.platform === 'darwin' ? 'mac' : 'pc');
const roomName = process.env.ROOM_NAME || (nodeProfile === 'mac' ? '@MultiAgentAiCompany_bot' : 'Ghostclaw HQ');
const allowedChatIds = new Set(
  (process.env.TELEGRAM_ALLOWED_CHAT_IDS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
);
const dryRun = process.argv.includes('--dry-run') || !token;

const commands = ['/status', '/rooms', '/pipeline', '/utility', '/commands'];

function usage() {
  return {
    service: 'telegram-command-bot',
    botUsername,
    nodeProfile,
    roomName,
    host: os.hostname(),
    commandCenterUrl,
    dryRun,
    commands,
    env: {
      TELEGRAM_BOT_TOKEN: token ? 'set' : 'missing',
      TELEGRAM_ALLOWED_CHAT_IDS: allowedChatIds.size ? `${allowedChatIds.size} configured` : 'not restricted',
      COMMAND_CENTER_URL: commandCenterUrl,
      NODE_PROFILE: nodeProfile,
      ROOM_NAME: roomName,
    },
  };
}

async function callCommandCenter(text) {
  const res = await fetch(`${commandCenterUrl}/api/command-center/tool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramText: text }),
  });
  const json = await res.json();
  if (!res.ok) {
    return `Command Center error:\n${JSON.stringify(json, null, 2)}`;
  }
  return formatResult(json);
}

function formatResult(json) {
  const tool = json.tool || 'unknown';
  const result = json.result || {};
  if (tool === 'status') {
    return [
      `SIRINX Command Center`,
      `Mode: ${result.mode}`,
      `Room: ${roomName}`,
      `Host: ${os.hostname()}`,
      `Tools: ${(result.tools || []).join(', ')}`,
    ].join('\n');
  }
  if (tool === 'rooms') {
    return [
      result.rule,
      ...(result.rooms || []).map((room) => `${room.node}: ${room.room} — ${room.role}`),
    ].join('\n');
  }
  if (tool === 'pipeline_plan') {
    return [
      `Pipeline: ${result.objective}`,
      `Token budget: ${result.totalBudgetTokens}`,
      ...(result.stages || []).map((stage) => `${stage.label}: ${stage.primaryAgentId} (${stage.status})`),
    ].join('\n');
  }
  if (tool === 'utility_manifest') {
    return [
      `Utility Tool`,
      `Languages: ${(result.supportedLanguages || []).join(', ')}`,
      `Tools: ${(result.tools || []).join(', ')}`,
    ].join('\n');
  }
  return JSON.stringify(json, null, 2).slice(0, 3500);
}

async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 3900),
      disable_web_page_preview: true,
    }),
  });
}

async function poll() {
  let offset = 0;
  console.log(JSON.stringify(usage(), null, 2));
  console.log('Telegram polling started.');

  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?timeout=25&offset=${offset}`);
      const json = await res.json();
      for (const update of json.result || []) {
        offset = update.update_id + 1;
        const message = update.message || update.edited_message;
        const text = message?.text || '';
        const chatId = String(message?.chat?.id || '');
        if (!text.startsWith('/')) continue;
        if (allowedChatIds.size && !allowedChatIds.has(chatId)) {
          await sendMessage(chatId, 'Chat is not allowed for this command center bot.');
          continue;
        }
        const reply = commands.includes(text.trim().split(/\s+/)[0])
          ? await callCommandCenter(text)
          : `Unknown command. Use: ${commands.join(', ')}`;
        await sendMessage(chatId, reply);
      }
    } catch (error) {
      console.error('telegram polling error:', error.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

if (dryRun) {
  console.log(JSON.stringify(usage(), null, 2));
  console.log('Dry run only. Set TELEGRAM_BOT_TOKEN to start polling.');
} else {
  poll();
}
