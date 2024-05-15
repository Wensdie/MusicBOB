import { CacheType, ChatInputCommandInteraction, Guild, GuildMFALevel, GuildMember, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import bot from "../bot.js";

const off = {
    data: new SlashCommandBuilder()
        .setName("off")
        .setDescription("Turn off MusicPlayer."),

    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        if(!(((interaciton.member) as GuildMember).voice.channelId)){
            await interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true })
            return;
        }

        if(!bot.services.MusicPlayer){
            await interaciton.reply({ content: "MusicPlayer is already off.", ephemeral: true });
            return;
        }

        if(bot.services.MusicPlayer){
            if(interaciton.channel)
                await interaciton.reply("Disconnected. Bajo!");
                bot.services.MusicPlayer.connection.disconnect();
        }
    } 
}

export default off;