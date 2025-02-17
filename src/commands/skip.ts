import {
  CacheType,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  GuildMFALevel,
  SlashCommandBuilder,
} from 'discord.js';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import bot from '../bot.js';

const skip = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skiping song.'),

  async execute(interaciton: ChatInputCommandInteraction) {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    if (!bot.services.MusicPlayer) {
      await interaciton.reply({ content: 'MusicPlayer is not active.', ephemeral: true });
      return;
    }

    if (bot.services.MusicPlayer) {
      if (
        bot.services.MusicPlayer.getConnection().joinConfig.channelId !==
        (interaciton.member as GuildMember).voice.channelId
      ) {
        await interaciton.reply({
          content: 'You cannot skip song on the other channel.',
          ephemeral: true,
        });
        return;
      }

      if (bot.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Idle) {
        await interaciton.reply({ content: 'Nothing is playing right now.', ephemeral: true });
        return;
      }

      if (bot.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Playing) {
        bot.services.MusicPlayer.skipSong();
        await interaciton.reply({ content: 'Song skiped.' });
      }
    }
  },
};

export default skip;
