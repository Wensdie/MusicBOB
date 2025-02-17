import { ClientExtended, Collection, Events, GatewayIntentBits } from 'discord.js';
import fs from 'fs';

export class Bot {
  public readonly discordClient: ClientExtended;
  private static instance: Bot;

  private constructor(
    private readonly discordToken: string,
    private readonly discordId: string,
  ) {
    this.discordClient = new ClientExtended({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });

    this.discordClient.commands = new Collection();
    this.discordClient.services = new Collection();

    this.discordClient.on(Events.InteractionCreate, (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const command = (interaction.client as ClientExtended).commands.get(interaction.commandName);

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
    await this.loadServices();
  }

  private async loadCommands(): Promise<void> {
    try {
      const folderPath = 'commands';
      const folderFiles = fs.readdirSync(folderPath);

      console.log('Loading bot commands.');

      for (const file of folderFiles) {
        const { default: command } = await import(`../commands/${file}`);
        this.discordClient.commands.set(command.data.name, command);
      }

      console.log('Commands loaded succefully.');
    } catch (er) {
      console.error(`Error loading commands: ${er}`);
    }
  }

  private async loadServices(): Promise<void> {
    try {
      const folderPath = 'services';
      const folderFiles = fs.readdirSync(folderPath);

      console.log('Loading bot services.');

      for (const file of folderFiles) {
        const { default: service } = await import(`../services/${file}`);
        this.discordClient.services.set(service.name, service);
      }

      console.log('Services loaded succefully.');
    } catch (er) {
      console.error(`Error loading services: ${er}`);
    }
  }
}
