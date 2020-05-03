

export interface IGameData{
    set:number,
    npc:string,
    goal:string,
    id:string

}


export class GameData{
    set:number;
    npc:string;
    goal:string;
    id:string;

    constructor(obj?:IGameData){
        if(obj!=undefined) Object.assign(this, obj);
    }
}