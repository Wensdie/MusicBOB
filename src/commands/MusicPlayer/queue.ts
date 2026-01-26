import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { Bot } from "../../Bot";
import type { Command } from "../../types";
import { EmbedTemplates } from "../../utilities/embedTemplates";

export const queue: Command = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Showing queue."),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const bot = Bot.getInstance();
    const musicPlayerService = bot.getMusicPlayer(
      interaction.channel as TextChannel,
    );

    const musicPlayerQueue = musicPlayerService.getQueue();

    if (musicPlayerQueue) {
      let queueEmpty = "";
      if (musicPlayerQueue.length === 0) {
        console.log("[LOG] Invoked bot/queue when queue empty.");
        queueEmpty = "Queue is empty.";
      }

      const songNow = musicPlayerService.getSongNow();
      const queuePlayingNow = songNow
        ? `Playing: ${songNow.name} - ${songNow.length}`
        : "";
      let queueList = "";
      console.log(
        "[LOG] Invoked bot/queue when music is played and/or queue is not empty.",
      );
      if (musicPlayerQueue.length > 0) {
        queueList += "\nQueue:\n";

        let i = 1;
        for (const song of musicPlayerQueue) {
          queueList += `${i}) ${song.name} - ${song.length}\n`;
          i++;
        }
      }

      await interaction.reply({
        embeds: [
          EmbedTemplates.info(
            `${queuePlayingNow}\n${queueEmpty !== "" ? queueEmpty : queueList}`,
            "    ",
          ),
        ],
      });
    }
  },
};
