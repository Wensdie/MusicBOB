import { CacheType, ChatInputCommandInteraction, Guild, GuildMFALevel, GuildMember, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import ytdl from "ytdl-core";
import bot from "../bot.js"
import musicPlayer from "../services/musicPlayer.js";

const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Provided with youtube link starts playing music on voice channel.")
        .addStringOption(option => 
            option.setName("url")
                .setDescription("Plays video from youtube.")
                .setRequired(true)            
        ),
    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        if(!(((interaciton.member) as GuildMember).voice.channelId)){
            await interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true })
            return;
        }

        if(bot.services.musicPlayer){
            const mP = bot.services.musicPlayer;
            if(mP.getConnection().joinConfig.channelId !== ((interaciton.member) as GuildMember).voice.channelId){
                await interaciton.reply({ content: "Bot is arleady connected on other channel.", ephemeral: true});
                return;
            }

            const url = interaciton.options.getString("url");
            const urlPattern = /^(https:\/\/www.youtube.com\/).*/;

            if(!url || !(url.match(urlPattern))){
                await interaciton.reply({ content: "Invalid URL.", ephemeral: true});
                return;
            }

            await mP.addSong(url);
            const song = mP.getLastSong();
            await interaciton.reply({ content: "Added to queue: " + song.name});
        }
        else{
            const url = interaciton.options.getString("url");
            const urlPattern = /^(https:\/\/www.youtube.com\/).*/;

            if(!url || !(url.match(urlPattern))){
                await interaciton.reply({ content: "Invalid URL.", ephemeral: true});
                return;
            }

            bot.services.musicPlayer = new musicPlayer(interaciton);
            const mP = bot.services.musicPlayer;

            await mP.addSong(url);
            const song = mP.getLastSong();
            await interaciton.reply({ content: "Added to queue: " + song.name});

            if(mP.getPlayer().state.status === AudioPlayerStatus.Idle){
                mP.playSong();
                mP.setSubscription();
                await interaciton.reply({ content: "Playing: " + song.name});
            }
        }
        
        const mP = bot.services.musicPlayer;

        mP.getPlayer().on(AudioPlayerStatus.Idle, 
            async () => {
                const song = mP.getNextSongData();
                mP.playSong();
                await interaciton.reply({ content: "Playing: " + song.name});
            }
        )
        
        mP.getConnection().on(VoiceConnectionStatus.Disconnected, 
            () => {
                bot.services.musicPlayer = undefined;
            }
        )
    } 
}

export default play;