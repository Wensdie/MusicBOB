import {
  CacheType,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  GuildMFALevel,
  SlashCommandBuilder,
} from 'discord.js';
import ytdl from 'ytdl-core';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import bot from '../bot.js';
import MusicPlayer from '../services/musicPlayer.js';

const play = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Provided with youtube link starts playing music on voice channel.')
    .addStringOption((option) =>
      option.setName('url').setDescription('Plays video from youtube.').setRequired(true),
    ),
  async execute(interaciton: ChatInputCommandInteraction) {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    if (bot.services.MusicPlayer) {
      const mP = bot.services.MusicPlayer;
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
        clearTimeout(mP.timer);
        await interaciton.reply({ content: `Added to queue: ${song.name} - ${song.lenght}` });
      } else if (mP.getQueueLength() > 0) {
        clearTimeout(mP.timer);
        const song = mP.getNextSongData();
        mP.playSong(interaciton);
        mP.setSubscription();
        if (song) {
          await interaciton.reply({ content: `Playing: ${song.name} - ${song.lenght}` });
        }
      }
    } else {
      const url = interaciton.options.getString('url');
      const urlPattern = /^(https:\/\/www\.youtube\.com\/watch).*/;

      if (!url?.match(urlPattern)) {
        await interaciton.reply({ content: 'Invalid URL.', ephemeral: true });
        return;
      }

      bot.services.MusicPlayer = new MusicPlayer(interaciton);
      const mP = bot.services.MusicPlayer;

      mP.getConnection().on(VoiceConnectionStatus.Disconnected, () => {
        clearTimeout(mP.timer);
        mP.connection.destroy();
        bot.services.MusicPlayer = undefined;
      });

      try {
        await ytdl.getInfo(url).then((info) => {
          return info.videoDetails.age_restricted;
        });
      } catch (er) {
        await interaciton.reply({
          content: 'Can not play age restricted video. Sorry :(',
          ephemeral: true,
        });
        return;
      }

      await mP.addSong(url);
      const song = mP.getLastSong();
      if (mP.getPlayer().state.status === AudioPlayerStatus.Playing) {
        clearTimeout(mP.timer);
        await interaciton.reply({ content: `Added to queue: ${song.name} - ${song.lenght}` });
      } else if (mP.getQueueLength() > 0) {
        clearTimeout(mP.timer);
        const song = mP.getNextSongData();
        mP.playSong(interaciton);
        mP.setSubscription();
        if (song) {
          await interaciton.reply({ content: `Playing: ${song.name} - ${song.lenght}` });
        }
      }
    }
  },
};

export default play;
