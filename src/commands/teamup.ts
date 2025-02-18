import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  VoiceBasedChannel,
} from 'discord.js';
import { Bot } from '../Bot.js';
import shuffleArray from '../functions/shuffleArray.js';
import MemberTeam from '../types/memberTeam.js';

const teamup = {
  data: new SlashCommandBuilder()
    .setName('teamup')
    .setDescription('Divide people on voice chat into 2 teams or more.')
    .addStringOption((option) =>
      option.setName('amount').setDescription('Divide into "amount" teams.').setRequired(false),
    ),
  async execute(interaciton: ChatInputCommandInteraction): Promise<void> {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();

    const members = (
      (interaciton.member as GuildMember).voice.channel as VoiceBasedChannel
    ).members.filter(
      (user) =>
        !bot.discordClient.services.Teams.getIgnore().includes(user.displayName) &&
        !bot.discordClient.services.Teams.getIgnore().includes(user.nickname ?? '') &&
        !(user.displayName === 'MusicBOB'),
    );

    if (members.size === 1) {
      await interaciton.reply({ content: 'For ever alone. :(', ephemeral: true });
      return;
    }

    let amount = 0;

    if (interaciton.options.getString('amount')) {
      if (
        Number(interaciton.options.getString('amount')) > 2 &&
        Number(interaciton.options.getString('amount')) < members.size
      ) {
        amount = Number(interaciton.options.getString('amount'));
      } else {
        await interaciton.reply({ content: 'Invalid team amount.', ephemeral: true });
        return;
      }
    } else {
      amount = 2;
    }

    const numbers: number[] = [];
    let j = 1;
    for (let i = 0; i < members.size; i++) {
      numbers.push(j);
      if (j === amount) {
        j = 1;
      } else {
        j++;
      }
    }
    shuffleArray(numbers);

    const membersTeams: MemberTeam[] = [];

    let i = 0;
    for (const member of members) {
      membersTeams.push({
        name: member[1].displayName,
        team: numbers[i] ?? 0,
      });
      i++;
    }

    let message = '';

    for (let k = 1; k <= amount; k++) {
      message += `Team ${k}:\n`;
      for (const member of membersTeams) {
        if (member.team === k) {
          message += `⦿ ${member.name}\n`;
        }
      }
      message += '\n\n';
    }

    await interaciton.reply({ content: message });
  },
};

export default teamup;
