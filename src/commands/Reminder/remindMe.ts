import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import * as chrono from "chrono-node";
import { Bot } from "../../Bot";
import { remindersDB } from "../../database/database";
import type { Command } from "../../types";
import { EmbedTemplates } from "../../utilities/embedTemplates";
export const remindMe: Command = {
  data: new SlashCommandBuilder()
    .setName("remind-me")
    .setDescription("Set a DM reminder using natural language.")
    .addStringOption((option) =>
      option
        .setName("when")
        .setDescription(
          "When? (e.g., 'in 10 minutes', 'tomorrow 5pm', 'friday')",
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("What to remind you about?")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const whenString = interaction.options.getString("when", true);
    const messageContent = interaction.options.getString("message", true);
    const parsedDate = chrono.parseDate(whenString);
    if (!parsedDate) {
      await interaction.reply({
        embeds: [
          EmbedTemplates.error(
            `I couldn't understand when is "**${whenString}**".`,
          ),
        ],
        ephemeral: true,
      });
      return;
    }
    if (parsedDate.getTime() <= Date.now()) {
      await interaction.reply({
        embeds: [
          EmbedTemplates.error(
            "You cannot set a reminder in the past. Time travel is not supported yet.",
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    const reminderId = `${interaction.user.id}-${Date.now()}`;
    remindersDB.set(reminderId, {
      userId: interaction.user.id,
      remindAt: parsedDate.getTime(),
      message: messageContent,
      createdAt: Date.now(),
    });
    console.log(
      `[LOG] Saved reminder for ${interaction.user.tag} at ${parsedDate}`,
    );
    const discordTimestamp = Math.floor(parsedDate.getTime() / 1000);
    await interaction.reply({
      embeds: [
        EmbedTemplates.info(
          ` Got it! I will DM you <t:${discordTimestamp}:R> (<t:${discordTimestamp}:F>).`,
          `**Reminder:** "${messageContent}"`,
        ),
      ],
      ephemeral: true,
    });
  },
};
