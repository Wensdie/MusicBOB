import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, MessageFlags, } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Bot } from '../bot.js';
const skip = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skipping song.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    if (!(interaction.member as GuildMember).voice.channelId) {
      await interaction.reply({
        content: 'You have to join voice chat first.',
        flags: MessageFlags.Ephemeral,});
      return;
    }

    const bot = Bot.getInstance();

    if (bot.discordClient.services.MusicPlayer.connection === undefined) {
      await interaction.reply({
        content: 'MusicPlayer is not active.',
        flags: MessageFlags.Ephemeral,});
      return;
    }

    if (bot.discordClient.services.MusicPlayer) {
      if ( bot.discordClient.services.MusicPlayer.getConnection()!.joinConfig.channelId !== (interaction.member as GuildMember).voice.channelId) {
        await interaction.reply({
          content: 'You cannot skip song on the other channel.',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (bot.discordClient.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Idle) {
        await interaction.reply({
          content: 'Nothing is playing right now.',
          flags: MessageFlags.Ephemeral, });
        return;
      }

      try{
      if (bot.discordClient.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Playing){
        bot.discordClient.services.MusicPlayer.skipSong();
        await interaction.reply({
          content: 'Song skipped.' });
        }
        }catch(er){
          console.log("Error skipping song")
      }
    }
  },
};

export default skip;
