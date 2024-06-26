import { CacheType, ChatInputCommandInteraction, Guild, GuildMFALevel, GuildMember, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import bot from "../bot.js";
import song from "../interfaces/song.js";

const clear = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear queue and current song."),

    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        if(!(((interaciton.member) as GuildMember).voice.channelId)){
            await interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true })
            return;
        }

        if(!bot.services.MusicPlayer){
            await interaciton.reply({ content: "MusicPlayer is not active.", ephemeral: true });
            return;
        }

        if(bot.services.MusicPlayer){
            if(bot.services.MusicPlayer.getConnection().joinConfig.channelId !== ((interaciton.member) as GuildMember).voice.channelId){
                await interaciton.reply({ content: "You cannot clear queue on the other channel.", ephemeral: true});
                return;
            }

            if(bot.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Idle && bot.services.MusicPlayer.getQueueLength() === 0){
                await interaciton.reply({ content: "Queue is already empty.", ephemeral: true });
                return;
            }

            if(bot.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Playing){
                bot.services.MusicPlayer.clearQueue();
                bot.services.MusicPlayer.skipSong();
                await interaciton.reply({ content: "Queue cleared." });
                return;
            }
        }
    } 
}

export default clear;