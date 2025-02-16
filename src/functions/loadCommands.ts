import { Client, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";

async function loadCommands(bot: Client){
    dotenv.config();

    const DISCORD_BOT_TOKEN = process.env["DISCORD_BOT_TOKEN"];
    const DISCORD_BOT_ID = process.env["DISCORD_BOT_ID"];
    if(!DISCORD_BOT_TOKEN || !DISCORD_BOT_ID){
        throw new Error("Cannot access Discord Bot token or id.");
    }
    
    try{
        const folderPath = "commands";
        const folderFiles = fs.readdirSync(folderPath);
        
        console.log("Loading bot commands.")
        
        for(const file of folderFiles){
            const {default: command} = await import("../commands/"+ file);
            bot.commands.set(command.data.name, command);
        }

        console.log("Commands loaded succefully.")
    }
    catch (er) {
        console.error("Error loading commands: " + er)
    }  
}
export default loadCommands;