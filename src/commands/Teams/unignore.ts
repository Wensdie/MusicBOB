import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { Bot } from "../../Bot";
import type { Command } from "../../types";
import { EmbedTemplates } from "../../utilities/embedTemplates";

export const unignore: Command = {
  data: new SlashCommandBuilder()
    .setName("unignore")
    .setDescription("Remove user from ignore.")
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("User to unignore.")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("[LOG] Invoked bot/unignore without connecting to channel.");
      await interaction.reply({
        embeds: [EmbedTemplates.error("You have to join voice chat first.")],
        ephemeral: true,
      });
      return;
    }

    const bot = Bot.getInstance();
    const teamsService = bot.getTeams();

    const user = interaction.options.getString("user");
    const ifDeleted = teamsService.deleteIgnore(user ?? "");
    if (ifDeleted) {
      console.log(`[LOG] Successfully bot/unignore stopped ignoring: ${user}.`);
      await interaction.reply({
        embeds: [EmbedTemplates.info(`Unignoring: ${user}`, "   ")],
      });
    } else {
      console.log(
        `[LOG] Invoked bot/unignore, but did not find the mentioned user: ${user}.`,
      );
      await interaction.reply({
        embeds: [EmbedTemplates.error("User not found.")],
        ephemeral: true,
      });
    }
  },
};
