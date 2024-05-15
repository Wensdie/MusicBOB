import Song from "../interfaces/song.js"
import Service from "../interfaces/service.js";
import ytdl from "ytdl-core";
import { AudioPlayer, AudioPlayerStatus, JoinVoiceChannelOptions, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { APIActionRowComponent, CacheType, ChatInputCommandInteraction, Guild, GuildMember } from "discord.js";

class MusicPlayer implements Service{
    public name = "MusicPlayer";
    private queue: Song[] = [];
    private audioPlayer: AudioPlayer;
    private connection!: VoiceConnection;
    private songNow: Song;
    public timer: any;

    constructor(interaciton: ChatInputCommandInteraction<CacheType>){
        this.songNow ={
            name: "none",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            lenght: "3:32"
        }

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

                this.audioPlayer.on(AudioPlayerStatus.Idle, 
                    async () => {
                        if(interaciton.channel){
                            if(this.getQueueLength()>0){
                                const song = this.getNextSongData();
                                this.playSong(interaciton);
                                if(song){
                                    clearTimeout(this.timer);
                                    await interaciton.channel.send({ content: "Playing: "  + song.name + " - " +song.lenght });
                                    return;
                                }
                            }
                            else{
                                await interaciton.channel.send({ content: "No more songs left."});
                                this.timer = setTimeout(
                                    () => {
                                        if(interaciton.channel)
                                        interaciton.channel.send("5 min without playing music, leaving channel. Bajo!");
                                        this.connection.disconnect();
                                    }, 300000
                                );
                                return;
                            }
                        }
                        return;   
                    }
                )
            }
        }
    }

    getPlayer(){
        return this.audioPlayer;
    }

    getConnection(){
        return this.connection;
    }

    getSongNow(){
        return this.songNow;
    }

    getLastSong(){
        return this.queue[this.queue.length-1];
    }

    getQueue(){
        return this.queue;
    }

    getQueueLength(){
        return this.queue.length;
    }

    skipSong(){
        this.audioPlayer.stop();
    }

    setSubscription(){
        this.connection.subscribe(this.audioPlayer);
    }

    clearQueue(){
        this.queue = [];
    }

    async addSong(url: string){
        const {title, lenghtS} = await ytdl.getInfo(url).then((info) => {return {title: info.videoDetails.title, lenghtS: info.videoDetails.lengthSeconds};});
        const lenghtNumber = Number(lenghtS);
        const lenght = String(Math.floor(lenghtNumber/60)) + ":" + String(lenghtNumber%60);
        const song: Song = {
            name: title,
            url: url,
            lenght: lenght
        }
        this.queue.push(song);   
    }

    getNextSongData(){
        if(this.queue.length >  0 ){
            return this.queue[0];
        }
    }

    playSong(interaciton: ChatInputCommandInteraction<CacheType>){
        const song = this.queue.shift();
        if(song){
            const url = song.url;
            try{
                this.songNow = song;
                const songResource = createAudioResource(ytdl(url, {filter: "audioonly", highWaterMark: 1 << 25}));
                this.audioPlayer.play(songResource);
            }
            catch(er){
                if(interaciton.channel)
                    interaciton.channel.send("Video was not found.");
            }
        }
    }
}
export default MusicPlayer;