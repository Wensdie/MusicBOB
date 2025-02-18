import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../Bot.js';
import Teams from '../services/teams.js';

const ignore = {
  data: new SlashCommandBuilder()
    .setName('ignore')
    .setDescription('Ignore user in team building.')
    .addStringOption((option) =>
      option.setName('user').setDescription('User to ignore.').setRequired(true),
    ),
  async execute(interaciton: ChatInputCommandInteraction): Promise<void> {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();

    if (!bot.discordClient.services.Teams) {
      bot.discordClient.services.Teams = new Teams();
    }

    const user = interaciton.options.getString('user');
    bot.discordClient.services.Teams.addIgnore(user ?? '');
    await interaciton.reply({ content: `Ignoring: ${user}` });
  },
};

export default ignore;
