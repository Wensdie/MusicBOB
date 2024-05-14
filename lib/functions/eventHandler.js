var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Events } from "discord.js";
function eventHandler(bot) {
    bot.on(Events.InteractionCreate, (interaction) => __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error("Command was not found.");
            return;
        }
        try {
            yield command.execute(interaction);
        }
        catch (er) {
            console.log(er);
        }
    }));
}
export default eventHandler;
