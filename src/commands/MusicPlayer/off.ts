import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { Bot } from '../../Bot';
import type { Command } from '../../types';

export const off: Command = {
  data: new SlashCommandBuilder().setName('off').setDescription('Turn off MusicPlayer.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log('[LOG] Invoked bot/off without connecting to channel.');
      await interaction.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();
    const musicPlayerService = bot.getMusicPlayer(interaction.channel as TextChannel);

    const connection = musicPlayerService.getConnection();

    if (!connection) {
      console.log('[LOG] Invoked bot/off but bot wasnt on voice channel.');
      await interaction.reply({ content: 'Bot is already disconnected.', ephemeral: true });
      return;
    }

    console.log('[LOG] Successfully bot/off, bot disconnecting from channel.');
    await interaction.reply('Disconnected. Bajo!');
    connection.disconnect();
  },
};
