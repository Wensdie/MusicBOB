import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Bot } from '../Bot.js';
import Song from '../types/song.js';

const queue = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Showing queque.'),

  async execute(interaciton: ChatInputCommandInteraction): Promise<void> {
    const bot = Bot.getInstance();

    if (!bot.discordClient.services.MusicPlayer) {
      await interaciton.reply({ content: 'MusicPlayer is not active.', ephemeral: true });
      return;
    }

    if (bot.discordClient.services.MusicPlayer.getQueue()) {
      const mP = bot.discordClient.services.MusicPlayer;

      if (mP.getQueueLength() === 0 && mP.getPlayer().state.status === AudioPlayerStatus.Idle) {
        await interaciton.reply({ content: 'Queue is empty.', ephemeral: true });
        return;
      }

      const songNow = mP.getSongNow();

      let queueString = `Playing: ${songNow.name} - ${songNow.lenght}`;

      if (mP.getQueueLength() > 0) {
        queueString += '\n\n';
        const songs: Song[] = mP.getQueue();
        let i = 1;
        for (const song of songs) {
          queueString += `${i}) ${song.name} - ${song.lenght}\n`;
          i++;
        }
      }

      await interaciton.reply({ content: queueString });
    }
  },
};

export default queue;
