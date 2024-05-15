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
const queue = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Showing queque."),
    execute(interaciton) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bot.services.MusicPlayer) {
                yield interaciton.reply({ content: "MusicPlayer is not active.", ephemeral: true });
                return;
            }
            if (bot.services.MusicPlayer.getQueue()) {
                const mP = bot.services.MusicPlayer;
                if (mP.getQueueLength() === 0 && mP.getPlayer().state.status === AudioPlayerStatus.Idle) {
                    yield interaciton.reply({ content: "Queue is empty.", ephemeral: true });
                    return;
                }
                const songNow = mP.getSongNow();
                let queue = "Playing: " + songNow.name + " - " + songNow.lenght;
                if (mP.getQueueLength() > 0) {
                    queue += "\n\n";
                    const songs = mP.getQueue();
                    let i = 1;
                    for (const song of songs) {
                        queue += i + ") " + song.name + " - " + song.lenght + "\n";
                        i++;
                    }
                }
                yield interaciton.reply({ content: queue });
                return;
            }
        });
    }
};
export default queue;
