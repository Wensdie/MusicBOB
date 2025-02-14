import { AnonymousGuild, CacheType, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import MemberTeam from "../interfaces/memberTeam.js";
import bot from "../bot.js";
import Teams from "../services/teams.js";

const showignore = {
    data: new SlashCommandBuilder()
        .setName("showignore")
        .setDescription("Show ingored users."),

    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        if(!(((interaciton.member) as GuildMember).voice.channelId)){
            await interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true })
            return;
        }

        if(!bot.services.teams){
            bot.services.teams = new Teams();
        }


        if(bot.services.teams.getIgnore().length > 0){
            let ignoringTab = "Ignoring:\n\n";

            for(const ign of bot.services.teams.getIgnore()){
                ignoringTab += "❌ " + ign + "\n";
            }

            await interaciton.reply({ content: ignoringTab })
            return;
        }
        else{
            await interaciton.reply({ content: "No one is ignored right now." })
            return;
        }
    } 
    
}

export default showignore;