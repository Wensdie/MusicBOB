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
const ignore = {
    data: new SlashCommandBuilder()
        .setName("ignore")
        .setDescription("Ignore user in team building.")
        .addStringOption(option => option.setName("user")
        .setDescription("User to ignore.")
        .setRequired(true)),
    execute(interaciton) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!((interaciton.member).voice.channelId)) {
                yield interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true });
                return;
            }
            if (!bot.services.teams) {
                bot.services.teams = new Teams();
            }
            const user = interaciton.options.getString("user");
            bot.services.teams.addIgnore(user);
            yield interaciton.reply({ content: "Ignoring: " + user });
            return;
        });
    }
};
export default ignore;
