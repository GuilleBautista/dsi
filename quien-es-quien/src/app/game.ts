
export class Game
{
  id_creator: string;
  id_joined: string;
  character_creator: string;
  character_joined: string;
  set: number;
  chat:Array<string>;

  idGame:string;

    constructor(id_creator:string, id_joined:string, character_creator:string, character_joined:string, set:number, chat:Array<string>, idGame:string){
      this.id_creator = id_creator;
      this.id_joined = id_joined;
      this.character_creator = character_creator;
      this.character_joined = character_joined;
      this.set = set;
      this.chat = chat;
      this.idGame = idGame;
    }
}
