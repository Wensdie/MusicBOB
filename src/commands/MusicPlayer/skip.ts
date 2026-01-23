import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Bot } from "../../Bot";
import type { Command } from "../../types";

export const skip: Command = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skipping song."),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("[LOG] Invoked bot/skip without connecting to channel");
      await interaction.reply({
        content: "You have to join voice chat first.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const bot = Bot.getInstance();
    const musicPlayerService = bot.getMusicPlayer(
      interaction.channel as TextChannel,
    );

    const connection = musicPlayerService.getConnection();

    if (!connection) {
      console.log(
        "[LOG] Invoked bot/showignore without bot being connected to any channel",
      );
      await interaction.reply({
        content: "Bot is not connected to any channel.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (
      connection.joinConfig.channelId !==
      (interaction.member as GuildMember).voice.channelId
    ) {
      console.log(
        "[LOG] Invoked bot/skip but bot and user are on different channels",
      );
      await interaction.reply({
        content: "You cannot skip song on the other channel.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const getCurrentStatus = musicPlayerService.getCurrentStatus();

    if (getCurrentStatus === AudioPlayerStatus.Idle) {
      console.log("[LOG] Invoked bot/skip but nothing is playing");
      await interaction.reply({
        content: "Nothing is playing right now.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (getCurrentStatus === AudioPlayerStatus.Playing) {
      console.log("[LOG] Successfully processed bot/skip skipped song.");
      musicPlayerService.skip();
      await interaction.reply({
        content: "Song skipped.",
      });
    }
  },
};
