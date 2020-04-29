
export interface Iset{
    id:Number,
    path:String
}

export class Set{
    id:Number;
    path:String;

    constructor(obj?:Iset){
        if(obj!=undefined) Object.assign(this, obj);
    }
}