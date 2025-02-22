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
      let queueEmpty = ""
      if (musicPlayer.getQueueLength() === 0) {
        console.log("Invoked bot/queue when queue empty");
        queueEmpty = "Queue is empty.";

      }

      const songNow = musicPlayer.getSongNow();
      const queuePlayingNow = `Playing: ${songNow.name} - ${songNow.length}`;
      let queueList = "";
      console.log("Successfully invoked bot/queue now playing: " + songNow.name + " length: " + songNow.length + " in queue: ");
      if (musicPlayer.getQueueLength() > 0) {
        queueList += '\n\n';
        const songs: Song[] = musicPlayer.getQueue();
        let i = 1;
        for (const song of songs) {
          queueList += `${i}) ${song.name} - ${song.length}\n`;
          i++;
        }
      }

      console.log(queuePlayingNow);
      console.log("\n" + (queueEmpty ?? queueList ));
      await interaction.reply({ content: queuePlayingNow + "\n"+ (queueEmpty ?? queueList) });
    }
  },
};

export default queue;
