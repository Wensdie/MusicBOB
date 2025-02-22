import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, MessageFlags, } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Bot } from '../bot.js';
const skip = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Skipping song.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("Invoked bot/skip without connecting to channel")
      await interaction.reply({
        content: 'You have to join voice chat first.',
        flags: MessageFlags.Ephemeral,});
      return;
    }

    const bot = Bot.getInstance();

    if (bot.discordClient.services.MusicPlayer.connection === undefined) {
      console.log("Invoked bot/showignore without bot being connected to any channel")
      await interaction.reply({
        content: 'Bot is not connected to any channel.',
        flags: MessageFlags.Ephemeral,});
      return;
    }
    if (bot.discordClient.services.MusicPlayer.getConnection()!.joinConfig.channelId !== (interaction.member as GuildMember).voice.channelId) {
      console.log("Invoked bot/skip but bot and user are on different channels");
        await interaction.reply({
          content: 'You cannot skip song on the other channel.',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

    if (bot.discordClient.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Idle) {
      console.log("Invoked bot/skip but nothing is playing");
        await interaction.reply({
          content: 'Nothing is playing right now.',
          flags: MessageFlags.Ephemeral, });
        return;
      }

      try{
        if (bot.discordClient.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Playing) {
          console.log("Successfully processed bot/skip skipped song: " + bot.discordClient.services.MusicPlayer.getSongNow());
        bot.discordClient.services.MusicPlayer.skipSong();
        await interaction.reply({
          content: 'Song skipped.' });
        }
        }catch(er){
          console.log("Error skipping song")
      }
  },
};

export default skip;
