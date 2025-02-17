import {
  AnonymousGuild,
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  VoiceBasedChannel,
} from 'discord.js';
import bot from '../bot.js';
import MemberTeam from '../interfaces/memberTeam.js';
import Teams from '../services/teams.js';

const clearignore = {
  data: new SlashCommandBuilder().setName('clearignore').setDescription('Clear ingored users.'),

  async execute(interaciton: ChatInputCommandInteraction) {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    if (!bot.services.teams) {
      bot.services.teams = new Teams();
    }

    bot.services.teams.clearIgnore();
    await interaciton.reply({ content: 'Ignore cleared.' });
  },
};

export default clearignore;
