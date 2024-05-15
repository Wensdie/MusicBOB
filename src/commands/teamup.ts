import { AnonymousGuild, CacheType, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import MemberTeam from "../interfaces/memberTeam.js";

const teamup = {
    data: new SlashCommandBuilder()
        .setName("teamup")
        .setDescription("Divide people on voice chat into 2 teams or more.")
        .addStringOption(option => 
            option.setName("amount")
                .setDescription("Divide into \"amount\" teams.")
                .setRequired(false)          
    ),
    async execute(interaciton: ChatInputCommandInteraction<CacheType>) {
        if(!(((interaciton.member) as GuildMember).voice.channelId)){
            await interaciton.reply({ content: "You have to join voice chat first.", ephemeral: true })
            return;
        }

        const members = ((((interaciton.member) as GuildMember).voice.channel) as VoiceBasedChannel).members.filter(user => user.displayName !== "MusicBOB");
        
        if(members.size === 1){
            await interaciton.reply({ content: "For ever alone. :(", ephemeral: true });
            return;
        }

        let amount = 0;

        if(interaciton.options.getString("amount")){
            if(Number(interaciton.options.getString("amount")) > 2 && Number(interaciton.options.getString("amount")) < members.size)
                amount = Number(interaciton.options.getString("amount"));
            else{
                await interaciton.reply({ content: "invalid team amount.", ephemeral: true })
                return;
            }
        }
        else{
            amount = 2;
        }

        const numbers: number[] = [];
        let j = 1;
        for(let i = 0; i < members.size; i++){
            numbers.push(j);
            if(j == amount)
                j = 1;
            else
                j++;
        }
        shuffleArray(numbers);
        
        const membersTeams: MemberTeam[] = [];
        
        let i = 0;
        for(const member of members){
            membersTeams.push({
                name: member[1].displayName,
                team: numbers[i]
            });
            i++;
        }   

        let message = "";

        for(let i = 1; i <= amount; i++){
            message += "Team " + i + ":\n"
            for(const member of membersTeams){
                if(member.team == i){
                    message += "⦿ " + member.name + "\n";
                }
            }
            message += "\n\n";
        }

        await interaciton.reply({ content: message });
        return;

        function shuffleArray(array: number[]) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    } 
    
}

export default teamup;