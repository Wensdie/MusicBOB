import { Client } from "discord.js";
import fs from "fs";

async function loadServices(bot: Client){
    try{
        const folderPath = "services";
        const folderFiles = fs.readdirSync(folderPath);
        
        console.log("Loading bot services.")
        
        for(const file of folderFiles){
            const {default: service} = await import("../services/"+ file);
            bot.services.set(service.name);
        }

        console.log("Services loaded succefully.")
    }
    catch (er) {
        console.error("Error loading services: " + er)
    }  
}

export default loadServices;