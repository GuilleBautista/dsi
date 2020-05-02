//Estructura que representa los datos de una sesion


export interface ISesionData{
    id:string,      //sesion id
    game:string,    //la sesion tiene una partida asociada?
    uid:string      //la sesion tiene un usuario asociado?
    cre_date:number;  //fecha de creacion en juliano
}

export class SesionData{
    id:string;
    game:string;
    uid:string;
    cre_date:number;

    constructor(obj?:ISesionData){
        if(obj!=undefined) Object.assign(this, obj);
    }
}