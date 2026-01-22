import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import dotenv from 'dotenv';
import * as commands from '../commands';

(async (): Promise<void> => {
  dotenv.config();

  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID;

  if (!DISCORD_BOT_TOKEN || !DISCORD_BOT_ID) {
    throw new Error('Discord Bot token or/and ID is/are missing.');
  }
  const commandRegistry: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  console.log('[LOG] Loading bot commands.');
  for (const commandCode of Object.values(commands)) {
    commandRegistry.push(commandCode.data.toJSON());
  }
  console.log('Commands loaded succefully.');

  console.log('Registering bot commands.');
  const rest = new REST().setToken(DISCORD_BOT_TOKEN);
  await rest.put(Routes.applicationCommands(DISCORD_BOT_ID), { body: commandRegistry });
  console.log('Commands registered succesfully.');
})().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : error;
  console.log(`[ERROR] Error while registering commands:\n${errorMessage}`);
  process.exit(1);
});
