import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { Bot } from "../../Bot";
import type { Command } from "../../types";
import { EmbedTemplates } from "../../utilities/embedTemplates";

export const ignore: Command = {
  data: new SlashCommandBuilder()
    .setName("ignore")
    .setDescription("Ignore user in team building.")
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("User to ignore.")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("[LOG] Invoked bot/ignore without connecting to channel.");
      await interaction.reply({
        embeds: [EmbedTemplates.error("You have to join voice chat first.")],
        ephemeral: true,
      });
      return;
    }

    const bot = Bot.getInstance();
    const teamsService = bot.getTeams();

    const user = interaction.options.getString("user");
    teamsService.addIgnore(user ?? "");
    await interaction.reply({
      embeds: [EmbedTemplates.success(`Ignoring: ${user}`, "    ")],
    });
    console.log(`[LOG] Successfully bot/ignore ignoring: " ${user}.`);
  },
};
