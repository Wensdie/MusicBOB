import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { Bot } from '../bot.js';

const clear = {
  data: new SlashCommandBuilder().setName('clear').setDescription('Clear queue and current song.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {

//wrong interaction channel
    if (!(interaction.member as GuildMember).voice.channelId) {
      await interaction.reply({
        content: 'You have to join voice chat first.',
        ephemeral: true });
      return;
    }

    const bot = Bot.getInstance();
//MusicPLayer instance is undefined
    if (!bot.discordClient.services.MusicPlayer) {
      await interaction.reply({
        content: 'MusicPlayer is not active.',
        ephemeral: true });
      return;
    }
//MusicPlayer exists
    if (bot.discordClient.services.MusicPlayer) {

      //User on wrong channel
      if (bot.discordClient.services.MusicPlayer.getConnection()!.joinConfig.channelId !== (interaction.member as GuildMember).voice.channelId) {
        await interaction.reply({
          content: 'You cannot clear queue on the other channel.',
          ephemeral: true,
        });
        return;
      }
      //Queue empty
      if (bot.discordClient.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Idle && bot.discordClient.services.MusicPlayer.getQueueLength() === 0) {
        await interaction.reply({
          content: 'Queue is already empty.',
          ephemeral: true });
        return;
      }
      //Cleanse Queue
      if (bot.discordClient.services.MusicPlayer.getPlayer().state.status === AudioPlayerStatus.Playing){
        bot.discordClient.services.MusicPlayer.clearQueue();
        bot.discordClient.services.MusicPlayer.skipSong();
        await interaction.reply({ content: 'Queue cleared.' });
      }
    }
  },
};

export default clear;
