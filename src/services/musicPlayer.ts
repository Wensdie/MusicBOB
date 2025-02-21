import { ChatInputCommandInteraction, GuildMember, Interaction, TextChannel } from 'discord.js';
import ytdl from '@distube/ytdl-core';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
  StreamType,
} from '@discordjs/voice';
import Song from '../types/song.js';
import { Readable } from 'stream';
import fs from 'node:fs';
class MusicPlayer {
  public agent: ytdl.Agent | undefined;
  public channel: TextChannel | undefined;
  private audioStream: Readable | undefined;
  private queue: Song[] = [];
  public audioPlayer: AudioPlayer;
  public connection: VoiceConnection | undefined;
  private songNow: Song;
  public timer: NodeJS.Timeout | undefined;
  constructor() {
    this.songNow = {
      name: 'none',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      length: '3:32',
    };
    this.agent = ytdl.createAgent(JSON.parse(fs.readFileSync("cookies.json",'utf-8')));
    this.audioPlayer = createAudioPlayer();
    this.connection = undefined;
    this.audioPlayer.on("stateChange", (oldState, newState)=>{
      if(oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle && this.getQueueLength() == 0){
        (this.channel as TextChannel).send(`Queue is empty`);
        (this.channel as TextChannel).send(`Will disconnect after 1 minute in case of request absence `);
        this.timer = setTimeout(()=>{
            this.connection?.destroy();
            this.connection = undefined;
            (this.channel as TextChannel).send(`Disconnecting, Bajo`);
        }, 60000)
      }
    });
  }

  public getPlayer(): AudioPlayer {
    return this.audioPlayer;
  }
  public getConnection() {
    return this.connection;
  }
  public getSongNow(): Song {
    return this.songNow;
  }
  public setSubscription() {
    this.connection!.subscribe(this.audioPlayer);
  }
  public getLastSong(): Song {
    const lastSong = this.queue[this.queue.length - 1];
    if (!lastSong) {
      throw new Error('No song left in queue.');
    }
    return lastSong;
  }

  public getQueue(): Song[] {
    return this.queue;
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public skipSong(): void {
    this.audioPlayer.stop();
  }

  public clearQueue(): void {
    this.queue = [];
  }

  public getNextSongData() {
    if (this.queue.length > 0) {
      return this.queue[0];
    }else{
      return 0;
    }
  }

  async addSong(url: string) {
      await ytdl.getBasicInfo(url, {agent:this.agent}).then((info: any) => {
      const title = info.videoDetails.title;
      const lengthS = info.videoDetails.lengthSeconds;
      const lengthNumber = Number(lengthS);
      const length = `${String(Math.floor(lengthNumber / 60))}:${String(lengthNumber % 60)}`;
      const song: Song = {
        name: title,
        url,
        length,
      };
      this.queue.push(song);
    });
  }

  async playSong(interaction: ChatInputCommandInteraction) {
    const song = this.queue.shift();
    if (!song)return;
    const url = song.url;
    try {
      this.songNow = song;
      this.audioStream =  ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25, agent: this.agent});
    //on error console log
      this.audioStream.on("error", () => {
        console.error("Child process error");
      });
      if (!this.audioStream)return;
      const audioResource = createAudioResource((this.audioStream), {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
      });
      this.audioPlayer.play(audioResource);
    } catch (er) {
      if (interaction.channel) {
        (interaction.channel as TextChannel).send(`Video not found  ${er}`);
      }
    }
  }
}
export default MusicPlayer;
