import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../bot.js';

const off = {
  data: new SlashCommandBuilder().setName('off').setDescription('Turn off MusicPlayer.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    if (!(interaction.member as GuildMember).voice.channelId) {
      await interaction.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();
    if (!bot.discordClient.services.MusicPlayer) {
      await interaction.reply({ content: 'MusicPlayer is already off.', ephemeral: true });
      return;
    }

    if (bot.discordClient.services.MusicPlayer) {
      if (interaction.channel) {
        await interaction.reply('Disconnected. Bajo!');
      }
      bot.discordClient.services.MusicPlayer.connection!.disconnect();
    }
  },
};

export default off;
