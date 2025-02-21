import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../bot.js';

const unignore = {
  data: new SlashCommandBuilder()
    .setName('unignore')
    .setDescription('Remove user from ignore[].')
    .addStringOption((option) =>
      option.setName('user').setDescription('User to unignore.').setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!(interaction.member as GuildMember).voice.channelId) {
      await interaction.reply({
        content: 'You have to join voice chat first.',
        ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();
    const user = interaction.options.getString('user');
    const ifDeleted = bot.discordClient.services.Teams.deleteIgnore(user ?? '');
    if (ifDeleted) {
      await interaction.reply({
        content: `Unignoring: ${user}`
      });
    } else {
      await interaction.reply({
        content: 'User not found.',
        ephemeral: true });
    }
  },
};
export default unignore;
