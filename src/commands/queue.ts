import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Bot } from '../bot.js';
import Song from '../types/song.js';

const queue = {
  data: new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Showing queue.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const bot = Bot.getInstance();
//Queue exists
    if (bot.discordClient.services.MusicPlayer.getQueue()) {
      const musicPlayer = bot.discordClient.services.MusicPlayer;

      if (musicPlayer.getQueueLength() === 0 && musicPlayer.getPlayer().state.status === AudioPlayerStatus.Idle) {
        console.log("Invoked bot/queue when queue empty");
        await interaction.reply({ content: 'Queue is empty.', ephemeral: true });
        return;
      }

      const songNow = musicPlayer.getSongNow();
      let queueString = `Playing: ${songNow.name} - ${songNow.length}`;
      console.log("Successfully invoked bot/queue now playing: " + songNow.name + " length: " + songNow.length + " in queue: ");
      if (musicPlayer.getQueueLength() > 0) {
        queueString += '\n\n';
        const songs: Song[] = musicPlayer.getQueue();
        let i = 1;
        for (const song of songs) {
          queueString += `${i}) ${song.name} - ${song.length}\n`;
          i++;
        }
      }
      console.log(queueString);
      await interaction.reply({ content: queueString });
    }
  },
};

export default queue;
