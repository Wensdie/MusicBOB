import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ButtonInteraction,
  TextChannel,
} from "discord.js";
import { statsDB } from "../../database/database";
import type { SongStats, Command } from "../../types";
import { Bot } from "../../Bot";
import { EmbedTemplates } from "../../utilities/embedTemplates";

export let topSongs: Command = {
  data: new SlashCommandBuilder()
    .setName("top-songs")
    .setDescription("Get top 10 played songs with their links."),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    let allSongs = Array.from(statsDB.values()) as SongStats[];
    let top10 = Array.from(allSongs)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    let description = top10
      .map((song, index) => {
        return `**${index + 1}.** [${song.title}](${song.url}) - \`${song.count} razy\``;
      })
      .join("\n");

    let rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let i = 0; i < top10.length; i += 5) {
      let row = new ActionRowBuilder<ButtonBuilder>();
      let chunk = top10.slice(i, i + 5);

      chunk.forEach((_, indexInChunk) => {
        let absoluteIndex = i + indexInChunk;

        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`song_${absoluteIndex}`)
            .setLabel(`${absoluteIndex + 1}`)
            .setStyle(ButtonStyle.Danger),
        );
      });
      rows.push(row);
    }
    let embed = EmbedTemplates.info("Top 10 songs", description).setColor(
      0xff0000,
    );
    let response = await interaction.reply({
      embeds: [embed],
      components: rows,
    });
    let collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector.on("collect", async (btnInteraction: ButtonInteraction) => {
      let buttonMetadata = btnInteraction.customId.split("_")[1];
      if (!buttonMetadata) {
        console.log("[LOG] buttonMetaData is undefined");
        return;
      }
      let index = parseInt(buttonMetadata);
      let selectedSong = top10[index];
      if (!selectedSong) return;
      try {
        Bot.getInstance()
          .getMusicPlayer(interaction.channel as TextChannel)
          .addSong(selectedSong.url);

        await btnInteraction.reply({
          embeds: [
            EmbedTemplates.success(
              "Added to queue",
              `Selected: **${selectedSong.title}**`,
            ),
          ],
          ephemeral: true,
        });
      } catch (err) {
        console.error(err);
        await btnInteraction.reply({
          embeds: [
            EmbedTemplates.error("Error accrued while adding song to queue."),
          ],
          ephemeral: true,
        });
      }
    });
    collector.on("end", () => {
      const disabledRows = rows.map((row) => {
        row.components.forEach((btn) => btn.setDisabled(true));
        return row;
      });
      interaction.editReply({ components: disabledRows }).catch(() => {});
    });
  },
};
