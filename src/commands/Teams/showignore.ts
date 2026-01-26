import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { Bot } from "../../Bot";
import type { Command } from "../../types";
import { EmbedTemplates } from "../../utilities/embedTemplates";

export const showignore: Command = {
  data: new SlashCommandBuilder()
    .setName("showignore")
    .setDescription("Show ignored users."),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log(
        "[LOG] Invoked bot/showignore without connecting to channel.",
      );
      await interaction.reply({
        embeds: [EmbedTemplates.error("You have to join voice chat first.")],
        ephemeral: true,
      });
      return;
    }

    const bot = Bot.getInstance();
    const teamsService = bot.getTeams();

    if (teamsService.getIgnore().length > 0) {
      let ignoringTab = "Ignoring:\n\n";

      for (const ign of teamsService.getIgnore()) {
        ignoringTab += `❌ ${ign}\n`;
      }
      console.log("[LOG] Successfully invoked bot/showignore.");
      await interaction.reply({
        content: ignoringTab,
      });
    } else {
      console.log(
        "[LOG] Successfully invoked bot/showignore: none is being ignored.",
      );
      await interaction.reply({
        embeds: [
          EmbedTemplates.success("No one is ignored right now.", "          "),
        ],
      });
    }
  },
};
