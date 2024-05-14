import { Client, Events } from "discord.js";

function eventHandler(bot: Client){
    bot.on(Events.InteractionCreate, 
        async interaction => {
            if(!interaction.isChatInputCommand())
                return;

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error("Command was not found.");
                return;
            }
            
            try{
                await command.execute(interaction);
            }
            catch (er) {
                console.log(er);
            }
        });
}

export default eventHandler;