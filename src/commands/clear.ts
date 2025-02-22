import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Bot } from '../bot.js';

const clear = {
  data: new SlashCommandBuilder().setName('clear').setDescription('Clear queue and current song.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {

//wrong interaction channel
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("Invoked bot/clear without connecting to channel")
      await interaction.reply({
        content: 'You have to join voice chat first.',
        ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();
//MusicPlayer exists
      //User on wrong channel
    if (bot.discordClient.services.MusicPlayer.getConnection()!.joinConfig.channelId !== (interaction.member as GuildMember).voice.channelId) {
        console.log("User invoked bot/clear when on different channel")
        await interaction.reply({
          content: 'You cannot clear queue on the other channel.',
          ephemeral: true,
        });
        return;
      }
      //Queue empty
    if (bot.discordClient.services.MusicPlayer.getQueueLength() === 0) {
      console.log("Invoked bot/clear when queue empty");
        await interaction.reply({
          content: 'Queue is already empty.',
          ephemeral: true });
        return;
      }
      //Cleanse Queue
    if (bot.discordClient.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Playing) {
      console.log("Command successful queue cleared");
        bot.discordClient.services.MusicPlayer.clearQueue();
        bot.discordClient.services.MusicPlayer.skipSong();
        await interaction.reply({ content: 'Queue cleared.' });
      }
  },
};

export default clear;
