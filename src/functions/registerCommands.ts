import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { commandSchema } from '../schemas/commandSchema.js';
(async (): Promise<void> => {
  dotenv.config();

  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID;

  if (!DISCORD_BOT_TOKEN || !DISCORD_BOT_ID) {
    throw new Error('Cannot access Discord Bot token or id.');
  }
  const commandRegistry: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  try {
    const folderPath = 'lib/commands';
    const folderFiles = fs.readdirSync(folderPath).filter((file) => {
      return file.includes('.js');
    });

    console.log('Loading bot commands.');

    for (const file of folderFiles) {
      const { default: command } = await import(`../commands/${file}`);
      const parsedCommand = commandSchema.parse(command);
      commandRegistry.push(parsedCommand.data.toJSON());
    }

    console.log('Commands loaded succefully.');
  } catch (er) {
    console.error(`Error loading commands: ${er}`);
  }

  try {
    console.log('Registering bot commands.');
    const rest = new REST().setToken(DISCORD_BOT_TOKEN);

    await rest.put(Routes.applicationCommands(DISCORD_BOT_ID), { body: commandRegistry });

    console.log('Commands registered succesfully.');
  } catch (er) {
    console.error(`Error registering commands: ${er}`);
  }
})().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
