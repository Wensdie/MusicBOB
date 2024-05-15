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
const off = {
    data: new SlashCommandBuilder()
        .setName("off")
        .setDescription("Turn off MusicPlayer."),
    execute(interaciton) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!((interaciton.member).voice.channelId)) {
                yield interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true });
                return;
            }
            if (!bot.services.MusicPlayer) {
                yield interaciton.reply({ content: "MusicPlayer is already off.", ephemeral: true });
                return;
            }
            if (bot.services.MusicPlayer) {
                if (interaciton.channel)
                    yield interaciton.reply("Disconnected. Bajo!");
                bot.services.MusicPlayer.connection.disconnect();
            }
        });
    }
};
export default off;
