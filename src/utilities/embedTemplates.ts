import { EmbedBuilder, User, ColorResolvable } from "discord.js";
export const BotColors = {
  Success: 0x2ecc71,
  Error: 0xe74c3c,
  Info: 0x3498db,
  Music: 0x9b59b6,
};
export const EmbedTemplates = {
  success: (title: string, description?: string) => {
    let embed = new EmbedBuilder()
      .setColor(BotColors.Success)
      .setTitle(`${title}`);
    if (description) {
      embed.setDescription(description);
    }
    return embed;
  },
  error: (errorMessage: string) => {
    return new EmbedBuilder()
      .setColor(BotColors.Error)
      .setTitle("Error has accrued")
      .setDescription(errorMessage)
      .setTimestamp();
  },
  info: (title: string, description: string) => {
    return new EmbedBuilder()
      .setColor(BotColors.Info)
      .setTitle(`${title}`)
      .setDescription(description);
  },
  music: (
    title: string,
    url: string,
    thumbnailUrl: string | null,
    requester?: User,
  ) => {
    const embed = new EmbedBuilder()
      .setColor(BotColors.Music)
      .setTitle(title)
      .setURL(url)
      .setTimestamp();

    if (thumbnailUrl) {
      embed.setThumbnail(thumbnailUrl);
    }

    if (requester) {
      embed.setFooter({
        text: `Played by: ${requester.username}`,
        iconURL: requester.displayAvatarURL(),
      });
    }

    return embed;
  },
};
