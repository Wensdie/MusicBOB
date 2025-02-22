import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, MessageFlags, TextBasedChannel, TextChannel, } from 'discord.js';
import { AudioPlayerStatus, joinVoiceChannel } from '@discordjs/voice';
import { Bot } from '../bot.js';
const play = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Provided with youtube link starts playing music on voice channel.')
    .addStringOption((option) =>
      option.setName('url').setDescription('Plays video from youtube.').setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!(interaction.member as GuildMember).voice.channelId) {
      console.log("Invoked bot/play without connecting to channel")
      await interaction.reply({ content: 'You have to join voice chat first.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const bot = Bot.getInstance();
    const url = interaction.options.getString('url');
    const urlPattern = /^(https:\/\/www\.youtube\.com\/watch).*/;
    const musicPlayer = bot.discordClient.services.MusicPlayer;
    const timer = musicPlayer.timer
    musicPlayer.channel = bot.discordClient.channels.cache.get(interaction.channelId) as TextChannel;

//URL Check
    if (!url?.match(urlPattern)) {
      console.log("Invoked bot/play, with wrong URL pattern: " + url);
        await interaction.reply({ content: 'Invalid URL.', ephemeral: true });
        return;
    }
//connect to Vchannel and play
await interaction.deferReply();
await musicPlayer.addSong(url);
    clearTimeout(musicPlayer.timer);
    console.log("Timeout dismantled provided new play");
//Connection does not exist
    if(!musicPlayer.getConnection()){
      if (!(interaction.member && interaction.guild)) {
        console.log("Invoked bot/play with wrong interaction credits: " + interaction.member +" "+ interaction.guild)
        throw Error("Invalid interaction properties");
      }

      const guildMember = interaction.member as GuildMember;
      const channelID = guildMember.voice.channelId;
      const guildID = guildMember.guild.id;
      if (!(channelID && guildID)) {
        console.log("Invoked bot/play with wrong guild and/or channel IDs: " + guildID + " " + channelID);
        throw Error("Invalid channel Id or guild id ");
      }

      musicPlayer.connection = joinVoiceChannel({
        channelId: channelID,
        guildId: guildID,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      musicPlayer.setSubscription();
      await musicPlayer.playSong(interaction.channel as TextChannel);
      const songNow = musicPlayer.getSongNow();
      console.log("Successfully invoked bot/play with URL provided: " + url);
      await interaction.editReply({
        content: `Playing: ${songNow.name} - ${songNow.length}`,
      });
      return;
    }

//connection exists
{
      if (musicPlayer.getConnection()!.joinConfig.channelId !== (interaction.member as GuildMember).voice.channelId) {
        console.log("Invoked bot/play but user is on another channel");
        await interaction.reply({
        content: 'Bot is already connected on other channel.',
        ephemeral: true,
      });
      return;
    }

    if(musicPlayer.audioPlayer.state.status === AudioPlayerStatus.Playing){
      const songLast = musicPlayer.getLastSong();
      console.log("Successfully invoked bot/play, song from: "+url+" added to queue as : "+ musicPlayer.getQueueLength()+ " in a row" )
      await interaction.editReply({
        content: `Added to queue: ${songLast.name} - ${songLast.length}`,
      });
      return;
    }

    if(musicPlayer.audioPlayer.state.status === AudioPlayerStatus.Idle){
      const song = musicPlayer.getNextSongData();
      musicPlayer.playSong(interaction.channel as TextChannel);
      const songNow = musicPlayer.getSongNow();
      console.log("Successfully invoked bot/play, song from: " + url + " From Idle state")
      await interaction.editReply({
        content: `Playing: ${songNow.name} - ${songNow.length}`,
      });
      return;
    }
  }
}
}
export default play;
