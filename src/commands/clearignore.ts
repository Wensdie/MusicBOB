import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../Bot.js';
import Teams from '../services/teams.js';

const clearignore = {
  data: new SlashCommandBuilder().setName('clearignore').setDescription('Clear ingored users.'),

  async execute(interaciton: ChatInputCommandInteraction): Promise<void> {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();

    if (!bot.discordClient.services.Teams) {
      bot.discordClient.services.Teams = new Teams();
    }

    bot.discordClient.services.Teams.clearIgnore();
    await interaciton.reply({ content: 'Ignore cleared.' });
  },
};

export default clearignore;
