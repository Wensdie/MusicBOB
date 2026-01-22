import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { Bot } from '../../Bot';
import type { Command } from '../../types';

export const clear: Command = {
  data: new SlashCommandBuilder().setName('clear').setDescription('Clear queue and current song.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    //wrong interaction channel
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log('Invoked bot/clear without connecting to channel');
      await interaction.reply({
        content: 'You have to join voice chat first.',
        ephemeral: true,
      });
      return;
    }

    const bot = Bot.getInstance();
    const musicPlayerService = bot.getMusicPlayer(interaction.channel as TextChannel);

    if (
      musicPlayerService.getConnection()?.joinConfig.channelId !==
      (interaction.member as GuildMember).voice.channelId
    ) {
      console.log('User invoked bot/clear when on different channel');
      await interaction.reply({
        content: 'You cannot clear queue on the other channel.',
        ephemeral: true,
      });
      return;
    }
    //Queue empty
    if (!musicPlayerService.getQueue().length) {
      console.log('Invoked bot/clear when queue empty');
      await interaction.reply({
        content: 'Queue is already empty.',
        ephemeral: true,
      });
      return;
    }
    //Cleanse Queue

    musicPlayerService.clearQueue();
    await interaction.reply({ content: 'Queue cleared.' });
  },
};
