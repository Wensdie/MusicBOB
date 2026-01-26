import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import {
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Bot } from "../../Bot";
import type { Command } from "../../types";
import { EmbedTemplates } from "../../utilities/embedTemplates";

export const play: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Provided with youtube link starts playing music on voice channel.",
    )
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Plays video from youtube.")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("(`[LOG] Invoked bot/play without connecting to channel");
      await interaction.reply({
        embeds: [EmbedTemplates.error("You have to join voice chat first.")],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const bot = Bot.getInstance();
    const musicPlayerService = bot.getMusicPlayer(
      interaction.channel as TextChannel,
    );

    const url = interaction.options.getString("url");
    const urlPattern = /^(https:\/\/www\.youtube\.com\/watch).*/;

    //URL Check
    if (!url?.match(urlPattern)) {
      console.log(`[LOG] Invoked bot/play, with wrong URL pattern: ${url}`);
      await interaction.reply({
        embeds: [EmbedTemplates.error("Invalid URL.")],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const connection = musicPlayerService.getConnection();

    //Connection does not exist
    if (!connection) {
      if (!(interaction.member && interaction.guild)) {
        throw Error(
          `Invoked bot/play with wrong interaction credits: ${JSON.stringify(interaction.member)} ${interaction.guild}`,
        );
      }

      const guildMember = interaction.member as GuildMember;
      const channelID = guildMember.voice.channelId;
      const guildID = guildMember.guild.id;

      if (!(channelID && guildID)) {
        throw Error(
          `Invoked bot/play with wrong guild and/or channel IDs: ${guildMember.voice.channel?.name} - ${guildMember.guild.name}.`,
        );
      }

      console.log(
        `[LOG] Connecting to  ${guildMember.voice.channel?.name} - ${guildMember.guild.name}.`,
      );
      musicPlayerService.setConnection(
        joinVoiceChannel({
          channelId: channelID,
          guildId: guildID,
          adapterCreator: interaction.guild
            .voiceAdapterCreator as DiscordGatewayAdapterCreator,
        }),
      );

      const song = await musicPlayerService.addSong(url);
      console.log(`[LOG] Invoked bot/play -  ${song.name} - ${song.length}.`);
      await interaction.editReply({
        embeds: [
          EmbedTemplates.success(
            `Added to queue: ${song.name}`,
            `${song.length}`,
          ),
        ],
      });

      return;
    }

    //connection exists
    if (
      connection?.joinConfig.channelId !==
      (interaction.member as GuildMember).voice.channelId
    ) {
      console.log("[LOG] Invoked bot/play but user is on another channel");
      await interaction.editReply({
        embeds: [
          EmbedTemplates.error("Bot is already connected on other channel."),
        ],
      });

      return;
    }

    const song = await musicPlayerService.addSong(url);
    console.log("[LOG] Invoked bot/play.");
    await interaction.editReply({
      embeds: [
        EmbedTemplates.success(
          `Added to queue: ${song.name}`,
          `${song.length}`,
        ),
      ],
    });
  },
};
