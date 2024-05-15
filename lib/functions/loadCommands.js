var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
import fs from "fs";
function loadCommands(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv.config();
        const DISCORD_BOT_TOKEN = process.env["DISCORD_BOT_TOKEN"];
        const DISCORD_BOT_ID = process.env["DISCORD_BOT_ID"];
        if (!DISCORD_BOT_TOKEN || !DISCORD_BOT_ID) {
            throw new Error("Cannot access Discord Bot token or id.");
        }
        const commandRegistry = [];
        try {
            const folderPath = "commands";
            const folderFiles = fs.readdirSync(folderPath);
            console.log("Loading bot commands.");
            for (const file of folderFiles) {
                const { default: command } = yield import("../commands/" + file);
                bot.commands.set(command.data.name, command);
                commandRegistry.push(command.data.toJSON());
            }
            console.log("Commands loaded succefully.");
        }
        catch (er) {
            console.error("Error loading commands: " + er);
        }
        // try{
        //     console.log("Registering bot commands.")
        //     const rest = new REST().setToken(DISCORD_BOT_TOKEN);
        //     await rest.put(
        //         Routes.applicationCommands(DISCORD_BOT_ID),
        //         { body:  commandRegistry},
        //     );
        //     console.log("Commands registered succesfully.");
        // }
        // catch (er) {
        //     console.error("Error registering commands: " + er);
        // }   
    });
}
export default loadCommands;
