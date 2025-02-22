import dotenv from 'dotenv';
import { Bot } from './bot.js';
import { Spotify } from 'spotifydl-core';
(async (): Promise<void> => {
  dotenv.config();

  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID;
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!DISCORD_BOT_TOKEN || !DISCORD_BOT_ID) {
    throw new Error('Cannot access Discord Bot token or id.');
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Cannot access Spotify id or secret.');
  }
  const credentials = {
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET
  }

  const spotify = new Spotify(credentials);
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
