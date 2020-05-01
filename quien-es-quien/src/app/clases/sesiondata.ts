//Estructura que representa los datos de una sesion
export interface ISesionData{
    id:number,
    path:string
}

export class SesionData{
    id:string;
    path:String;

    constructor(obj?:ISesionData){
        if(obj!=undefined) Object.assign(this, obj);
    }
}