import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import loadCommands from "./functions/loadCommands.js";
import eventHandler from "./functions/eventHandler.js";
dotenv.config();
const DISCORD_BOT_TOKEN = process.env["DISCORD_BOT_TOKEN"];
if (!process.env["DISCORD_BOT_TOKEN"]) {
    throw new Error("Cannot access Discord Bot token.");
}
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
bot.commands = new Collection();
loadCommands(bot);
eventHandler(bot);
bot.login(DISCORD_BOT_TOKEN);
