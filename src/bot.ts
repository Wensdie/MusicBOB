import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import { commandSchema } from './schemas/commandSchema.js';
import MusicPlayer from './services/musicPlayer.js';
import Teams from './services/teams.js';
import { Command } from './types/command.js';
import Spotify from 'spotifydl-core';
export class Bot {
  public readonly discordClient: Client;
  private static instance: Bot;

  private constructor(
    private readonly discordToken: string,
    private readonly discordId: string,
  ) {
    this.discordClient = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });

    this.discordClient.commands = new Collection<string, Command>();

    this.discordClient.on(Events.InteractionCreate, (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error('Command was not found.');
        return;
      }

      try {
        command.execute(interaction);
      } catch (er) {
        console.log(er);
      }
    });
  }

  public static getInstance(discordToken?: string, discordId?: string): Bot {
    if (!Bot.instance && discordToken && discordId) {
      Bot.instance = new Bot(discordToken, discordId);
    }
    return Bot.instance;
  }

  public async authorize(): Promise<void> {
    console.log('Authorizing to Discord API.');
    await this.discordClient.login(this.discordToken);
  }

  public async loadUtilities(): Promise<void> {
    console.log('Loading Bot utilities.');
    await this.loadCommands();
    this.loadServices();
  }

  private async loadCommands(): Promise<void> {
    try {
      const folderPath = 'lib/commands';
      const folderFiles = fs.readdirSync(folderPath).filter((file) => {
        return file.includes('.js');
      });

      console.log('Loading bot commands.');

      for (const file of folderFiles) {
        const { default: command } = await import(`./commands/${file}`);
        const parsedCommand = commandSchema.parse(command);
        this.discordClient.commands.set(parsedCommand.data.name, parsedCommand);
      }

      console.log('Commands loaded succefully.');
    } catch (er) {
      console.error(`Error loading commands: ${er}`);
    }
  }

  private loadServices(): void {
    console.log('Loading bot services.');

    this.discordClient.services = {
      Teams: new Teams(),
      MusicPlayer: new MusicPlayer(),
    };
    console.log('Services loaded succefully.');
  }
}
