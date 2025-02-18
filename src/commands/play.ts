import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import ytdl from 'ytdl-core';
import { AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';
import { Bot } from '../Bot.js';
import MusicPlayer from '../services/musicPlayer.js';

const play = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Provided with youtube link starts playing music on voice channel.')
    .addStringOption((option) =>
      option.setName('url').setDescription('Plays video from youtube.').setRequired(true),
    ),
  async execute(interaciton: ChatInputCommandInteraction): Promise<void> {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();

    if (bot.discordClient.services.MusicPlayer) {
      const mP = bot.discordClient.services.MusicPlayer;
      const timer = mP.timer;
      if (
        mP.getConnection().joinConfig.channelId !==
        (interaciton.member as GuildMember).voice.channelId
      ) {
        await interaciton.reply({
          content: 'Bot is arleady connected on other channel.',
          ephemeral: true,
        });
        return;
      }

      const url = interaciton.options.getString('url');
      const urlPattern = /^(https:\/\/www\.youtube\.com\/watch).*/;

      if (!url?.match(urlPattern)) {
        await interaciton.reply({ content: 'Invalid URL.', ephemeral: true });
        return;
      }

      try {
        await ytdl.getInfo(url).then((info) => {
          return info.videoDetails.age_restricted;
        });
      } catch (er) {
        await interaciton.reply({ content: `Error: ${er}`, ephemeral: true });
        return;
      }

      await mP.addSong(url);
      const song = mP.getLastSong();
      if (mP.getPlayer().state.status === AudioPlayerStatus.Playing) {
        if (timer instanceof NodeJS.Timeout) {
          clearTimeout(timer);
        }
        await interaciton.reply({ content: `Added to queue: ${song.name} - ${song.lenght}` });
      } else if (mP.getQueueLength() > 0) {
        if (timer instanceof NodeJS.Timeout) {
          clearTimeout(timer);
        }
        const nextSong = mP.getNextSongData();
        await mP.playSong(interaciton);
        mP.setSubscription();
        if (nextSong) {
          await interaciton.reply({ content: `Playing: ${nextSong.name} - ${nextSong.lenght}` });
        }
      }
    } else {
      const url = interaciton.options.getString('url');
      const urlPattern = /^(https:\/\/www\.youtube\.com\/watch).*/;

      if (!url?.match(urlPattern)) {
        await interaciton.reply({ content: 'Invalid URL.', ephemeral: true });
        return;
      }

      bot.discordClient.services.MusicPlayer = new MusicPlayer(interaciton);
      const mP = bot.discordClient.services.MusicPlayer;

      mP.getConnection().on(VoiceConnectionStatus.Disconnected, () => {
        const timer = mP.timer;
        if (timer instanceof NodeJS.Timeout) {
          clearTimeout(timer);
        }
        mP.connection.destroy();
      });

      try {
        await ytdl.getInfo(url).then((info) => {
          return info.videoDetails.age_restricted;
        });
      } catch (er: unknown) {
        console.log(er);
        await interaciton.reply({
          content: 'Can not play age restricted video. Sorry :(',
          ephemeral: true,
        });
        return;
      }

      await mP.addSong(url);
      const song = mP.getLastSong();
      if (mP.getPlayer().state.status === AudioPlayerStatus.Playing) {
        const timer = mP.timer;
        if (timer instanceof NodeJS.Timeout) {
          clearTimeout(timer);
        }
        await interaciton.reply({ content: `Added to queue: ${song.name} - ${song.lenght}` });
      } else if (mP.getQueueLength() > 0) {
        const timer = mP.timer;
        if (timer instanceof NodeJS.Timeout) {
          clearTimeout(timer);
        }
        const nextSong = mP.getNextSongData();
        await mP.playSong(interaciton);
        mP.setSubscription();
        if (nextSong) {
          await interaciton.reply({ content: `Playing: ${nextSong.name} - ${nextSong.lenght}` });
        }
      }
    }
  },
};

export default play;
