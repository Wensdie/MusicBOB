import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import ytdl from 'ytdl-core';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
} from '@discordjs/voice';
import Song from '../types/song.js';

class MusicPlayer {
  public name = 'MusicPlayer';
  private queue: Song[] = [];
  private readonly audioPlayer: AudioPlayer;
  public readonly connection!: VoiceConnection;
  private songNow: Song;
  public timer: NodeJS.Timeout | undefined;

  constructor(interaciton?: ChatInputCommandInteraction) {
    this.songNow = {
      name: 'none',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      lenght: '3:32',
    };

    this.audioPlayer = createAudioPlayer();
    // if (interaciton.member && interaciton.guild) {
    //   const guildMember = interaciton.member as GuildMember;
    //   const chnID = guildMember.voice.channelId;
    //   const glID = guildMember.guild.id;
    //   if (chnID && glID) {
    //     this.connection = joinVoiceChannel({
    //       channelId: chnID,
    //       guildId: glID,
    //       adapterCreator: interaciton.guild.voiceAdapterCreator,
    //     });

    //     this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
    //       if (interaciton.channel) {
    //         if (this.getQueueLength() > 0) {
    //           const song = this.getNextSongData();
    //           this.playSong(interaciton).catch((e: unknown) => {
    //             console.error(e);
    //           });
    //           if (song) {
    //             clearTimeout(this.timer);
    //             interaciton.channel
    //               .send({
    //                 content: `Playing: ${song.name} - ${song.lenght}`,
    //               })
    //               .catch((e: unknown) => {
    //                 console.error(e);
    //               });
    //           }
    //         } else {
    //           interaciton.channel.send({ content: 'No more songs left.' }).catch((e: unknown) => {
    //             console.error(e);
    //           });

    //           this.timer = setTimeout(() => {
    //             if (interaciton.channel) {
    //               interaciton.channel
    //                 .send('5 min without playing music, leaving channel. Bajo!')
    //                 .catch((e: unknown) => {
    //                   console.error(e);
    //                 });
    //             }
    //             this.connection.disconnect();
    //           }, 300000);
    //         }
    //       }
    //     });
    //   }
    // }
  }

  public getPlayer(): AudioPlayer {
    return this.audioPlayer;
  }

  public getConnection(): VoiceConnection {
    return this.connection;
  }

  public getSongNow(): Song {
    return this.songNow;
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

  public setSubscription(): void {
    this.connection.subscribe(this.audioPlayer);
  }

  public clearQueue(): void {
    this.queue = [];
  }

  public async addSong(url: string): Promise<void> {
    const { title, lenghtS } = await ytdl.getInfo(url).then((info) => {
      return { title: info.videoDetails.title, lenghtS: info.videoDetails.lengthSeconds };
    });
    const lenghtNumber = Number(lenghtS);
    const lenght = `${String(Math.floor(lenghtNumber / 60))}:${String(lenghtNumber % 60)}`;
    const song: Song = {
      name: title,
      url,
      lenght,
    };
    this.queue.push(song);
  }

  public getNextSongData(): Song | undefined {
    if (this.queue.length > 0) {
      return this.queue[0];
    }
    return undefined;
  }

  public async playSong(interaciton: ChatInputCommandInteraction): Promise<void> {
    const song = this.queue.shift();
    if (song) {
      const url = song.url;
      try {
        this.songNow = song;
        const songResource = createAudioResource(
          ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25 }),
        );
        this.audioPlayer.play(songResource);
      } catch (er: unknown) {
        if (interaciton.channel) {
          console.log(`Error occured while fetching song. Error:\n${er}`);
          await interaciton.channel.send(`Error occured while fetching song. Error:\n${er}`);
        }
      }
    }
  }
}
export default MusicPlayer;
