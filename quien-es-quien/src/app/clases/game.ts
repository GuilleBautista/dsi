export interface IGame{
  id_creator: string;
  id_joined: string;
  character_creator: string;
  character_joined: string;
  set: number;
  chat:Array<string>;
  room:string;

}

export class Game
{
  id_creator: string;
  id_joined: string;
  character_creator: string;
  character_joined: string;
  set: number;
  chat:Array<string>;
  room:string;

  idGame:string;

    constructor(obj?:IGame){
      if(obj!=undefined) Object.assign(this, obj);
      //Generamos una sala aleatoria, en el futuro se hara de otra forma
    }
}
