import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import ytdl from "ytdl-core";

const play = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Provided with youtube link starts playing music on voice channel.")
        .addStringOption(option => 
            option.setName("url")
                .setDescription("Plays video from youtube.")
                .setRequired(true)            
        ),
    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        const url = interaciton.options.getString("url");
        if(!url){
            await interaciton.reply(`Invalid url.`);
            return;
        }
        const songName = await musicYT(url);
        await interaciton.reply(`Playing song: ${songName}`);
    }
};

async function musicYT(videoURL: string): Promise<string> {
    const title = await ytdl.getInfo(videoURL).then(
        (info) => {
            return info.videoDetails.title;
        });
    return title;
}       

export default play;