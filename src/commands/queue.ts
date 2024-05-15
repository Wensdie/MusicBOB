import { CacheType, ChatInputCommandInteraction, Guild, GuildMFALevel, GuildMember, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import bot from "../bot.js";
import song from "../interfaces/song.js";

const queue = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Showing queque."),

    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        if(!bot.services.MusicPlayer){
            await interaciton.reply({ content: "MusicPlayer is not active.", ephemeral: true });
            return;
        }

        if(bot.services.MusicPlayer.getQueue()){
            const mP = bot.services.MusicPlayer;

            if(mP.getQueueLength() === 0 && mP.getPlayer().state.status === AudioPlayerStatus.Idle){
                await interaciton.reply({ content: "Queue is empty.", ephemeral: true });
                return;
            }
            
            const songNow = mP.getSongNow();
            
            let queue = "Playing: " + songNow.name + " - " +songNow.lenght;

            if(mP.getQueueLength() > 0){
                queue += "\n\n";
                const songs: song[] = mP.getQueue();
                let i = 1;
                for(const song of songs){
                    queue += i +") " + song.name + " - " +song.lenght + "\n";
                    i++;
                }
            }

            await interaciton.reply({ content: queue });
            return;
        }
    } 
}

export default queue;