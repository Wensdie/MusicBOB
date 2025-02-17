import { Client } from 'discord.js';
declare module 'discord.js' {
  export class ClientExtended extends Client {
    public commands: Collection<unknown, Command>;
    public services: Collection<unknown, unknown>;
  }
}
