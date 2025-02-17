import { Client } from 'discord.js';
import Service from './interfaces/service';
declare module 'discord.js' {
  export class ClientExtended extends Client {
    public commands: Collection<string, Command>;
    public services: Collection<string, Service>;
  }
}
