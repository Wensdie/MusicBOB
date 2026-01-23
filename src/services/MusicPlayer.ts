import { TextChannel } from "discord.js";
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import { PassThrough } from "stream";
import { YTDLPlayer } from "../utilities";
import type { ChildProcessWithoutNullStreams } from "child_process";
import type { Song } from "../types";

export class MusicPlayer {
  private static instance: MusicPlayer;
  private readonly audioPlayer: AudioPlayer;
  private readonly ytdlPlayer = new YTDLPlayer();
  private audioStream?: ChildProcessWithoutNullStreams;
  private connection?: VoiceConnection;
  private channel: TextChannel;
  private timer?: NodeJS.Timeout;
  private queue: Song[] = [];
  private songNow?: Song;

  private constructor(channel: TextChannel) {
    this.audioPlayer = createAudioPlayer();
    this.channel = channel;

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      this.songNow = undefined;
      if (!this.queue.length) {
        this.startDisconnectTimer().catch((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : error;
          throw new Error(
            `Error while starting disconnect timer:\n${errorMessage}`,
          );
        });
        return;
      }
      this.playNextSong().catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : error;
        throw new Error(
          `Error while sarting playing next song:\n${errorMessage}`,
        );
      });
    });
  }

  public static getInstance(channel: TextChannel): MusicPlayer {
    if (!MusicPlayer.instance) {
      MusicPlayer.instance = new MusicPlayer(channel);
    }
    MusicPlayer.instance.channel = channel;

    return MusicPlayer.instance;
  }

  public getCurrentStatus(): AudioPlayerStatus {
    return this.audioPlayer.state.status;
  }

  public getQueue(): Song[] {
    return this.queue;
  }

  public getSongNow(): Song | undefined {
    return this.songNow;
  }

  public getConnection(): VoiceConnection | undefined {
    return this.connection;
  }

  public setConnection(connection: VoiceConnection): void {
    this.connection = connection;
    this.connection.subscribe(this.audioPlayer);
  }

  public setSubscription(): void {
    this.connection?.subscribe(this.audioPlayer);
  }

  public async addSong(url: string): Promise<Song> {
    const song = await this.ytdlPlayer.getMetadata(url);

    this.queue.push(song);

    if (
      !this.audioPlayer.state.status ||
      this.audioPlayer.state.status === AudioPlayerStatus.Idle
    ) {
      await this.playNextSong();
    }

    return song;
  }

  public skip(): void {
    this.audioPlayer.stop(true);
  }

  public clearQueue(): void {
    this.queue = [];
    this.skip();
  }

  private async playNextSong(): Promise<void> {
    this.clearDisconnectTimer();

    this.songNow = this.queue.shift();
    if (!this.songNow) {
      return;
    }

    try {
      const passThrough = new PassThrough();
      this.audioStream = this.ytdlPlayer.play(this.songNow.url, passThrough);
      const resource = createAudioResource(passThrough, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
      });

      this.audioPlayer.play(resource);
      await this.channel.send(
        `Playing: ${this.songNow.name} - ${this.songNow.length}`,
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : error;
      throw new Error(`Error while sending a message:\n${errorMessage}`);
    }
  }

  private async startDisconnectTimer(): Promise<void> {
    await this.channel.send(
      "Queue empty. Disconnecting in 3 minutes if no new song is added.",
    );
    this.timer = setTimeout(() => {
      this.connection?.destroy();
      this.connection = undefined;
      this.channel.send("Disconnecting, Bajo").catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : error;
        throw new Error(`Error while sending a message:\n${errorMessage}`);
      });
      console.log("[LOG] Disconnected due to inactivity.");
    }, 180000);
  }

  private clearDisconnectTimer(): void {
    if (this.timer) {
      console.log("[LOG] New song added, clearing timeout.");
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
