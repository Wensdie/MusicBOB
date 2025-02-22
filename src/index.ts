import dotenv from 'dotenv';
import { Bot } from './bot.js';
(async (): Promise<void> => {
  dotenv.config();

  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID;

  if (!DISCORD_BOT_TOKEN || !DISCORD_BOT_ID) {
    throw new Error('Cannot access Discord Bot token or id.');
  }
  const bot = Bot.getInstance(DISCORD_BOT_TOKEN, DISCORD_BOT_ID);

  await bot.authorize();

  await bot.loadUtilities();
})().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
