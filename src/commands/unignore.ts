import { AnonymousGuild, CacheType, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import MemberTeam from "../interfaces/memberTeam.js";
import bot from "../bot.js";
import Teams from "../services/teams.js";

const unignore = {
    data: new SlashCommandBuilder()
        .setName("unignore")
        .setDescription("Remove user from ignore[].")
        .addStringOption(option => 
            option.setName("user")
                .setDescription("User to unignore.")
                .setRequired(true)          
    ),
    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        if(!(((interaciton.member) as GuildMember).voice.channelId)){
            await interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true })
            return;
        }

        if(!bot.services.teams){
            bot.services.teams = new Teams();
        }


        const user = interaciton.options.getString("user");
        const ifDeleted = bot.services.teams.deleteIgnore(user);
        if(ifDeleted){
            await interaciton.reply({ content: "Unignoring: " + user});
        return;
        }
        else{
            await interaciton.reply({ content: "User not found.", ephemeral: true });
            return;
        }
    } 
    
}

export default unignore;