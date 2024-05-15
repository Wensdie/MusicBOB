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
import { AudioPlayerStatus } from "@discordjs/voice";
import bot from "../bot.js";
const clear = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear queue and current song."),
    execute(interaciton) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!((interaciton.member).voice.channelId)) {
                yield interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true });
                return;
            }
            if (!bot.services.MusicPlayer) {
                yield interaciton.reply({ content: "MusicPlayer is not active.", ephemeral: true });
                return;
            }
            if (bot.services.MusicPlayer) {
                if (bot.services.MusicPlayer.getConnection().joinConfig.channelId !== (interaciton.member).voice.channelId) {
                    yield interaciton.reply({ content: "You cannot clear queue on the other channel.", ephemeral: true });
                    return;
                }
                if (bot.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Idle && bot.services.MusicPlayer.getQueueLength() === 0) {
                    yield interaciton.reply({ content: "Queue is already empty.", ephemeral: true });
                    return;
                }
                if (bot.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Playing) {
                    bot.services.MusicPlayer.clearQueue();
                    bot.services.MusicPlayer.skipSong();
                    yield interaciton.reply({ content: "Queue cleared." });
                    return;
                }
            }
        });
    }
};
export default clear;
