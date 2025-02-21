import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, MessageFlags, TextBasedChannel, TextChannel, } from 'discord.js';
import { AudioPlayerStatus, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
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
    musicPlayer.channel = bot.discordClient.channels.cache.get(interaction.channelId)! as TextChannel;

//URL Check
    if (!url?.match(urlPattern)) {
        await interaction.reply({ content: 'Invalid URL.', ephemeral: true });
        return;
    }
//connect to Vchannel and play
await interaction.deferReply();
await musicPlayer.addSong(url);
clearTimeout(musicPlayer.timer);
//Connection does not exist
    if(!musicPlayer.getConnection()){
      if(!(interaction.member && interaction.guild)){
        throw Error("Invalid interaction properties");
      }

      const guildMember = interaction.member as GuildMember;
      const channelID = guildMember.voice.channelId;
      const guildID = guildMember.guild.id;
      if(!(channelID && guildID)){
        throw Error("Invalid channel Id or guild id ");
      }

      musicPlayer.connection = joinVoiceChannel({
        channelId: channelID,
        guildId: guildID,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      musicPlayer.setSubscription();
      musicPlayer.audioPlayer.on(AudioPlayerStatus.Idle, async ()=>{
      if(!interaction.channel){
        throw Error("Invalid interaction channel");
      }
      if(musicPlayer.getQueueLength()>0){
        const song = musicPlayer.getNextSongData();
        musicPlayer.playSong(interaction);
        const songNow = musicPlayer.getSongNow();
        (musicPlayer.channel as TextChannel).send(`Playing: ${songNow.name} - ${songNow.length}`);
        return;
      }
      });
      await musicPlayer.playSong(interaction);
      const songNow = musicPlayer.getSongNow();
      await interaction.editReply({
        content: `Playing: ${songNow.name} - ${songNow.length}`,
      });
      return;
    }

//connection exists
{
    if(musicPlayer.getConnection()!.joinConfig.channelId !== (interaction.member as GuildMember).voice.channelId){
        await interaction.reply({
        content: 'Bot is already connected on other channel.',
        ephemeral: true,
      });
      return;
    }

    if(musicPlayer.audioPlayer.state.status === AudioPlayerStatus.Playing){
      const songLast = musicPlayer.getLastSong();
      await interaction.editReply({
        content: `Added to queue: ${songLast.name} - ${songLast.length}`,
      });
      return;
    }

    if(musicPlayer.audioPlayer.state.status === AudioPlayerStatus.Idle){
      const song = musicPlayer.getNextSongData();
      musicPlayer.playSong(interaction);
      const songNow = musicPlayer.getSongNow();
      await interaction.editReply({
        content: `Playing: ${songNow.name} - ${songNow.length}`,
      });
      return;
    }
  }
}
}
export default play;
