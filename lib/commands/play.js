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
import { AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";
import bot from "../bot.js";
import musicPlayer from "../services/musicPlayer.js";
const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Provided with youtube link starts playing music on voice channel.")
        .addStringOption(option => option.setName("url")
        .setDescription("Plays video from youtube.")
        .setRequired(true)),
    execute(interaciton) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!((interaciton.member).voice.channelId)) {
                yield interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true });
                return;
            }
            if (bot.services.musicPlayer) {
                const mP = bot.services.musicPlayer;
                if (mP.getConnection().joinConfig.channelId !== (interaciton.member).voice.channelId) {
                    yield interaciton.reply({ content: "Bot is arleady connected on other channel.", ephemeral: true });
                    return;
                }
                const url = interaciton.options.getString("url");
                const urlPattern = /^(https:\/\/www.youtube.com\/).*/;
                if (!url || !(url.match(urlPattern))) {
                    yield interaciton.reply({ content: "Invalid URL.", ephemeral: true });
                    return;
                }
                yield mP.addSong(url);
                const song = mP.getLastSong();
                if (mP.getPlayer().state.status === AudioPlayerStatus.Playing) {
                    clearTimeout(mP.timer);
                    yield interaciton.reply({ content: "Added to queue: " + song.name });
                    return;
                }
                else {
                    if (mP.getQueueLength() > 0) {
                        clearTimeout(mP.timer);
                        const song = mP.getNextSongData();
                        mP.playSong();
                        mP.setSubscription();
                        if (song)
                            yield interaciton.reply({ content: "Playing: " + song.name });
                    }
                    return;
                }
            }
            else {
                const url = interaciton.options.getString("url");
                const urlPattern = /^(https:\/\/www.youtube.com\/).*/;
                if (!url || !(url.match(urlPattern))) {
                    yield interaciton.reply({ content: "Invalid URL.", ephemeral: true });
                    return;
                }
                bot.services.musicPlayer = new musicPlayer(interaciton);
                const mP = bot.services.musicPlayer;
                mP.getConnection().on(VoiceConnectionStatus.Disconnected, () => {
                    bot.services.musicPlayer = undefined;
                });
                yield mP.addSong(url);
                const song = mP.getLastSong();
                if (mP.getPlayer().state.status === AudioPlayerStatus.Playing) {
                    clearTimeout(mP.timer);
                    yield interaciton.reply({ content: "Added to queue: " + song.name });
                    return;
                }
                else {
                    if (mP.getQueueLength() > 0) {
                        clearTimeout(mP.timer);
                        const song = mP.getNextSongData();
                        mP.playSong();
                        mP.setSubscription();
                        if (song)
                            yield interaciton.reply({ content: "Playing: " + song.name });
                    }
                    return;
                }
            }
        });
    }
};
export default play;
