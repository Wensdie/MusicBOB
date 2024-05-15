import { CacheType, ChatInputCommandInteraction, Guild, GuildMFALevel, GuildMember, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import bot from "../bot.js";
import song from "../interfaces/song.js";

const skip = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skiping song."),

    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        if(!(((interaciton.member) as GuildMember).voice.channelId)){
            await interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true })
            return;
        }

        if(!bot.services.musicPlayer){
            await interaciton.reply({ content: "MusicPlayer is not active.", ephemeral: true });
            return;
        }

        if(bot.services.musicPlayer){
            if(bot.services.musicPlayer.getConnection().joinConfig.channelId !== ((interaciton.member) as GuildMember).voice.channelId){
                await interaciton.reply({ content: "You cannot skip song on the other channel.", ephemeral: true});
                return;
            }

            if(bot.services.musicPlayer.getPlayer().state.status === AudioPlayerStatus.Idle){
                await interaciton.reply({ content: "Nothing is playing right now.", ephemeral: true });
                return;
            }

            if(bot.services.musicPlayer.getPlayer().state.status === AudioPlayerStatus.Playing){
                bot.services.musicPlayer.skipSong();
                await interaciton.reply({ content: "Song skiped." });
                return;
            }
        }
    } 
}

export default skip;