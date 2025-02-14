import Service from "../interfaces/service.js";


class Teams implements Service{
    public name = "Teams";
    private ignore: string[] = []

    addIgnore(user: string){
        this.ignore.push(user);
    }

    getIgnore(){
        return this.ignore;
    }

    deleteIgnore(user: string): boolean{
        const userIndex = this.ignore.indexOf(user);
        if(userIndex !== -1){
            this.ignore.splice(userIndex, 1);
            return true;
        }
        else{
            return false;
        }
    }

    clearIgnore(){
        this.ignore = [];
    }
}

export default Teams;