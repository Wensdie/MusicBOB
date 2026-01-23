import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { Bot } from "../../Bot";
import type { Command } from "../../types";

export const clearignore: Command = {
  data: new SlashCommandBuilder()
    .setName("clearignore")
    .setDescription("Clear ignored users."),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    //Member does not belong to any Vchannel;
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log(
        "[LOG] Invoked bot/clearignore without connecting to channel.",
      );
      await interaction.reply({
        content: "You have to join voice chat first.",
        ephemeral: true,
      });
      return;
    }

    const bot = Bot.getInstance();
    const teamsService = bot.getTeams();

    teamsService.clearIgnore();
    await interaction.reply({ content: "Ignore cleared." });
    console.log("[LOG] Successfully bot/clearignore.");
  },
};
