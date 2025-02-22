import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../bot.js';

const ignore = {
  data: new SlashCommandBuilder()
    .setName('ignore')
    .setDescription('Ignore user in team building.')
    .addStringOption((option) =>
      option.setName('user').setDescription('User to ignore.').setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("Invoked bot/ignore without connecting to channel")
      await interaction.reply({
        content: 'You have to join voice chat first.',
        ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();
    const user = interaction.options.getString('user');
    bot.discordClient.services.Teams.addIgnore(user ?? '');
    await interaction.reply({ content: `Ignoring: ${user}` });
    console.log(`Successfully bot/ignore ignoring: " ${user}`);
  },
};

export default ignore;
