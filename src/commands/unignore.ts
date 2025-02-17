import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../Bot.js';

const unignore = {
  data: new SlashCommandBuilder()
    .setName('unignore')
    .setDescription('Remove user from ignore[].')
    .addStringOption((option) =>
      option.setName('user').setDescription('User to unignore.').setRequired(true),
    ),
  async execute(interaciton: ChatInputCommandInteraction): Promise<void> {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();

    const user = interaciton.options.getString('user');
    const ifDeleted = bot.discordClient.services.teams.deleteIgnore(user);
    if (ifDeleted) {
      await interaciton.reply({ content: `Unignoring: ${user}` });
    } else {
      await interaciton.reply({ content: 'User not found.', ephemeral: true });
    }
  },
};

export default unignore;
