import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../bot.js';
import Teams from '../services/teams.js';

const showignore = {
  data: new SlashCommandBuilder().setName('showignore').setDescription('Show ignored users.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    if (!(interaction.member as GuildMember).voice.channelId) {
      await interaction.reply({
        content: 'You have to join voice chat first.',
        ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();

    if (!bot.discordClient.services.Teams) {
      bot.discordClient.services.Teams = new Teams();
    }

    if (bot.discordClient.services.Teams.getIgnore().length > 0) {
      let ignoringTab = 'Ignoring:\n\n';

      for (const ign of bot.discordClient.services.Teams.getIgnore()) {
        ignoringTab += `❌ ${ign}\n`;
      }

      await interaction.reply({
        content: ignoringTab
      });
    } else {
      await interaction.reply({
        content: 'No one is ignored right now.'
      });
    }
  },
};

export default showignore;
