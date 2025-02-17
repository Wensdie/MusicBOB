import Service from '../interfaces/service.js';

class Teams implements Service {
  public name = 'Teams';
  private ignore: string[] = [];

  public addIgnore(user: string): void {
    this.ignore.push(user);
  }

  public getIgnore(): string[] {
    return this.ignore;
  }

  public deleteIgnore(user: string): boolean {
    const userIndex = this.ignore.indexOf(user);
    if (userIndex !== -1) {
      this.ignore.splice(userIndex, 1);
      return true;
    }
    return false;
  }

  public clearIgnore(): void {
    this.ignore = [];
  }
}

export default Teams;
