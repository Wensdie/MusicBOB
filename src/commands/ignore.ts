import { AnonymousGuild, CacheType, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import MemberTeam from "../interfaces/memberTeam.js";
import bot from "../bot.js";
import Teams from "../services/teams.js";

const ignore = {
    data: new SlashCommandBuilder()
        .setName("ignore")
        .setDescription("Ignore user in team building.")
        .addStringOption(option => 
            option.setName("user")
                .setDescription("User to ignore.")
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
        bot.services.teams.addIgnore(user);
        await interaciton.reply({ content: "Ignoring: " + user});
        return;
    } 
    
}

export default ignore;