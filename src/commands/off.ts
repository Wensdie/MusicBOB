import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Bot } from '../Bot.js';

const off = {
  data: new SlashCommandBuilder().setName('off').setDescription('Turn off MusicPlayer.'),

  async execute(interaciton: ChatInputCommandInteraction): Promise<void> {
    if (!(interaciton.member as GuildMember).voice.channelId) {
      await interaciton.reply({ content: 'You have to join voice chat first.', ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();

    if (!bot.discordClient.services.MusicPlayer) {
      await interaciton.reply({ content: 'MusicPlayer is already off.', ephemeral: true });
      return;
    }

    if (bot.discordClient.services.MusicPlayer) {
      if (interaciton.channel) {
        await interaciton.reply('Disconnected. Bajo!');
      }
      bot.discordClient.services.MusicPlayer.connection.disconnect();
    }
  },
};

export default off;
