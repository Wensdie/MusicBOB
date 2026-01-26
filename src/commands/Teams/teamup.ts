import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
  TeamMember,
  VoiceBasedChannel,
} from "discord.js";
import { Bot } from "../../Bot";
import { Helpers } from "../../utilities/";
import type { Command, MemberTeam } from "../../types";
import { EmbedTemplates } from "../../utilities/embedTemplates";

export const teamup: Command = {
  data: new SlashCommandBuilder()
    .setName("team-up")
    .setDescription("Divide people on voice chat into 2 teams or more.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription('Divide into "amount" teams.')
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    let member = interaction.member as GuildMember;
    if (!member.voice.channelId || !member.voice.channel) {
      console.log("[LOG] Invoked bot/team-up without connecting to channel.");
      await interaction.reply({
        embeds: [EmbedTemplates.error("You have to join voice chat first.")],
        ephemeral: true,
      });
      return;
    }

    const bot = Bot.getInstance();
    const teamsService = bot.getTeams();
    const voiceChannel = member.voice.channel as VoiceBasedChannel;

    const validMembers = voiceChannel.members
      .filter((user) => {
        let isIgnoredName = teamsService.getIgnore().includes(user.displayName);
        let isMusicBot = user.displayName === "MusicBOB";
        return !isIgnoredName && !isMusicBot;
      })
      .map((user) => user.displayName);

    if (validMembers.length < 2) {
      console.log("[LOG] Invoked bot/teamup when alone on voice channel.");
      await interaction.reply({
        embeds: [EmbedTemplates.info("Forever alone. :(", "       ")],
        ephemeral: true,
      });
      return;
    }

    let amount = interaction.options.getInteger("amount") ?? 2;

    if (amount > validMembers.length) {
      console.log(
        `[LOG] Invalid team amount: ${amount} for ${validMembers.length} people.`,
      );
      await interaction.reply({
        embeds: [
          EmbedTemplates.error(
            `You cannot split ${validMembers.length} people into ${amount} teams!`,
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    Helpers.shuffleArray(validMembers);

    const teams: string[][] = Array.from({ length: amount }, () => []);
    validMembers.forEach((memberName, index) => {
      const teamIndex = index % amount;
      teams[teamIndex]?.push(memberName);
    });
    let message = "";
    teams.forEach((teamMembers, index) => {
      const teamNumber = index + 1;
      message += `**Team ${teamNumber}:**\n`;
      message += teamMembers.map((name) => `⦿ ${name}`).join("\n");
      message += "\n\n";
    });

    console.log("[LOG] Successfully invoked bot/team-up.");
    await interaction.reply({
      embeds: [EmbedTemplates.success(message, "        ")],
    });
  },
};
