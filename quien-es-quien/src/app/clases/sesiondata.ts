//Estructura que representa los datos de una sesion


export interface ISesionData{
    id:string,      //sesion id
    game:string,    //la sesion tiene una partida asociada?
    uid:string      //la sesion tiene un usuario asociado?
}

export class SesionData{
    id:string;
    game:string;
    uid:string;

    constructor(obj?:ISesionData){
        if(obj!=undefined) Object.assign(this, obj);
    }
}