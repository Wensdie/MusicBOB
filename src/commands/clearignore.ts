import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../bot.js';

const clearignore = {
  data: new SlashCommandBuilder().setName('clearignore').setDescription('Clear ignored users.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
//Member does not belong to any Vchannel;
    if (!(interaction.member as GuildMember).voice.channelId) {
      await interaction.reply({
        content: 'You have to join voice chat first.',
        ephemeral: true
      });
      return;
    }

    const bot = Bot.getInstance();
    bot.discordClient.services.Teams.clearIgnore();
    await interaction.reply({ content: 'Ignore cleared.' });
  },
};

export default clearignore;
