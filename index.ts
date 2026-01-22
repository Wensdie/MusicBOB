import dotenv from 'dotenv';
import { Bot } from './src/Bot';

(async (): Promise<void> => {
  dotenv.config();

  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  if (!DISCORD_BOT_TOKEN) {
    throw new Error('Discord Bot token is missing.');
  }
  const bot = Bot.getInstance(DISCORD_BOT_TOKEN);

  await bot.authorize();

  bot.loadUtilities();
})().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : error;
  console.log(`[ERROR] Critical error, bot is shutting down:\n${errorMessage}`);
  process.exit(1);
});
