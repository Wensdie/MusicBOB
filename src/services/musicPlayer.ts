import song from "../interfaces/song.js"
import service from "../interfaces/service.js";
import ytdl from "ytdl-core";
import { AudioPlayer, AudioPlayerStatus, JoinVoiceChannelOptions, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { APIActionRowComponent, CacheType, ChatInputCommandInteraction, Guild, GuildMember } from "discord.js";

class musicPlayer implements service{
    public name = "musicPlayer";
    private queue: song[] = [];
    private audioPlayer: AudioPlayer;
    private connection!: VoiceConnection;

    constructor(interaciton: ChatInputCommandInteraction<CacheType>){
        this.audioPlayer = createAudioPlayer();
        if(interaciton.member && interaciton.guild){
            const guildMember = (interaciton.member) as GuildMember;
            const chnID = guildMember.voice.channelId;
            const glID = guildMember.guild.id;
            if(chnID && glID){
                this.connection = joinVoiceChannel({
                    channelId: chnID,
                    guildId: glID,
                    adapterCreator: interaciton.guild.voiceAdapterCreator
                });
            }
        }
    }

    getPlayer(){
        return this.audioPlayer;
    }

    getConnection(){
        return this.connection;
    }

    getLastSong(){
        return this.queue[this.queue.length-1];
    }

    getQueueLength(){
        return this.queue.length;
    }

    async addSong(url: string){
        const {title, lenght} = await ytdl.getInfo(url).then((info) => {return {title: info.videoDetails.title, lenght: info.videoDetails.lengthSeconds};});
        const song: song = {
            name: title,
            url: url,
            lenght: lenght
        }
        this.queue.push(song);   
    }

    getNextSongData(){
        if(this.queue.length > 0 ){
            return this.queue[0];
        }
    }

    playSong(){
        const song = this.queue.shift();
        if(song){
            const url = song.url;
            const songResource = createAudioResource(ytdl(url, {filter: "audioonly", highWaterMark: 1 << 25}));
            this.audioPlayer.play(songResource);
        }
    }

    setSubscription(){
        this.connection.subscribe(this.audioPlayer);
    }
}
export default musicPlayer;