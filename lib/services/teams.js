class Teams {
    constructor() {
        this.name = "Teams";
        this.ignore = [];
    }
    addIgnore(user) {
        this.ignore.push(user);
    }
    getIgnore() {
        return this.ignore;
    }
    deleteIgnore(user) {
        const userIndex = this.ignore.indexOf(user);
        if (userIndex !== -1) {
            this.ignore.splice(userIndex, 1);
            return true;
        }
        else {
            return false;
        }
    }
    clearIgnore() {
        this.ignore = [];
    }
}
export default Teams;
