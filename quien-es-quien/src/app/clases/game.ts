export interface IGame{
  id_creator: string;
  id_joined: string;
  character_creator: string;
  character_joined: string;
  set: number;
  //mensajes del jugador 0
  chat0:string;
  //mensajes del jugador 1
  chat1:string;
  room:string;
  idGame:string;
  winner:string;

}

export class Game
{
  id_creator: string;
  id_joined: string;
  character_creator: string;
  character_joined: string;
  set: number;
  chat0:string;
  chat1:string;
  room:string;
  idGame:string;
  winner:string;

    constructor(obj?:IGame){
      if(obj!=undefined) Object.assign(this, obj);
    }
}
