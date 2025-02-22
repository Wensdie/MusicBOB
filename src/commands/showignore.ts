import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../bot.js';

const showignore = {
  data: new SlashCommandBuilder().setName('showignore').setDescription('Show ignored users.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("Invoked bot/showignore without connecting to channel")
      await interaction.reply({
        content: 'You have to join voice chat first.',
        ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();
    if (bot.discordClient.services.Teams.getIgnore().length > 0) {
      let ignoringTab = 'Ignoring:\n\n';

      for (const ign of bot.discordClient.services.Teams.getIgnore()) {
        ignoringTab += `❌ ${ign}\n`;
      }
      console.log("Successfully invoked bot/showignore ignoring: " + ignoringTab);
      await interaction.reply({
        content: ignoringTab
      });
    } else {
      console.log("Successfully invoked bot/showignore: none is being ignored");
      await interaction.reply({
        content: 'No one is ignored right now.'
      });
    }
  },
};

export default showignore;
