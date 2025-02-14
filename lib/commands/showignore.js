var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SlashCommandBuilder } from "discord.js";
import bot from "../bot.js";
import Teams from "../services/teams.js";
const showignore = {
    data: new SlashCommandBuilder()
        .setName("showignore")
        .setDescription("Show ingored users."),
    execute(interaciton) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!((interaciton.member).voice.channelId)) {
                yield interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true });
                return;
            }
            if (!bot.services.teams) {
                bot.services.teams = new Teams();
            }
            if (bot.services.teams.getIgnore().length > 0) {
                let ignoringTab = "Ignoring:\n\n";
                for (const ign of bot.services.teams.getIgnore()) {
                    ignoringTab += "❌ " + ign + "\n";
                }
                yield interaciton.reply({ content: ignoringTab });
                return;
            }
            else {
                yield interaciton.reply({ content: "No one is ignored right now." });
                return;
            }
        });
    }
};
export default showignore;
