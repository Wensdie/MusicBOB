import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Bot } from '../Bot.js';

const clear = {
  data: new SlashCommandBuilder().setName('clear').setDescription('Clear queue and current song.'),

  async execute(interaciton: ChatInputCommandInteraction): Promise<void> {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();

    if (!bot.discordClient.services.MusicPlayer) {
      await interaciton.reply({ content: 'MusicPlayer is not active.', ephemeral: true });
      return;
    }

    if (bot.discordClient.services.MusicPlayer) {
      if (
        bot.discordClient.services.MusicPlayer.getConnection().joinConfig.channelId !==
        (interaciton.member as GuildMember).voice.channelId
      ) {
        await interaciton.reply({
          content: 'You cannot clear queue on the other channel.',
          ephemeral: true,
        });
        return;
      }

      if (
        bot.discordClient.services.MusicPlayer.getPlayer().state.status ===
          AudioPlayerStatus.Idle &&
        bot.discordClient.services.MusicPlayer.getQueueLength() === 0
      ) {
        await interaciton.reply({ content: 'Queue is already empty.', ephemeral: true });
        return;
      }

      if (
        bot.discordClient.services.MusicPlayer.getPlayer().state.status ===
        AudioPlayerStatus.Playing
      ) {
        bot.discordClient.services.MusicPlayer.clearQueue();
        bot.discordClient.services.MusicPlayer.skipSong();
        await interaciton.reply({ content: 'Queue cleared.' });
      }
    }
  },
};

export default clear;
