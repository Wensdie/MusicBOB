var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ytdl from "ytdl-core";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
class musicPlayer {
    constructor(interaciton) {
        this.name = "musicPlayer";
        this.queue = [];
        this.audioPlayer = createAudioPlayer();
        if (interaciton.member && interaciton.guild) {
            const guildMember = (interaciton.member);
            const chnID = guildMember.voice.channelId;
            const glID = guildMember.guild.id;
            if (chnID && glID) {
                this.connection = joinVoiceChannel({
                    channelId: chnID,
                    guildId: glID,
                    adapterCreator: interaciton.guild.voiceAdapterCreator
                });
                this.audioPlayer.on(AudioPlayerStatus.Idle, () => __awaiter(this, void 0, void 0, function* () {
                    if (interaciton.channel) {
                        if (this.getQueueLength() > 0) {
                            const song = this.getNextSongData();
                            this.playSong();
                            if (song) {
                                clearTimeout(this.timer);
                                yield interaciton.channel.send({ content: "Playing: " + song.name });
                                return;
                            }
                        }
                        else {
                            yield interaciton.channel.send({ content: "No more songs left." });
                            this.timer = setTimeout(() => {
                                if (interaciton.channel)
                                    interaciton.channel.send("5 min without playing music, leaving channel.");
                                this.connection.disconnect();
                            }, 300000);
                            return;
                        }
                    }
                    return;
                }));
            }
        }
    }
    getPlayer() {
        return this.audioPlayer;
    }
    getConnection() {
        return this.connection;
    }
    getLastSong() {
        return this.queue[this.queue.length - 1];
    }
    getQueueLength() {
        return this.queue.length;
    }
    addSong(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, lenght } = yield ytdl.getInfo(url).then((info) => { return { title: info.videoDetails.title, lenght: info.videoDetails.lengthSeconds }; });
            const song = {
                name: title,
                url: url,
                lenght: lenght
            };
            this.queue.push(song);
        });
    }
    getNextSongData() {
        if (this.queue.length > 0) {
            return this.queue[0];
        }
    }
    playSong() {
        const song = this.queue.shift();
        if (song) {
            const url = song.url;
            const songResource = createAudioResource(ytdl(url, { filter: "audioonly", highWaterMark: 1 << 25 }));
            this.audioPlayer.play(songResource);
        }
    }
    setSubscription() {
        this.connection.subscribe(this.audioPlayer);
    }
}
export default musicPlayer;
